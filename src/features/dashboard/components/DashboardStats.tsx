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

interface DashboardStatsProps {
    lang: string;
    tasks: ScheduleTask[];
}

export function DashboardStats({ lang, tasks }: DashboardStatsProps) {
    const completed = getCompletedSubtasksCount(tasks);
    const pending = getPendingSubtasksCount(tasks);
    const total = completed + pending;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const stats = [
        {
            label: lang === "es" ? "Actividades" : "Activities",
            value: tasks.length,
            icon: Layers3,
            className: "bg-indigo-50 text-indigo-700",
        },
        {
            label: lang === "es" ? "Completadas" : "Completed",
            value: completed,
            icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-700",
        },
        {
            label: lang === "es" ? "Pendientes" : "Pending",
            value: pending,
            icon: Clock3,
            className: "bg-amber-50 text-amber-700",
        },
        {
            label: lang === "es" ? "Progreso" : "Progress",
            value: `${progress}%`,
            icon: TrendingUp,
            className: "bg-cyan-50 text-cyan-700",
        },
    ];

    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <article
                        key={stat.label}
                        className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl"
                    >
                        <div
                            className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${stat.className}`}
                        >
                            <Icon size={20} />
                        </div>

                        <p className="text-3xl font-black tracking-tight text-slate-950">
                            {stat.value}
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-500">
                            {stat.label}
                        </p>
                    </article>
                );
            })}
        </section>
    );
}