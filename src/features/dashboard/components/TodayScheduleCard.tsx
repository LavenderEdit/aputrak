"use client";

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

export function TodayScheduleCard({ lang, tasks }: TodayScheduleCardProps) {
    const copy = getDashboardCopy(lang);
    const currentDay = getCurrentDayIndex();

    const todayTasks = tasks
        .filter((task) => task.day === currentDay)
        .sort((a, b) => a.startMinute - b.startMinute)
        .slice(0, 6);

    return (
        <article className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-black text-slate-950">
                {copy.today}
            </h2>

            <div className="space-y-3">
                {todayTasks.length > 0 ? (
                    todayTasks.map((task) => {
                        const lines = getTaskLines(task);

                        return (
                            <div
                                key={task.id}
                                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black text-slate-900">
                                            {lines[0] ?? task.text}
                                        </p>

                                        <p className="mt-1 text-xs font-bold text-slate-400">
                                            {formatMinuteClock(task.startMinute)} -{" "}
                                            {formatMinuteClock(task.endMinute)}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500">
                                        {lines.length}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="grid min-h-[180px] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                        <p className="text-sm font-bold text-slate-400">
                            {copy.emptyToday}
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
}