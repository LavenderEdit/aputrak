"use client";

import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import type { PromiseToastMessages } from "@/shared/hooks/useToast";
import { getToastCopy } from "@/shared/constants/toast.constants";
import type { ParsedScheduleItem } from "../lib/scheduleParser";
import { getImportCopy } from "../constants/import.constants";
import { parsedScheduleItemsToTasks } from "../lib/schedule-item-mapper";

interface ScheduleData {
    saveTasks: (tasks: ScheduleTask[]) => Promise<void> | void;
    saveTasksForWeek: (
        weekId: string,
        tasks: ScheduleTask[],
    ) => Promise<void> | void;
    goToWeek: (weekId: string) => void;
}

interface UseScheduleImageImportParams {
    lang: string;
    scheduleData: ScheduleData;
    showPromiseToast: <T>(
        promise: Promise<T>,
        messages: PromiseToastMessages<T>,
    ) => Promise<T>;
}

interface ImageImportResult {
    total: number;
    imported: number;
    skipped: number;
    weekId: string | null;
}

export function useScheduleImageImport({
    lang,
    scheduleData,
    showPromiseToast,
}: UseScheduleImageImportParams) {
    const copy = getImportCopy(lang);
    const toastCopy = getToastCopy(lang);

    const handleImportImageItems = async (
        items: ParsedScheduleItem[],
        detectedWeekId?: string | null,
    ): Promise<void> => {
        const importTask = async (): Promise<ImageImportResult> => {
            const tasks = parsedScheduleItemsToTasks(items, {
                fallbackTitle: copy.untitledActivity,
                color: "indigo",
            });

            if (tasks.length === 0) {
                throw new Error("No valid OCR activities to import.");
            }

            if (detectedWeekId) {
                await scheduleData.saveTasksForWeek(detectedWeekId, tasks);
                scheduleData.goToWeek(detectedWeekId);
            } else {
                await scheduleData.saveTasks(tasks);
            }

            return {
                total: items.length,
                imported: tasks.length,
                skipped: items.length - tasks.length,
                weekId: detectedWeekId ?? null,
            };
        };

        try {
            await showPromiseToast(importTask(), {
                loading: toastCopy.importImage.loading,
                success: (result) => ({
                    title: toastCopy.importImage.success.title,
                    description:
                        result.skipped > 0
                            ? `${result.imported} actividades importadas. ${result.skipped} no se pudieron convertir.`
                            : `${result.imported} actividades importadas correctamente.`,
                }),
                error: toastCopy.importImage.error,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return {
        handleImportImageItems,
    };
}