"use client";

import { useState } from "react";
import {
    CalendarDays,
    FileInput,
    FileText,
    Plus,
} from "lucide-react";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";
import { getOverdueTasksCount } from "@/features/schedule/lib/schedule-view";
import { OverdueTasksBanner } from "@/features/schedule/components/OverdueTasksBanner";
import { EmptyWeekState } from "@/features/schedule/components/EmptyWeekState";
import type { TranslateFn } from "@/shared/types/i18n.types";
import { getDashboardCopy } from "../constants/dashboard.constants";
import { DashboardStats } from "./DashboardStats";
import { TodayScheduleCard } from "./TodayScheduleCard";
import { UpcomingTasksCard } from "./UpcomingTasksCard";

interface DashboardOverviewProps {
    lang: string;
    username?: string;
    t: TranslateFn;
    tasks: ScheduleTask[];
    settings: ScheduleSettings;
    loadingData: boolean;
    onCreateTask: () => void;
    onOpenCalendar: () => void;
    onOpenImport: () => void;
    onOpenExport: () => void;
    onCopyPreviousWeek: () => Promise<void>;
    onSmartReschedule: () => Promise<void>;
}

export function DashboardOverview({
    lang,
    username,
    t,
    tasks,
    settings,
    loadingData,
    onCreateTask,
    onOpenCalendar,
    onOpenImport,
    onOpenExport,
    onCopyPreviousWeek,
    onSmartReschedule,
}: DashboardOverviewProps) {
    const [dismissedOverdue, setDismissedOverdue] = useState(false);
    const copy = getDashboardCopy(lang);

    const overdueCount = getOverdueTasksCount(
        tasks,
        settings.activeDays,
        dismissedOverdue,
    );

    const currentDate = new Date().toLocaleDateString(
        lang === "es" ? "es-ES" : "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
        },
    );

    const quickActions = [
        {
            label: copy.addTask,
            icon: Plus,
            onClick: onCreateTask,
            active: true,
        },
        {
            label: copy.importSchedule,
            icon: FileInput,
            onClick: onOpenImport,
            active: false,
        },
        {
            label: copy.exportPDF,
            icon: FileText,
            onClick: onOpenExport,
            active: false,
        },
        {
            label: copy.openCalendar,
            icon: CalendarDays,
            onClick: onOpenCalendar,
            active: false,
        },
    ];

    return (
        <div className="mx-auto max-w-6xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-6 border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000] dark:bg-[#111827] dark:border-white/10 dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-white/50">
                    {currentDate}
                </p>

                <h2 className="font-display text-3xl font-black uppercase tracking-tight text-black dark:text-white sm:text-4xl">
                    {copy.hello}
                    {username ? `, ${username}` : ""}
                </h2>

                <p className="mt-3 max-w-2xl text-sm font-bold text-slate-600 dark:text-white/60">
                    {lang === "es"
                        ? "Gestiona tu semana, importa horarios y mantén tus actividades bajo control."
                        : "Manage your week, import schedules, and keep your activities under control."}
                </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {quickActions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.label}
                            type="button"
                            onClick={action.onClick}
                            className={
                                action.active
                                    ? "flex min-h-[92px] flex-col items-start justify-between border-[3px] border-black bg-black p-4 text-left text-white shadow-[5px_5px_0_#000] dark:border-white/10 dark:shadow-[5px_5px_0_rgba(0,0,0,0.5)] transition hover:bg-black hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_rgba(0,0,0,0.5)]"
                                    : "flex min-h-[92px] flex-col items-start justify-between border-[3px] border-black bg-[#FFFCF4] p-4 text-left text-black shadow-[5px_5px_0_#000] dark:border-white/10 dark:bg-[#111827] dark:text-white dark:shadow-[5px_5px_0_rgba(0,0,0,0.5)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-white hover:shadow-[7px_7px_0_#000] dark:hover:bg-white/10 dark:hover:shadow-[7px_7px_0_rgba(0,0,0,0.5)]"
                            }
                        >
                            <Icon size={22} strokeWidth={3} />

                            <span className="text-xs font-black uppercase tracking-[0.1em]">
                                {action.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {overdueCount > 0 && !loadingData && (
                <div className="mb-6">
                    <OverdueTasksBanner
                        count={overdueCount}
                        t={t}
                        lang={lang}
                        onDismiss={() => setDismissedOverdue(true)}
                        onSmartReschedule={onSmartReschedule}
                    />
                </div>
            )}

            <DashboardStats lang={lang} tasks={tasks} />

            {tasks.length === 0 && !loadingData ? (
                <div className="mt-6">
                    <EmptyWeekState
                        t={t}
                        onCreateTask={onCreateTask}
                        onCopyPreviousWeek={onCopyPreviousWeek}
                    />
                </div>
            ) : (
                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                    <TodayScheduleCard lang={lang} tasks={tasks} />
                    <UpcomingTasksCard lang={lang} tasks={tasks} />
                </section>
            )}
        </div>
    );
}