"use client";

import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import {
    formatMinuteClock,
    getTaskLines,
    isTaskComplete,
} from "@/features/schedule/lib/schedule-view";

interface UpcomingTasksCardProps {
    lang: string;
    tasks: ScheduleTask[];
}

export function UpcomingTasksCard({ lang, tasks }: UpcomingTasksCardProps) {
    const upcomingTasks = tasks
        .filter((task) => !isTaskComplete(task))
        .sort((a, b) => a.day - b.day || a.startMinute - b.startMinute)
        .slice(0, 6);

    return (
        <article className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-black text-slate-950">
                {lang === "es" ? "Pendientes próximos" : "Upcoming pending"}
            </h2>

            <div className="space-y-3">
                {upcomingTasks.length > 0 ? (
                    upcomingTasks.map((task) => {
                        const lines = getTaskLines(task);

                        return (
                            <div
                                key={task.id}
                                className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                            >
                                <div className="h-10 w-1 rounded-full bg-indigo-600" />

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-black text-slate-800">
                                        {lines[0] ?? task.text}
                                    </p>

                                    <p className="text-xs font-bold text-slate-400">
                                        Día {task.day + 1} · {formatMinuteClock(task.startMinute)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="grid min-h-[180px] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                        <p className="text-sm font-bold text-slate-400">
                            {lang === "es"
                                ? "Nada pendiente por ahora."
                                : "Nothing pending for now."}
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
}