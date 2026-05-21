"use client";

import { useState } from "react";
import {
    CalendarDays,
    Plus,
    Sparkles,
} from "lucide-react";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";
import { getOverdueTasksCount } from "@/features/schedule/lib/schedule-view";
import { DashboardStats } from "./DashboardStats";
import { TodayScheduleCard } from "./TodayScheduleCard";
import { UpcomingTasksCard } from "./UpcomingTasksCard";
import { OverdueTasksBanner } from "@/features/schedule/components/OverdueTasksBanner";
import { EmptyWeekState } from "@/features/schedule/components/EmptyWeekState";

interface DashboardOverviewProps {
    lang: string;
    t: (key: any) => string;
    tasks: ScheduleTask[];
    settings: ScheduleSettings;
    loadingData: boolean;
    onCreateTask: () => void;
    onOpenCalendar: () => void;
    onCopyPreviousWeek: () => Promise<void>;
    onSmartReschedule: () => Promise<void>;
}

export function DashboardOverview({
    lang,
    t,
    tasks,
    settings,
    loadingData,
    onCreateTask,
    onOpenCalendar,
    onCopyPreviousWeek,
    onSmartReschedule,
}: DashboardOverviewProps) {
    const [dismissedOverdue, setDismissedOverdue] = useState(false);

    const overdueCount = getOverdueTasksCount(
        tasks,
        settings.activeDays,
        dismissedOverdue,
    );

    const copy = {
        title:
            lang === "es"
                ? "Organiza tu semana con claridad"
                : "Organize your week with clarity",
        subtitle:
            lang === "es"
                ? "Vista rápida de tus actividades, pendientes y progreso semanal."
                : "A quick view of your activities, pending tasks, and weekly progress.",
        newTask: lang === "es" ? "Nueva actividad" : "New activity",
        openCalendar: lang === "es" ? "Abrir calendario" : "Open calendar",
    };

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
                            <Sparkles size={14} />
                            Aputrak
                        </div>

                        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                            {copy.title}
                        </h1>

                        <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-slate-500">
                            {copy.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                            onClick={onCreateTask}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                        >
                            <Plus size={18} />
                            {copy.newTask}
                        </button>

                        <button
                            onClick={onOpenCalendar}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            <CalendarDays size={18} />
                            {copy.openCalendar}
                        </button>
                    </div>
                </div>
            </section>

            {overdueCount > 0 && !loadingData && (
                <OverdueTasksBanner
                    count={overdueCount}
                    t={t}
                    lang={lang}
                    onDismiss={() => setDismissedOverdue(true)}
                    onSmartReschedule={onSmartReschedule}
                />
            )}

            <DashboardStats lang={lang} tasks={tasks} />

            {tasks.length === 0 && !loadingData ? (
                <EmptyWeekState
                    t={t}
                    onCreateTask={onCreateTask}
                    onCopyPreviousWeek={onCopyPreviousWeek}
                />
            ) : (
                <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                    <TodayScheduleCard lang={lang} tasks={tasks} />
                    <UpcomingTasksCard lang={lang} tasks={tasks} />
                </section>
            )}
        </div>
    );
}