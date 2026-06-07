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
        <article className="border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000]">
            <div className="mb-4 flex items-center justify-between gap-3 border-b-2 border-black pb-3">
                <h3 className="font-display text-base font-black uppercase tracking-[0.08em] text-black">
                    {copy.upcoming}
                </h3>

                <span className="border-2 border-black bg-white px-2 py-1 text-[10px] font-black text-black">
                    {upcomingTasks.length}
                </span>
            </div>

            {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                    {upcomingTasks.map((task) => {
                        const lines = getTaskLines(task);
                        const color = resolveTaskColor(task.color);

                        return (
                            <div
                                key={task.id}
                                className="flex items-start gap-3 border-2 border-black bg-white p-3 transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000]"
                            >
                                <span
                                    className="mt-0.5 h-10 w-2 shrink-0 border-2 border-black"
                                    style={{ backgroundColor: color }}
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-black uppercase tracking-[0.04em] text-black">
                                        {lines[0] ?? task.text}
                                    </div>

                                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                                        {copy.day} {task.day + 1} ·{" "}
                                        {formatMinuteClock(task.startMinute)}
                                    </div>
                                </div>

                                <span
                                    className="shrink-0 border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em]"
                                    style={{ color }}
                                >
                                    {copy.pending}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="border-2 border-dashed border-black bg-white py-8 text-center">
                    <Inbox size={36} className="mx-auto mb-3 text-black" />
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        {copy.noActivitiesYet}
                    </p>
                </div>
            )}
        </article>
    );
}