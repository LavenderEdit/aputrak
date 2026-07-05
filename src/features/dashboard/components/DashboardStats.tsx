"use client";

import {
    CheckCircle2,
    Clock3,
    Layers3,
    TrendingUp,
} from "lucide-react";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import {
    getCompletedSubtasksCount,
    getPendingSubtasksCount,
} from "@/features/schedule/lib/schedule-view";
import { getDashboardCopy } from "../constants/dashboard.constants";

interface DashboardStatsProps {
    lang: string;
    tasks: ScheduleTask[];
}

export function DashboardStats({ lang, tasks }: DashboardStatsProps) {
    const copy = getDashboardCopy(lang);
    const completed = getCompletedSubtasksCount(tasks);
    const pending = getPendingSubtasksCount(tasks);
    const total = completed + pending;
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

    const stats = [
        {
            label: copy.totalActivities,
            value: tasks.length,
            icon: Layers3,
            accent: "#6366F1",
        },
        {
            label: copy.completedTasks,
            value: completed,
            icon: CheckCircle2,
            accent: "#10B981",
        },
        {
            label: copy.pendingTasks,
            value: pending,
            icon: Clock3,
            accent: "#F59E0B",
        },
        {
            label: copy.productivity,
            value: `${productivity}%`,
            icon: TrendingUp,
            accent: "#14B8A6",
        },
    ];

    return (
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <article
                        key={stat.label}
                        className="border-[3px] border-black bg-[#FFFCF4] p-4 shadow-[5px_5px_0_#000] dark:border-white/10 dark:bg-[#111827] dark:shadow-[5px_5px_0_rgba(0,0,0,0.5)]"
                    >
                        <div
                            className="mb-3 flex h-10 w-10 items-center justify-center border-2 border-black"
                            style={{ backgroundColor: `${stat.accent}22` }}
                        >
                            <Icon
                                size={18}
                                strokeWidth={3}
                                style={{ color: stat.accent }}
                            />
                        </div>

                        <div className="font-display text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                            {stat.value}
                        </div>

                        <div className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-white/50">
                            {stat.label}
                        </div>
                    </article>
                );
            })}
        </section>
    );
}