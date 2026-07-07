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
import { scheduleTasksToActivities } from "@/features/activities/lib/activity-adapters";
import { getMonthGrid, getMonthName } from "../lib/calendar-utils";
import { CalendarSidebar } from "./CalendarSidebar";
import { WeekCalendar } from "./WeekCalendar";
import { MonthCalendar } from "./MonthCalendar";
import { getCalendarCopy } from "../constants/calendar.constants";
import { useActivityTags } from "@/features/tags/hooks/useActivityTags";

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
    const { tags } = useActivityTags();
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
        () => scheduleTasksToActivities(tasks, weekId, tags),
        [tasks, weekId, tags],
    );

    const monthActivities = useMemo(() => {
        return Object.entries(monthTasksByWeek).flatMap(
            ([monthWeekId, weekTasks]) =>
                scheduleTasksToActivities(weekTasks, monthWeekId, tags),
        );
    }, [monthTasksByWeek, tags]);

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
        <div className="flex h-full overflow-hidden bg-white dark:bg-white/5 fade-in">
            <CalendarSidebar
                lang={lang}
                tags={tags}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                onCreateActivity={() => onCreateTask(0, settings.startHour)}
            />

            <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <div className="flex shrink-0 flex-col gap-3 border-b-[3px] border-black dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handlePrevious}
                            className="h-9 w-9 px-0"
                            aria-label={copy.previous}
                        >
                            <ChevronLeft size={15} strokeWidth={3} />
                        </Button>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleToday}
                            className="h-9"
                        >
                            {copy.today}
                        </Button>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleNext}
                            className="h-9 w-9 px-0"
                            aria-label={copy.next}
                        >
                            <ChevronRight size={15} strokeWidth={3} />
                        </Button>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="font-display truncate text-xl font-black uppercase tracking-tight text-black dark:text-white">
                            {getMonthName(visibleDate, lang)}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 border-2 border-black dark:border-white/10 sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setView("month")}
                            className={`px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${view === "month" ? "bg-black text-white" : "bg-white text-black hover:bg-slate-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"}`}
                        >
                            {copy.month}
                        </button>

                        <button
                            type="button"
                            onClick={() => setView("week")}
                            className={`border-l-2 border-black px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition dark:border-white/10 ${view === "week" ? "bg-black text-white" : "bg-white text-black hover:bg-slate-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"}`}
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