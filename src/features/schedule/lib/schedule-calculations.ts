import type { ScheduleSettings, ScheduleTask } from "../types/schedule.types";

export function getTaskDuration(task: ScheduleTask) {
    return task.endMinute - task.startMinute;
}

export function doTasksOverlap(first: ScheduleTask, second: ScheduleTask) {
    return (
        first.day === second.day &&
        first.startMinute < second.endMinute &&
        first.endMinute > second.startMinute
    );
}

export function isTaskInsideSettings(
    task: ScheduleTask,
    settings: ScheduleSettings,
) {
    const minMinute = settings.startHour * 60;
    const maxMinute = settings.endHour * 60;

    return (
        settings.activeDays.includes(task.day) &&
        task.startMinute >= minMinute &&
        task.endMinute <= maxMinute
    );
}

export function getTasksForDay(tasks: ScheduleTask[], day: number) {
    return tasks
        .filter((task) => task.day === day)
        .sort((a, b) => a.startMinute - b.startMinute);
}

export function getCompletionRatio(tasks: ScheduleTask[]) {
    const total = tasks.reduce((count, task) => {
        return count + task.text.split("\n").filter((line) => line.trim()).length;
    }, 0);

    const completed = tasks.reduce((count, task) => {
        return count + task.completed.filter(Boolean).length;
    }, 0);

    return {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
}