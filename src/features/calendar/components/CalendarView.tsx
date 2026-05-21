"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";
import { Button } from "@/shared/components/ui/Button";
import { DEFAULT_ACTIVITY_TAGS } from "@/features/tags/constants/tags.constants";
import { scheduleTasksToActivities } from "@/features/activities/lib/activity-adapters";
import { getMonthName } from "../lib/calendar-utils";
import { CalendarSidebar } from "./CalendarSidebar";
import { WeekCalendar } from "./WeekCalendar";
import { MonthCalendar } from "./MonthCalendar";

interface CalendarViewProps {
    lang: string;
    weekId: string;
    settings: ScheduleSettings;
    tasks: ScheduleTask[];
    changeWeek: (direction: number) => void;
    onCreateTask: (day: number, hour: number) => void;
    onActivityClick: (taskId: string) => void;
}

export function CalendarView({
    lang,
    weekId,
    settings,
    tasks,
    changeWeek,
    onCreateTask,
    onActivityClick,
}: CalendarViewProps) {
    const [view, setView] = useState<"week" | "month">("week");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTag, setSelectedTag] = useState("all");

    const activities = useMemo(
        () => scheduleTasksToActivities(tasks, weekId),
        [tasks, weekId],
    );

    return (
        <div className="flex h-full flex-1 overflow-hidden">
            <CalendarSidebar
                lang={lang}
                tags={DEFAULT_ACTIVITY_TAGS}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                onCreateActivity={() => onCreateTask(0, settings.startHour)}
            />

            <section className="flex flex-1 flex-col overflow-hidden">
                <div className="flex flex-shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 sm:gap-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => changeWeek(-1)}
                        className="h-8 w-8 px-0"
                    >
                        <ChevronLeft size={14} />
                    </Button>

                    <Button variant="secondary" size="sm" onClick={() => setSelectedDate(new Date())}>
                        {lang === "es" ? "Hoy" : "Today"}
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => changeWeek(1)}
                        className="h-8 w-8 px-0"
                    >
                        <ChevronRight size={14} />
                    </Button>

                    <h2 className="font-display text-lg font-bold capitalize text-slate-950">
                        {getMonthName(selectedDate, lang)}
                    </h2>

                    <div className="flex-1" />

                    <div className="flex rounded-lg bg-slate-100 p-0.5">
                        <button
                            onClick={() => setView("week")}
                            className={`rounded-md px-3 py-1 text-sm font-medium transition ${view === "week" ? "bg-white text-indigo-600 shadow" : "text-slate-500"
                                }`}
                        >
                            {lang === "es" ? "Semana" : "Week"}
                        </button>

                        <button
                            onClick={() => setView("month")}
                            className={`rounded-md px-3 py-1 text-sm font-medium transition ${view === "month" ? "bg-white text-indigo-600 shadow" : "text-slate-500"
                                }`}
                        >
                            {lang === "es" ? "Mes" : "Month"}
                        </button>
                    </div>
                </div>

                {view === "week" ? (
                    <WeekCalendar
                        lang={lang}
                        weekId={weekId}
                        settings={settings}
                        activities={activities}
                        selectedTag={selectedTag}
                        onCreateActivity={onCreateTask}
                        onActivityClick={onActivityClick}
                    />
                ) : (
                    <MonthCalendar
                        lang={lang}
                        selectedDate={selectedDate}
                        activities={activities}
                        selectedTag={selectedTag}
                        onSelectDate={(date) => {
                            setSelectedDate(date);
                            setView("week");
                        }}
                    />
                )}
            </section>
        </div>
    );
}