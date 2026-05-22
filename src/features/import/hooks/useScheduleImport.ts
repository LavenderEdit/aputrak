"use client";

import { useState } from "react";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";
import type { PromiseToastMessages } from "@/shared/hooks/useToast";
import { getToastCopy } from "@/shared/constants/toast.constants";

interface ScheduleData {
    settings: unknown;
    updateSettings: (settings: ScheduleSettings) => Promise<void> | void;
    saveTask: (task: ScheduleTask) => Promise<void> | void;
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

function legacyActivitiesToTasks(activities: Record<string, string>) {
    return Object.entries(activities).map(([key, value]) => {
        const [day, hour] = key.split("-").map(Number);
        const lines = String(value)
            .split("\n")
            .filter((line) => line.trim());

        return {
            id: createTaskId(),
            day,
            startMinute: hour * 60,
            endMinute: (hour + 1) * 60,
            text: String(value),
            color: "indigo",
            completed: lines.map(() => false),
        } satisfies ScheduleTask;
    });
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

            await scheduleData.updateSettings(data.settings);

            const tasks: ScheduleTask[] = Array.isArray(data.tasks)
                ? data.tasks
                : data.activities && typeof data.activities === "object"
                    ? legacyActivitiesToTasks(data.activities)
                    : [];

            if (!tasks.length) {
                throw new Error("Invalid backup: missing tasks");
            }

            for (const task of tasks) {
                await scheduleData.saveTask({
                    ...task,
                    id: task.id || createTaskId(),
                    completed:
                        Array.isArray(task.completed) && task.completed.length > 0
                            ? task.completed
                            : task.text
                                .split("\n")
                                .filter((line) => line.trim())
                                .map(() => false),
                });
            }
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