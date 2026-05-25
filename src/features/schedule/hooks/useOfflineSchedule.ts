"use client";

import { useEffect, useRef, useState } from "react";
import { DB } from "@/shared/lib/db";
import { Utils } from "@/shared/lib/utils";
import { DEFAULT_SETTINGS } from "@/shared/lib/constants";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";

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
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function parseLegacyTaskValue(value: string) {
    if (!value.startsWith("{")) {
        return {
            text: value,
            color: "indigo",
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
            color: parsed.color ?? "indigo",
            completed: parsed.completed ?? [],
        };
    } catch {
        return {
            text: value,
            color: "indigo",
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
            startMinute: hour * 60,
            endMinute: (hour + 1) * 60,
            text: parsedValue.text,
            color: parsedValue.color,
            completed: parsedValue.completed,
        };
    });
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
                const weekData = await DB.get<StoredWeek>("weeks", weekId);
                const rawData = weekData?.data ?? [];

                let loadedTasks: ScheduleTask[] = [];

                if (Array.isArray(rawData)) {
                    loadedTasks = rawData;
                } else if (Object.keys(rawData).length > 0) {
                    loadedTasks = migrateLegacyWeekData(rawData);
                    await DB.put("weeks", { id: weekId, data: loadedTasks });
                }

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
        await DB.put("weeks", { id: weekId, data: nextTasks });
    };

    const saveTask = async (task: ScheduleTask) => {
        const currentTasks = tasksRef.current;
        const existingIdx = currentTasks.findIndex((item) => item.id === task.id);

        const nextTasks =
            existingIdx >= 0
                ? currentTasks.map((item) => (item.id === task.id ? task : item))
                : [...currentTasks, task];

        await persistTasks(nextTasks);
    };

    const saveTasks = async (incomingTasks: ScheduleTask[]) => {
        if (incomingTasks.length === 0) return;

        const taskMap = new Map(tasksRef.current.map((task) => [task.id, task]));

        incomingTasks.forEach((task) => {
            taskMap.set(task.id, task);
        });

        await persistTasks(Array.from(taskMap.values()));
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
            const startMinute = targetHour * 60;

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
            prevDate.setDate(prevDate.getDate() - 7);

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
        const jsDay = now.getDay();
        const currentDayIdx = jsDay === 0 ? 6 : jsDay - 1;
        const currentHour = now.getHours();

        const newTasks = [...tasksRef.current];
        const tasksToMove: ScheduleTask[] = [];

        for (let index = newTasks.length - 1; index >= 0; index--) {
            const task = newTasks[index];

            if (!settings.activeDays.includes(task.day)) continue;

            const taskHour = Math.floor(task.startMinute / 60);
            const isPast =
                task.day < currentDayIdx ||
                (task.day === currentDayIdx && taskHour < currentHour);

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
                    color: task.color,
                    completed: [false],
                });
            });

            if (!hasIncomplete) continue;

            if (remainingLines.length === 0) {
                newTasks.splice(index, 1);
            } else {
                newTasks[index] = {
                    ...task,
                    text: remainingLines.join("\n"),
                    completed: remainingCompleted,
                };
            }
        }

        if (tasksToMove.length === 0) {
            return {
                success: false,
                reason: "no-tasks",
            };
        }

        const futureDays = settings.activeDays
            .filter((day) => day >= currentDayIdx)
            .sort((a, b) => a - b);

        const emptySlots: Array<{
            day: number;
            startMinute: number;
            endMinute: number;
        }> = [];

        for (const day of futureDays) {
            for (let hour = settings.startHour; hour < settings.endHour; hour++) {
                if (day === currentDayIdx && hour <= currentHour) continue;

                const startMinute = hour * 60;
                const endMinute = (hour + 1) * 60;

                const isOccupied = newTasks.some(
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

        if (emptySlots.length < tasksToMove.length) {
            return {
                success: false,
                reason: "no-space",
            };
        }

        tasksToMove.forEach((task, index) => {
            const slot = emptySlots[index];

            newTasks.push({
                ...task,
                day: slot.day,
                startMinute: slot.startMinute,
                endMinute: slot.endMinute,
            });
        });

        await persistTasks(newTasks);
        return {
            success: true,
        };
    };

    const updateSettings = async (newSettings: ScheduleSettings) => {
        setSettings(newSettings);
        await DB.put("settings", { id: "global", ...newSettings });
    };

    const changeWeek = (direction: number) => {
        const newDate = new Date(currentWeekDate);
        newDate.setDate(newDate.getDate() + direction * 7);
        setCurrentWeekDate(newDate);
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
    };
};