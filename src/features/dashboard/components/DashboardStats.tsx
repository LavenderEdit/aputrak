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
            bg: "bg-indigo-50",
            fg: "text-primary",
        },
        {
            label: copy.completedTasks,
            value: completed,
            icon: CheckCircle2,
            bg: "bg-emerald-50",
            fg: "text-success",
        },
        {
            label: copy.pendingTasks,
            value: pending,
            icon: Clock3,
            bg: "bg-amber-50",
            fg: "text-accent",
        },
        {
            label: copy.productivity,
            value: `${productivity}%`,
            icon: TrendingUp,
            bg: "bg-teal-50",
            fg: "text-secondary",
        },
    ];

    return (
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <article
                        key={stat.label}
                        className="rounded-xl border border-sborder bg-white p-4"
                    >
                        <div className="mb-2 flex items-center gap-2">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}
                            >
                                <Icon size={16} className={stat.fg} />
                            </div>
                        </div>

                        <div className="font-display text-2xl font-bold text-slate-950">
                            {stat.value}
                        </div>

                        <div className="mt-0.5 text-xs text-muted">{stat.label}</div>
                    </article>
                );
            })}
        </section>
    );
}