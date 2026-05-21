"use client";

import type { Activity } from "@/features/activities/types/activity.types";
import {
    formatDateId,
    getMonthGrid,
    getShortDayName,
    isToday,
} from "../lib/calendar-utils";

interface MonthCalendarProps {
    lang: string;
    selectedDate: Date;
    activities: Activity[];
    selectedTag: string;
    onSelectDate: (date: Date) => void;
}

export function MonthCalendar({
    lang,
    selectedDate,
    activities,
    selectedTag,
    onSelectDate,
}: MonthCalendarProps) {
    const days = getMonthGrid(selectedDate);
    const dayLabels = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(2024, 0, index + 1);
        return getShortDayName(date, lang);
    });

    const filteredActivities =
        selectedTag === "all"
            ? activities
            : activities.filter((activity) => activity.tagId === selectedTag);

    return (
        <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-white">
                {dayLabels.map((label) => (
                    <div
                        key={label}
                        className="py-2 text-center text-xs font-medium text-slate-500"
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-slate-200">
                {days.map((date) => {
                    const dateId = formatDateId(date);
                    const isOtherMonth = date.getMonth() !== selectedDate.getMonth();
                    const dayActivities = filteredActivities.filter(
                        (activity) => activity.date === dateId,
                    );

                    return (
                        <button
                            key={dateId}
                            onClick={() => onSelectDate(date)}
                            className="min-h-[100px] bg-white p-2 text-left transition hover:bg-slate-50"
                            style={{
                                opacity: isOtherMonth ? 0.4 : 1,
                                backgroundColor: isToday(date)
                                    ? "rgba(99,102,241,0.04)"
                                    : undefined,
                            }}
                        >
                            <div
                                className="text-sm"
                                style={{
                                    fontWeight: isToday(date) ? 700 : 500,
                                    color: isToday(date) ? "#6366F1" : undefined,
                                }}
                            >
                                {date.getDate()}
                            </div>

                            <div className="mt-1 space-y-1">
                                {dayActivities.slice(0, 3).map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="truncate rounded px-1 py-0.5 text-[10px]"
                                        style={{
                                            backgroundColor: `${activity.color}18`,
                                            color: activity.color,
                                        }}
                                    >
                                        {activity.title}
                                    </div>
                                ))}

                                {dayActivities.length > 3 && (
                                    <div className="text-[10px] text-slate-500">
                                        +{dayActivities.length - 3}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}