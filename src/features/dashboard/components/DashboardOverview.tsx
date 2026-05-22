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
            className:
                "bg-primary text-white shadow-lg shadow-indigo-500/20 hover:bg-primary-dark",
            iconClassName: "text-white",
        },
        {
            label: copy.importSchedule,
            icon: FileInput,
            onClick: onOpenImport,
            className: "border border-sborder bg-white text-slate-700 hover:bg-slate-50",
            iconClassName: "text-secondary",
        },
        {
            label: copy.exportPDF,
            icon: FileText,
            onClick: onOpenExport,
            className: "border border-sborder bg-white text-slate-700 hover:bg-slate-50",
            iconClassName: "text-accent",
        },
        {
            label: copy.openCalendar,
            icon: CalendarDays,
            onClick: onOpenCalendar,
            className: "border border-sborder bg-white text-slate-700 hover:bg-slate-50",
            iconClassName: "text-primary",
        },
    ];

    return (
        <div className="mx-auto max-w-6xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-6">
                <h2 className="font-display text-2xl font-extrabold text-slate-950">
                    {copy.hello}
                    {username ? `, ${username}` : ""}
                </h2>

                <p className="mt-1 text-sm capitalize text-muted">{currentDate}</p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {quickActions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.label}
                            onClick={action.onClick}
                            className={`flex items-center gap-3 rounded-xl p-4 text-left transition ${action.className}`}
                        >
                            <Icon size={20} className={action.iconClassName} />

                            <span className="text-sm font-semibold">{action.label}</span>
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