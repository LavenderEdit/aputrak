"use client";

import { useState } from "react";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";
import type { PromiseToastMessages } from "@/shared/hooks/useToast";
import { getToastCopy } from "@/shared/constants/toast.constants";
import { GENERAL_TAG_ID } from "@/features/tags/constants/tags.constants";

interface ScheduleData {
    settings: unknown;
    updateSettings: (settings: ScheduleSettings) => Promise<void> | void;
    saveTasks: (tasks: ScheduleTask[]) => Promise<void> | void;
}

interface UseScheduleImportParams {
    lang: string;
    scheduleData: ScheduleData;
    showPromiseToast: <T>(
        promise: Promise<T>,
        messages: PromiseToastMessages<T>,
    ) => Promise<T>;
}

function createTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getCompletedState(text: string, completed?: boolean[]) {
    const lines = text.split("\n").filter((line) => line.trim());

    return lines.map((_, index) => completed?.[index] ?? false);
}

function legacyActivitiesToTasks(activities: Record<string, string>) {
    return Object.entries(activities).map(([key, value]) => {
        const [day, hour] = key.split("-").map(Number);
        const text = String(value);

        return {
            id: createTaskId(),
            day,
            startMinute: hour * 60,
            endMinute: (hour + 1) * 60,
            text,
            tagId: GENERAL_TAG_ID,
            color: "#6366F1",
            completed: getCompletedState(text),
        } satisfies ScheduleTask;
    });
}

function normalizeTask(task: ScheduleTask): ScheduleTask {
    return {
        ...task,
        id: task.id || createTaskId(),
        tagId: task.tagId ?? GENERAL_TAG_ID,
        color: task.color ?? "#6366F1",
        completed: getCompletedState(task.text, task.completed),
    };
}

export function useScheduleImport({
    lang,
    scheduleData,
    showPromiseToast,
}: UseScheduleImportParams) {
    const toastCopy = getToastCopy(lang);
    const [importLoading, setImportLoading] = useState(false);

    const handleImportJSON = async (file: File) => {
        const importTask = async () => {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.settings) {
                throw new Error("Invalid backup: missing settings");
            }

            const tasks: ScheduleTask[] = Array.isArray(data.tasks)
                ? data.tasks.map(normalizeTask)
                : data.activities && typeof data.activities === "object"
                    ? legacyActivitiesToTasks(data.activities)
                    : [];

            if (!tasks.length) {
                throw new Error("Invalid backup: missing tasks");
            }

            await scheduleData.updateSettings(data.settings);
            await scheduleData.saveTasks(tasks);
        };

        try {
            setImportLoading(true);
            await showPromiseToast(importTask(), toastCopy.importBackup);
        } catch (error) {
            console.error(error);
        } finally {
            setImportLoading(false);
        }
    };

    return {
        importLoading,
        handleImportJSON,
    };
}