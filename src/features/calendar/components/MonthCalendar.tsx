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
        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-3 sm:p-4">
            <div className="mb-3 grid grid-cols-7 border-[3px] border-black bg-white">
                {dayLabels.map((label, index) => (
                    <div
                        key={`${label}-${index}`}
                        className="border-r-2 border-black py-2 text-center text-[10px] font-black uppercase tracking-[0.12em] text-black last:border-r-0 sm:text-xs"
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 border-l-[3px] border-t-[3px] border-black bg-white">
                {days.map((date) => {
                    const dateId = formatDateId(date);
                    const today = isToday(date);
                    const isOtherMonth = date.getMonth() !== selectedDate.getMonth();

                    const dayActivities = filteredActivities.filter(
                        (activity) => activity.date === dateId,
                    );

                    return (
                        <button
                            key={dateId}
                            type="button"
                            onClick={() => onSelectDate(date)}
                            className="min-h-[104px] border-b-[3px] border-r-[3px] border-black bg-white p-2 text-left transition hover:bg-slate-50 sm:min-h-[118px]"
                            style={{
                                opacity: isOtherMonth ? 0.42 : 1,
                                backgroundColor: today ? "#F9EAC3" : "#FFFCF4",
                            }}
                            aria-label={(() => {
                                const formattedDate = date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                });
                                const count = dayActivities.length;
                                return lang === "es"
                                    ? `${formattedDate}. ${count === 1 ? "1 actividad" : `${count} actividades`}.`
                                    : `${formattedDate}. ${count === 1 ? "1 activity" : `${count} activities`}.`;
                            })()}
                        >
                            <div className="mb-2 flex items-center justify-between gap-1">
                                <span
                                    className={
                                        today
                                            ? "flex h-7 w-7 items-center justify-center border-2 border-black bg-black text-xs font-black text-white"
                                            : "text-sm font-black text-black"
                                    }
                                >
                                    {date.getDate()}
                                </span>

                                {dayActivities.length > 0 && (
                                    <span className="border-2 border-black bg-white px-1.5 py-0.5 text-[10px] font-black text-black">
                                        {dayActivities.length}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1">
                                {dayActivities.slice(0, 3).map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="truncate border-2 border-black px-1.5 py-0.5 text-[10px] font-black uppercase tracking-[0.03em]"
                                        style={{
                                            backgroundColor: `${activity.color}22`,
                                            color: activity.color,
                                        }}
                                    >
                                        {activity.title}
                                    </div>
                                ))}

                                {dayActivities.length > 3 && (
                                    <div className="text-[10px] font-black uppercase tracking-[0.08em] text-black">
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