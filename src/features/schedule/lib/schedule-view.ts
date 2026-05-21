import type { ScheduleTask } from "@/features/schedule/types/schedule.types";

export const HOUR_ROW_HEIGHT = 76;

export function getTaskLines(task: ScheduleTask) {
    return task.text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

export function formatMinuteClock(minutes: number) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

export function getTaskDurationLabel(task: ScheduleTask) {
    return `${formatMinuteClock(task.startMinute)} - ${formatMinuteClock(task.endMinute)}`;
}

export function getCurrentDayIndex() {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
}

export function isTaskComplete(task: ScheduleTask) {
    const lines = getTaskLines(task);

    if (lines.length === 0) return false;

    return lines.every((_, index) => task.completed[index]);
}

export function getCompletedSubtasksCount(tasks: ScheduleTask[]) {
    return tasks.reduce((total, task) => {
        const lines = getTaskLines(task);
        return total + lines.filter((_, index) => task.completed[index]).length;
    }, 0);
}

export function getPendingSubtasksCount(tasks: ScheduleTask[]) {
    return tasks.reduce((total, task) => {
        const lines = getTaskLines(task);
        return total + lines.filter((_, index) => !task.completed[index]).length;
    }, 0);
}

export function getOverdueTasksCount(
    tasks: ScheduleTask[],
    activeDays: number[],
    dismissed: boolean,
) {
    if (dismissed) return 0;

    const now = new Date();
    const currentDay = getCurrentDayIndex();
    const currentHour = now.getHours();

    return tasks.reduce((total, task) => {
        if (!activeDays.includes(task.day)) return total;

        const taskHour = Math.floor(task.startMinute / 60);
        const isPast =
            task.day < currentDay ||
            (task.day === currentDay && taskHour < currentHour);

        if (!isPast) return total;

        const lines = getTaskLines(task);

        return total + lines.filter((_, index) => !task.completed[index]).length;
    }, 0);
}