"use client";

import { useEffect, useRef, useState } from "react";
import { DB } from "@/shared/lib/db";
import { SyncManager } from "@/shared/lib/sync";
import { Utils } from "@/shared/lib/utils";
import {
    BASE_RADIX_36,
    DAYS_IN_WEEK,
    DEFAULT_SETTINGS,
    DEFAULT_TASK_COLOR,
    MINUTES_IN_HOUR,
} from "@/shared/lib/constants";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";
import { GENERAL_TAG_ID } from "@/features/tags/constants/tags.constants";

type LegacyWeekData = Record<string, string>;

interface StoredWeek {
    id: string;
    data: ScheduleTask[] | LegacyWeekData;
}

interface SmartRescheduleResult {
    success: boolean;
    reason?: "no-tasks" | "no-space";
}

function createTaskId(prefix = "task") {
    return `${prefix}_${Date.now()}_${Math.random().toString(BASE_RADIX_36).substring(2, 9)}`;
}

function parseLegacyTaskValue(value: string) {
    if (!value.startsWith("{")) {
        return {
            text: value,
            color: DEFAULT_TASK_COLOR,
            completed: [] as boolean[],
        };
    }

    try {
        const parsed = JSON.parse(value) as {
            text?: string;
            color?: string;
            completed?: boolean[];
        };

        return {
            text: parsed.text ?? value,
            color: parsed.color ?? DEFAULT_TASK_COLOR,
            completed: parsed.completed ?? [],
        };
    } catch {
        return {
            text: value,
            color: DEFAULT_TASK_COLOR,
            completed: [] as boolean[],
        };
    }
}

function migrateLegacyWeekData(data: LegacyWeekData): ScheduleTask[] {
    return Object.entries(data).map(([key, value]) => {
        const [dayStr, hourStr] = key.split("-");
        const day = Number(dayStr);
        const hour = Number(hourStr);
        const parsedValue = parseLegacyTaskValue(value);

        return {
            id: createTaskId(`task_${day}_${hour}`),
            day,
            startMinute: hour * MINUTES_IN_HOUR,
            endMinute: (hour + 1) * MINUTES_IN_HOUR,
            text: parsedValue.text,
            tagId: GENERAL_TAG_ID,
            color: parsedValue.color,
            completed: parsedValue.completed,
        };
    });
}

function normalizeTask(task: ScheduleTask): ScheduleTask {
    return {
        ...task,
        tagId: task.tagId ?? GENERAL_TAG_ID,
        color: task.color ?? DEFAULT_TASK_COLOR,
        completed: task.completed ?? [],
    };
}

function getTaskSlotKey(task: ScheduleTask) {
    return `${task.day}-${task.startMinute}-${task.endMinute}`;
}

function dedupeTasksBySlot(tasks: ScheduleTask[]) {
    const taskMap = new Map<string, ScheduleTask>();

    tasks.forEach((task) => {
        taskMap.set(getTaskSlotKey(task), task);
    });

    return Array.from(taskMap.values());
}

function mergeTasksBySlot(
    existingTasks: ScheduleTask[],
    incomingTasks: ScheduleTask[],
) {
    const incomingSlotKeys = new Set(incomingTasks.map(getTaskSlotKey));

    const preservedTasks = existingTasks.filter(
        (task) => !incomingSlotKeys.has(getTaskSlotKey(task)),
    );

    return dedupeTasksBySlot([...preservedTasks, ...incomingTasks]);
}

async function readWeekTasks(targetWeekId: string) {
    const weekData = await DB.get<StoredWeek>("weeks", targetWeekId);
    const rawData = weekData?.data ?? [];

    let weekTasks: ScheduleTask[] = [];

    if (Array.isArray(rawData)) {
        weekTasks = rawData;
    } else if (Object.keys(rawData).length > 0) {
        weekTasks = migrateLegacyWeekData(rawData);
    }

    const normalizedTasks = dedupeTasksBySlot(weekTasks.map(normalizeTask));

    await DB.put("weeks", { id: targetWeekId, data: normalizedTasks });

    return normalizedTasks;
}

interface ExtractedTasksResult {
    updatedTasks: ScheduleTask[];
    tasksToMove: ScheduleTask[];
}

interface Slot {
    day: number;
    startMinute: number;
    endMinute: number;
}

function extractPastIncompleteTasks(
    tasks: ScheduleTask[],
    activeDays: number[],
    currentDayOfWeekIndex: number,
    currentHour: number,
): ExtractedTasksResult {
    const updatedTasks = [...tasks];
    const tasksToMove: ScheduleTask[] = [];

    for (let index = updatedTasks.length - 1; index >= 0; index--) {
        const task = updatedTasks[index];

        if (!activeDays.includes(task.day)) continue;

        const taskHour = Math.floor(task.startMinute / MINUTES_IN_HOUR);
        const isPast =
            task.day < currentDayOfWeekIndex ||
            (task.day === currentDayOfWeekIndex && taskHour < currentHour);

        if (!isPast) continue;

        const lines = task.text.split("\n").filter((line) => line.trim() !== "");
        let hasIncomplete = false;
        const remainingLines: string[] = [];
        const remainingCompleted: boolean[] = [];

        lines.forEach((line, lineIndex) => {
            if (task.completed[lineIndex]) {
                remainingLines.push(line);
                remainingCompleted.push(true);
                return;
            }

            hasIncomplete = true;
            tasksToMove.push({
                id: createTaskId("task_resched"),
                day: -1,
                startMinute: -1,
                endMinute: -1,
                text: line,
                tagId: task.tagId,
                color: task.color,
                completed: [false],
            });
        });

        if (!hasIncomplete) continue;

        if (remainingLines.length === 0) {
            updatedTasks.splice(index, 1);
        } else {
            updatedTasks[index] = {
                ...task,
                text: remainingLines.join("\n"),
                completed: remainingCompleted,
            };
        }
    }

    return { updatedTasks, tasksToMove };
}

function findAvailableFutureSlots(
    tasks: ScheduleTask[],
    settings: ScheduleSettings,
    currentDayOfWeekIndex: number,
    currentHour: number,
): Slot[] {
    const futureDays = settings.activeDays
        .filter((day) => day >= currentDayOfWeekIndex)
        .sort((a, b) => a - b);

    const emptySlots: Slot[] = [];

    for (const day of futureDays) {
        for (let hour = settings.startHour; hour < settings.endHour; hour++) {
            if (day === currentDayOfWeekIndex && hour <= currentHour) continue;

            const startMinute = hour * MINUTES_IN_HOUR;
            const endMinute = (hour + 1) * MINUTES_IN_HOUR;

            const isOccupied = tasks.some(
                (task) =>
                    task.day === day &&
                    task.startMinute < endMinute &&
                    task.endMinute > startMinute,
            );

            if (!isOccupied) {
                emptySlots.push({
                    day,
                    startMinute,
                    endMinute,
                });
            }
        }
    }

    return emptySlots;
}

function allocateTasksToSlots(
    tasks: ScheduleTask[],
    tasksToMove: ScheduleTask[],
    emptySlots: Slot[],
): ScheduleTask[] {
    const finalTasks = [...tasks];

    tasksToMove.forEach((task, index) => {
        const slot = emptySlots[index];

        finalTasks.push({
            ...task,
            day: slot.day,
            startMinute: slot.startMinute,
            endMinute: slot.endMinute,
        });
    });

    return finalTasks;
}

export const useOfflineSchedule = () => {
    const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
    const weekId = Utils.getWeekStartIdentifier(currentWeekDate);

    const [settings, setSettings] = useState<ScheduleSettings>(DEFAULT_SETTINGS);
    const [tasks, setTasks] = useState<ScheduleTask[]>([]);
    const tasksRef = useRef<ScheduleTask[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            const savedSettings = await DB.get<ScheduleSettings>("settings", "global");

            if (savedSettings) {
                setSettings(savedSettings);
            }
        };

        loadSettings();
    }, []);

    useEffect(() => {
        const loadWeek = async () => {
            setLoadingData(true);

            try {
                const loadedTasks = await readWeekTasks(weekId);

                tasksRef.current = loadedTasks;
                setTasks(loadedTasks);
            } finally {
                setLoadingData(false);
            }
        };

        loadWeek();
    }, [weekId]);

    const persistTasks = async (nextTasks: ScheduleTask[]) => {
        tasksRef.current = nextTasks;
        setTasks(nextTasks);
        const dataToSave = { id: weekId, data: nextTasks };
        await DB.put("weeks", dataToSave);
        await SyncManager.queueMutation('aputrak_schedule', weekId, 'UPDATE', dataToSave);
    };

    const saveTask = async (task: ScheduleTask) => {
        const currentTasks = tasksRef.current;
        const existingTaskIndex = currentTasks.findIndex((item) => item.id === task.id);

        const nextTasks =
            existingTaskIndex >= 0
                ? currentTasks.map((item) => (item.id === task.id ? task : item))
                : [...currentTasks, task];

        await persistTasks(nextTasks);
    };

    const saveTasks = async (incomingTasks: ScheduleTask[]) => {
        if (incomingTasks.length === 0) return;

        const nextTasks = mergeTasksBySlot(tasksRef.current, incomingTasks);

        await persistTasks(nextTasks);
    };

    const deleteTask = async (taskId: string) => {
        const nextTasks = tasksRef.current.filter((task) => task.id !== taskId);

        await persistTasks(nextTasks);
    };

    const toggleTaskComplete = async (taskId: string, index: number) => {
        const nextTasks = tasksRef.current.map((task) => {
            if (task.id !== taskId) return task;

            const completed = [...task.completed];
            completed[index] = !completed[index];

            return {
                ...task,
                completed,
            };
        });

        await persistTasks(nextTasks);
    };

    const moveTask = async (
        taskId: string,
        targetDay: number,
        targetHour: number,
    ) => {
        const nextTasks = tasksRef.current.map((task) => {
            if (task.id !== taskId) return task;

            const duration = task.endMinute - task.startMinute;
            const startMinute = targetHour * MINUTES_IN_HOUR;

            return {
                ...task,
                day: targetDay,
                startMinute,
                endMinute: startMinute + duration,
            };
        });

        await persistTasks(nextTasks);
    };

    const copyPreviousWeek = async () => {
        try {
            const prevDate = new Date(currentWeekDate);
            prevDate.setDate(prevDate.getDate() - DAYS_IN_WEEK);

            const prevWeekId = Utils.getWeekStartIdentifier(prevDate);
            const prevWeekData = await DB.get<StoredWeek>("weeks", prevWeekId);

            if (!prevWeekData?.data || !Array.isArray(prevWeekData.data)) {
                return false;
            }

            if (prevWeekData.data.length === 0) {
                return false;
            }

            const clonedTasks = prevWeekData.data.map((task) => ({
                ...task,
                id: createTaskId(),
                completed: task.completed.map(() => false),
            }));

            await persistTasks(clonedTasks);
            return true;
        } catch {
            return false;
        }
    };

    const smartReschedule = async (): Promise<SmartRescheduleResult> => {
        const now = new Date();
        const dayOfWeekFromDate = now.getDay();
        // Convertimos Domingo (0) a 6, y Lunes (1) a 0 para que coincida con el índice de la vista semanal (Lunes-Domingo)
        const currentDayOfWeekIndex = dayOfWeekFromDate === 0 ? DAYS_IN_WEEK - 1 : dayOfWeekFromDate - 1;
        const currentHour = now.getHours();

        const { updatedTasks, tasksToMove } = extractPastIncompleteTasks(
            tasksRef.current,
            settings.activeDays,
            currentDayOfWeekIndex,
            currentHour,
        );

        if (tasksToMove.length === 0) {
            return {
                success: false,
                reason: "no-tasks",
            };
        }

        const emptySlots = findAvailableFutureSlots(
            updatedTasks,
            settings,
            currentDayOfWeekIndex,
            currentHour,
        );

        if (emptySlots.length < tasksToMove.length) {
            return {
                success: false,
                reason: "no-space",
            };
        }

        const finalTasks = allocateTasksToSlots(updatedTasks, tasksToMove, emptySlots);
        await persistTasks(finalTasks);

        return {
            success: true,
        };
    };

    const updateSettings = async (newSettings: ScheduleSettings) => {
        setSettings(newSettings);
        const dataToSave = { id: "global", ...newSettings };
        await DB.put("settings", dataToSave);
        await SyncManager.queueMutation('aputrak_settings', "global", 'UPDATE', dataToSave);
    };

    const changeWeek = (direction: number) => {
        const newDate = new Date(currentWeekDate);
        newDate.setDate(newDate.getDate() + direction * DAYS_IN_WEEK);
        setCurrentWeekDate(newDate);
    };

    const goToWeek = (targetWeekId: string) => {
        setCurrentWeekDate(new Date(`${targetWeekId}T00:00:00`));
    };

    const saveTasksForWeek = async (
        targetWeekId: string,
        incomingTasks: ScheduleTask[],
    ) => {
        if (incomingTasks.length === 0) return;

        const existingTasks = await readWeekTasks(targetWeekId);
        const nextTasks = mergeTasksBySlot(existingTasks, incomingTasks);

        const dataToSave = { id: targetWeekId, data: nextTasks };
        await DB.put("weeks", dataToSave);
        await SyncManager.queueMutation('aputrak_schedule', targetWeekId, 'UPDATE', dataToSave);

        if (targetWeekId === weekId) {
            tasksRef.current = nextTasks;
            setTasks(nextTasks);
        }
    };

    return {
        weekId,
        settings,
        tasks,
        loadingData,
        saveTask,
        saveTasks,
        deleteTask,
        toggleTaskComplete,
        moveTask,
        copyPreviousWeek,
        smartReschedule,
        updateSettings,
        changeWeek,
        saveTasksForWeek,
        goToWeek,
        getTasksForWeek: readWeekTasks,
    };
};