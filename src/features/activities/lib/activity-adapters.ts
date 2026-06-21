import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import {
    DEFAULT_ACTIVITY_TAGS,
    GENERAL_TAG_ID,
} from "@/features/tags/constants/tags.constants";
import type { ActivityTag } from "@/features/tags/types/tag.types";
import type { Activity } from "../types/activity.types";
import {
    formatDateId,
    getWeekDatesFromWeekId,
} from "@/features/calendar/lib/calendar-utils";
import {
    MINUTES_IN_HOUR,
    DEFAULT_TASK_COLOR,
    COLOR_MAP,
} from "@/shared/lib/constants";

function createSubtaskId(taskId: string, index: number) {
    return `${taskId}_subtask_${index}`;
}

export function minutesToTime(minutes: number) {
    const hour = Math.floor(minutes / MINUTES_IN_HOUR);
    const minute = minutes % MINUTES_IN_HOUR;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function timeToMinutes(time: string) {
    const [hour, minute] = time.split(":").map(Number);

    return hour * MINUTES_IN_HOUR + minute;
}

export function normalizeColor(color: string) {
    if (color.startsWith("#")) return color;

    return COLOR_MAP[color] ?? COLOR_MAP[DEFAULT_TASK_COLOR];
}

function getTaskTag(task: ScheduleTask, tags: ActivityTag[]) {
    const taskTagId = task.tagId ?? GENERAL_TAG_ID;

    return (
        tags.find((tag) => tag.id === taskTagId) ??
        tags.find((tag) => tag.id === GENERAL_TAG_ID) ??
        DEFAULT_ACTIVITY_TAGS[0]
    );
}

export function scheduleTaskToActivity(
    task: ScheduleTask,
    weekId: string,
    tags: ActivityTag[] = DEFAULT_ACTIVITY_TAGS,
): Activity {
    const weekDates = getWeekDatesFromWeekId(weekId);
    const date = weekDates[task.day] ?? weekDates[0];
    const tag = getTaskTag(task, tags);

    const lines = task.text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const title = lines[0] ?? "Untitled activity";
    const description = lines.slice(1).join("\n");
    const completed =
        lines.length > 0 && lines.every((_, index) => task.completed[index]);

    return {
        id: task.id,
        title,
        description,
        tagId: tag.id,
        date: formatDateId(date),
        startTime: minutesToTime(task.startMinute),
        endTime: minutesToTime(task.endMinute),
        color: normalizeColor(tag.color ?? task.color),
        status: completed ? "completed" : "pending",
        priority: "none",
        subtasks: lines.map((line, index) => ({
            id: createSubtaskId(task.id, index),
            title: line,
            completed: task.completed[index] ?? false,
        })),
    };
}

export function scheduleTasksToActivities(
    tasks: ScheduleTask[],
    weekId: string,
    tags: ActivityTag[] = DEFAULT_ACTIVITY_TAGS,
) {
    return tasks.map((task) => scheduleTaskToActivity(task, weekId, tags));
}