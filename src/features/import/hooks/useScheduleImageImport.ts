"use client";

import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
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
}

export function useScheduleImageImport({
    lang,
    scheduleData,
}: UseScheduleImageImportParams) {
    const copy = getImportCopy(lang);

    const handleImportImageItems = async (
        items: ParsedScheduleItem[],
        detectedWeekId?: string | null,
    ): Promise<void> => {
        const tasks = parsedScheduleItemsToTasks(items, {
            fallbackTitle: copy.untitledActivity,
            color: "indigo",
        });

        if (detectedWeekId) {
            await scheduleData.saveTasksForWeek(detectedWeekId, tasks);
            scheduleData.goToWeek(detectedWeekId);
            return;
        }

        await scheduleData.saveTasks(tasks);
    };

    return {
        handleImportImageItems,
    };
}