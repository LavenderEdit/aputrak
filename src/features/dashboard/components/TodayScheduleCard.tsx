"use client";

import { CalendarDays } from "lucide-react";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import {
    formatMinuteClock,
    getCurrentDayIndex,
    getTaskLines,
} from "@/features/schedule/lib/schedule-view";
import { getDashboardCopy } from "../constants/dashboard.constants";

interface TodayScheduleCardProps {
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

export function TodayScheduleCard({ lang, tasks }: TodayScheduleCardProps) {
    const copy = getDashboardCopy(lang);
    const currentDay = getCurrentDayIndex();

    const todayTasks = tasks
        .filter((task) => task.day === currentDay)
        .sort((a, b) => a.startMinute - b.startMinute)
        .slice(0, 6);

    return (
        <article className="rounded-xl border border-sborder bg-white p-5">
            <h3 className="font-display mb-4 text-base font-bold text-slate-950">
                {copy.todaySchedule}
            </h3>

            {todayTasks.length > 0 ? (
                <div>
                    {todayTasks.map((task) => {
                        const lines = getTaskLines(task);
                        const color = resolveTaskColor(task.color);
                        const completed = lines.length > 0 && lines.every((_, index) => task.completed[index]);

                        return (
                            <button
                                key={task.id}
                                className="-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-start gap-3 rounded-lg border-b border-sborder px-2 py-2.5 text-left transition last:border-0 hover:bg-slate-50"
                            >
                                <span
                                    className="mt-0.5 h-10 w-1 shrink-0 rounded-full"
                                    style={{ backgroundColor: color }}
                                />

                                <div className="min-w-0 flex-1">
                                    <div
                                        className={`text-sm font-medium ${completed ? "text-muted line-through" : "text-slate-900"
                                            }`}
                                    >
                                        {lines[0] ?? task.text}
                                    </div>

                                    <div className="text-xs text-muted">
                                        {formatMinuteClock(task.startMinute)} -{" "}
                                        {formatMinuteClock(task.endMinute)}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="py-8 text-center text-muted">
                    <CalendarDays size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{copy.noTasks}</p>
                </div>
            )}
        </article>
    );
}