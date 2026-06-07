import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import type { ParsedScheduleItem } from "./scheduleParser";
import {
    DEFAULT_ACTIVITY_TAGS,
    GENERAL_TAG_ID,
} from "@/features/tags/constants/tags.constants";

const DAY_TO_INDEX: Record<string, number> = {
    Lunes: 0,
    Martes: 1,
    Miércoles: 2,
    Jueves: 3,
    Viernes: 4,
    Sábado: 5,
    Domingo: 6,
};

interface MapperOptions {
    fallbackTitle: string;
    color?: string;
}

function createTaskId() {
    return `task_ocr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function timeToMinutes(time: string) {
    const [hour, minute] = time.split(":").map(Number);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
        return null;
    }

    return hour * 60 + minute;
}

export function dayLabelToIndex(day: string) {
    return DAY_TO_INDEX[day] ?? null;
}

export function parsedScheduleItemToTask(
    item: ParsedScheduleItem,
    options: MapperOptions,
): ScheduleTask | null {
    const day = dayLabelToIndex(item.day);
    const startMinute = timeToMinutes(item.startTime);
    const rawEndMinute = timeToMinutes(item.endTime);

    if (day === null || startMinute === null || rawEndMinute === null) {
        return null;
    }

    const endMinute =
        rawEndMinute > startMinute ? rawEndMinute : startMinute + 60;

    const text = item.title.trim() || options.fallbackTitle;

    return {
        id: createTaskId(),
        day,
        startMinute,
        endMinute,
        text,
        tagId: GENERAL_TAG_ID,
        color: DEFAULT_ACTIVITY_TAGS[0]?.color ?? options.color ?? "#6366F1",
        completed: [false],
    };
}

export function parsedScheduleItemsToTasks(
    items: ParsedScheduleItem[],
    options: MapperOptions,
) {
    return items
        .map((item) => parsedScheduleItemToTask(item, options))
        .filter((task): task is ScheduleTask => Boolean(task));
}