"use client";

import { Inbox } from "lucide-react";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import {
    formatMinuteClock,
    getTaskLines,
    isTaskComplete,
} from "@/features/schedule/lib/schedule-view";
import { getDashboardCopy } from "../constants/dashboard.constants";

interface UpcomingTasksCardProps {
    lang: string;
    tasks: ScheduleTask[];
}

function resolveTaskColor(color: string) {
    const map: Record<string, string> = {
        indigo: "#6366F1",
        teal: "#14B8A6",
        amber: "#F59E0B",
        rose: "#EC4899",
        violet: "#8B5CF6",
        emerald: "#10B981",
        red: "#EF4444",
    };

    return color.startsWith("#") ? color : map[color] ?? "#6366F1";
}

export function UpcomingTasksCard({ lang, tasks }: UpcomingTasksCardProps) {
    const copy = getDashboardCopy(lang);

    const upcomingTasks = tasks
        .filter((task) => !isTaskComplete(task))
        .sort((a, b) => a.day - b.day || a.startMinute - b.startMinute)
        .slice(0, 5);

    return (
        <article className="rounded-xl border border-sborder bg-white p-5">
            <h3 className="font-display mb-4 text-base font-bold text-slate-950">
                {copy.upcoming}
            </h3>

            {upcomingTasks.length > 0 ? (
                <div>
                    {upcomingTasks.map((task) => {
                        const lines = getTaskLines(task);
                        const color = resolveTaskColor(task.color);

                        return (
                            <div
                                key={task.id}
                                className="-mx-2 flex items-start gap-3 rounded-lg border-b border-sborder px-2 py-2.5 transition last:border-0 hover:bg-slate-50"
                            >
                                <span
                                    className="mt-0.5 h-10 w-1 shrink-0 rounded-full"
                                    style={{ backgroundColor: color }}
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium text-slate-900">
                                        {lines[0] ?? task.text}
                                    </div>

                                    <div className="text-xs text-muted">
                                        {lang === "es" ? "Día" : "Day"} {task.day + 1} ·{" "}
                                        {formatMinuteClock(task.startMinute)}
                                    </div>
                                </div>

                                <span
                                    className="tag-pill shrink-0"
                                    style={{
                                        backgroundColor: `${color}18`,
                                        color,
                                    }}
                                >
                                    {lang === "es" ? "Pendiente" : "Pending"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-8 text-center text-muted">
                    <Inbox size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{copy.noActivitiesYet}</p>
                </div>
            )}
        </article>
    );
}