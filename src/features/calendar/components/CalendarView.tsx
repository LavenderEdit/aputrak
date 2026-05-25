"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/cn";
import { Utils } from "@/shared/lib/utils";
import { DEFAULT_ACTIVITY_TAGS } from "@/features/tags/constants/tags.constants";
import { scheduleTasksToActivities } from "@/features/activities/lib/activity-adapters";
import { getMonthGrid, getMonthName } from "../lib/calendar-utils";
import { CalendarSidebar } from "./CalendarSidebar";
import { WeekCalendar } from "./WeekCalendar";
import { MonthCalendar } from "./MonthCalendar";
import { getCalendarCopy } from "../constants/calendar.constants";

interface CalendarViewProps {
    lang: string;
    weekId: string;
    settings: ScheduleSettings;
    tasks: ScheduleTask[];
    changeWeek: (direction: number) => void;
    getTasksForWeek: (weekId: string) => Promise<ScheduleTask[]>;
    onCreateTask: (day: number, hour: number) => void;
    onActivityClick: (taskId: string) => void;
}

function getDateFromWeekId(weekId: string) {
    return new Date(`${weekId}T00:00:00`);
}

function addMonths(date: Date, amount: number) {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + amount);
    return nextDate;
}

export function CalendarView({
    lang,
    weekId,
    settings,
    tasks,
    changeWeek,
    getTasksForWeek,
    onCreateTask,
    onActivityClick,
}: CalendarViewProps) {
    const [view, setView] = useState<"month" | "week">("month");
    const [selectedDate, setSelectedDate] = useState(() =>
        getDateFromWeekId(weekId),
    );
    const [selectedTag, setSelectedTag] = useState("all");
    const [monthTasksByWeek, setMonthTasksByWeek] = useState<
        Record<string, ScheduleTask[]>
    >({});

    const copy = getCalendarCopy(lang);
    const weekDate = useMemo(() => getDateFromWeekId(weekId), [weekId]);
    const visibleDate = view === "week" ? weekDate : selectedDate;

    const visibleMonthWeekIds = useMemo(() => {
        const dates = getMonthGrid(selectedDate);

        return Array.from(
            new Set(
                dates.map((date) => Utils.getWeekStartIdentifier(date)),
            ),
        );
    }, [selectedDate]);

    useEffect(() => {
        let cancelled = false;

        const loadMonthTasks = async () => {
            const entries = await Promise.all(
                visibleMonthWeekIds.map(async (monthWeekId) => {
                    const weekTasks = await getTasksForWeek(monthWeekId);

                    return [monthWeekId, weekTasks] as const;
                }),
            );

            if (!cancelled) {
                setMonthTasksByWeek(Object.fromEntries(entries));
            }
        };

        loadMonthTasks();

        return () => {
            cancelled = true;
        };
    }, [visibleMonthWeekIds, getTasksForWeek]);

    const weekActivities = useMemo(
        () => scheduleTasksToActivities(tasks, weekId),
        [tasks, weekId],
    );

    const monthActivities = useMemo(() => {
        return Object.entries(monthTasksByWeek).flatMap(
            ([monthWeekId, weekTasks]) =>
                scheduleTasksToActivities(weekTasks, monthWeekId),
        );
    }, [monthTasksByWeek]);

    const handlePrevious = () => {
        if (view === "week") {
            changeWeek(-1);
            return;
        }

        setSelectedDate((currentDate) => addMonths(currentDate, -1));
    };

    const handleNext = () => {
        if (view === "week") {
            changeWeek(1);
            return;
        }

        setSelectedDate((currentDate) => addMonths(currentDate, 1));
    };

    const handleToday = () => {
        setSelectedDate(new Date());
    };

    return (
        <div className="flex h-full overflow-hidden bg-white fade-in">
            <CalendarSidebar
                lang={lang}
                tags={DEFAULT_ACTIVITY_TAGS}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                onCreateActivity={() => onCreateTask(0, settings.startHour)}
            />

            <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-sborder bg-white px-4 py-3 sm:gap-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handlePrevious}
                        className="h-8 w-8 px-0"
                    >
                        <ChevronLeft size={14} />
                    </Button>

                    <Button variant="secondary" size="sm" onClick={handleToday}>
                        {copy.today}
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleNext}
                        className="h-8 w-8 px-0"
                    >
                        <ChevronRight size={14} />
                    </Button>

                    <h2 className="font-display ml-1 text-lg font-bold capitalize text-slate-950">
                        {getMonthName(visibleDate, lang)}
                    </h2>

                    <div className="flex-1" />

                    <div className="flex rounded-lg bg-slate-100 p-0.5">
                        <button
                            type="button"
                            onClick={() => setView("month")}
                            className={cn(
                                "rounded-md px-3 py-1 text-sm font-medium transition",
                                view === "month"
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-muted hover:text-slate-900",
                            )}
                        >
                            {copy.month}
                        </button>

                        <button
                            type="button"
                            onClick={() => setView("week")}
                            className={cn(
                                "rounded-md px-3 py-1 text-sm font-medium transition",
                                view === "week"
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-muted hover:text-slate-900",
                            )}
                        >
                            {copy.week}
                        </button>
                    </div>
                </div>

                {view === "month" ? (
                    <MonthCalendar
                        lang={lang}
                        selectedDate={selectedDate}
                        activities={monthActivities}
                        selectedTag={selectedTag}
                        onSelectDate={(date) => {
                            setSelectedDate(date);
                            setView("week");
                        }}
                    />
                ) : (
                    <WeekCalendar
                        lang={lang}
                        weekId={weekId}
                        settings={settings}
                        activities={weekActivities}
                        selectedTag={selectedTag}
                        onCreateActivity={onCreateTask}
                        onActivityClick={onActivityClick}
                    />
                )}
            </section>
        </div>
    );
}