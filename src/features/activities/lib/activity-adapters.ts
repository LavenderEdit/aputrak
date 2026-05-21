import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import type { Activity } from "../types/activity.types";
import { formatDateId, getWeekDatesFromWeekId } from "@/features/calendar/lib/calendar-utils";

function createSubtaskId(taskId: string, index: number) {
    return `${taskId}_subtask_${index}`;
}

export function minutesToTime(minutes: number) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function timeToMinutes(time: string) {
    const [hour, minute] = time.split(":").map(Number);

    return hour * 60 + minute;
}

export function normalizeColor(color: string) {
    if (color.startsWith("#")) return color;

    const colorMap: Record<string, string> = {
        indigo: "#6366F1",
        teal: "#14B8A6",
        amber: "#F59E0B",
        rose: "#EC4899",
        violet: "#8B5CF6",
        emerald: "#10B981",
        red: "#EF4444",
    };

    return colorMap[color] ?? "#6366F1";
}

export function scheduleTaskToActivity(
    task: ScheduleTask,
    weekId: string,
): Activity {
    const weekDates = getWeekDatesFromWeekId(weekId);
    const date = weekDates[task.day] ?? weekDates[0];

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
        tagId: "study",
        date: formatDateId(date),
        startTime: minutesToTime(task.startMinute),
        endTime: minutesToTime(task.endMinute),
        color: normalizeColor(task.color),
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
) {
    return tasks.map((task) => scheduleTaskToActivity(task, weekId));
}