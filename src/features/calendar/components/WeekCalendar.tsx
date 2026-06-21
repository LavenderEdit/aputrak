"use client";

import type { Activity } from "@/features/activities/types/activity.types";
import { timeToMinutes } from "@/features/activities/lib/activity-adapters";
import type { ScheduleSettings } from "@/features/schedule/types/schedule.types";
import {
    formatDateId,
    getShortDayName,
    getWeekDatesFromWeekId,
    isToday,
} from "../lib/calendar-utils";

interface WeekCalendarProps {
    lang: string;
    weekId: string;
    settings: ScheduleSettings;
    activities: Activity[];
    selectedTag: string;
    onCreateActivity: (day: number, hour: number) => void;
    onActivityClick: (activityId: string) => void;
}

const HOUR_HEIGHT = 68;
const HOUR_COLUMN_WIDTH = 68;
const DAY_COLUMN_MIN_WIDTH = 116;

function formatHour(hour: number) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

    return `${displayHour} ${period}`;
}

function getGridTemplateColumns() {
    return `${HOUR_COLUMN_WIDTH}px repeat(7, minmax(${DAY_COLUMN_MIN_WIDTH}px, 1fr))`;
}

export function WeekCalendar({
    lang,
    weekId,
    settings,
    activities,
    selectedTag,
    onCreateActivity,
    onActivityClick,
}: WeekCalendarProps) {
    const week = getWeekDatesFromWeekId(weekId);
    const hours = Array.from(
        { length: Math.max(0, settings.endHour - settings.startHour) },
        (_, index) => settings.startHour + index,
    );

    const filteredActivities =
        selectedTag === "all"
            ? activities
            : activities.filter((activity) => activity.tagId === selectedTag);

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const gridTemplateColumns = getGridTemplateColumns();
    const calendarHeight = hours.length * HOUR_HEIGHT;

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F5F0E6]">
            <div className="min-h-0 flex-1 overflow-auto p-3">
                <div className="min-w-[880px] border-[3px] border-black bg-[#FFFCF4] shadow-[6px_6px_0_#000] lg:min-w-full">
                    <div
                        className="sticky top-0 z-40 grid border-b-[3px] border-black bg-[#FFFCF4]"
                        style={{ gridTemplateColumns }}
                    >
                        <div className="border-r-2 border-black bg-[#F5F0E6] py-2" />

                        {week.map((date) => {
                            const today = isToday(date);

                            return (
                                <div
                                    key={formatDateId(date)}
                                    className="border-r-2 border-black bg-[#FFFCF4] py-2 text-center last:border-r-0"
                                >
                                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                                        {getShortDayName(date, lang)}
                                    </div>

                                    <div
                                        className={
                                            today
                                                ? "mx-auto mt-1 flex h-8 w-8 items-center justify-center border-2 border-black bg-black text-sm font-black text-white"
                                                : "mt-1 text-lg font-black text-black"
                                        }
                                    >
                                        {date.getDate()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns,
                            minHeight: `${calendarHeight}px`,
                        }}
                    >
                        <div className="border-r-2 border-black bg-[#F5F0E6]">
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="relative border-b border-black/20 text-right text-[10px] font-black uppercase tracking-[0.08em] text-slate-600"
                                    style={{ height: HOUR_HEIGHT }}
                                >
                                    <span className="absolute right-2 top-[-7px] bg-[#F5F0E6] px-1">
                                        {formatHour(hour)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {week.map((date, dayIndex) => {
                            const dateId = formatDateId(date);

                            const dayActivities = filteredActivities.filter(
                                (activity) => activity.date === dateId,
                            );

                            const showNowLine =
                                isToday(date) &&
                                currentMinutes >= settings.startHour * 60 &&
                                currentMinutes <= settings.endHour * 60;

                            const nowTop =
                                ((currentMinutes - settings.startHour * 60) / 60) *
                                HOUR_HEIGHT;

                            return (
                                <div
                                    key={dateId}
                                    className="relative border-r border-black/25 last:border-r-0"
                                    style={{
                                        backgroundColor: isToday(date)
                                            ? "#F9EAC3"
                                            : "#FFFCF4",
                                    }}
                                >
                                    {hours.map((hour) => (
                                        <button
                                            key={hour}
                                            type="button"
                                            onClick={() => onCreateActivity(dayIndex, hour)}
                                            className="block w-full border-b border-black/15 transition hover:bg-black/5"
                                            style={{ height: HOUR_HEIGHT }}
                                            aria-label={
                                                lang === "es"
                                                    ? `Crear actividad el ${getShortDayName(date, lang)} a las ${formatHour(hour)}`
                                                    : `Create activity on ${getShortDayName(date, lang)} at ${formatHour(hour)}`
                                            }
                                        />
                                    ))}

                                    {dayActivities.map((activity) => {
                                        const start = timeToMinutes(activity.startTime);
                                        const end = timeToMinutes(activity.endTime);
                                        const visibleStart = settings.startHour * 60;
                                        const visibleEnd = settings.endHour * 60;

                                        if (end <= visibleStart || start >= visibleEnd) {
                                            return null;
                                        }

                                        const clampedStart = Math.max(start, visibleStart);
                                        const clampedEnd = Math.min(end, visibleEnd);

                                        const top =
                                            ((clampedStart - visibleStart) / 60) *
                                            HOUR_HEIGHT;

                                        const height = Math.max(
                                            30,
                                            ((clampedEnd - clampedStart) / 60) *
                                            HOUR_HEIGHT,
                                        );

                                        return (
                                            <button
                                                key={activity.id}
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    onActivityClick(activity.id);
                                                }}
                                                className="absolute left-1.5 right-1.5 z-20 overflow-hidden border-2 border-black px-2 py-1 text-left text-xs leading-tight shadow-[3px_3px_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#000]"
                                                style={{
                                                    top,
                                                    height,
                                                    backgroundColor: `${activity.color}24`,
                                                    color: activity.color,
                                                    opacity:
                                                        activity.status === "completed"
                                                            ? 0.55
                                                            : 1,
                                                }}
                                            >
                                                <div className="truncate font-black uppercase tracking-[0.03em]">
                                                    {activity.title}
                                                </div>

                                                {height > 40 && (
                                                    <div className="truncate text-[10px] font-bold opacity-80">
                                                        {activity.startTime} -{" "}
                                                        {activity.endTime}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}

                                    {showNowLine && (
                                        <div
                                            className="absolute left-0 right-0 z-30 h-[3px] bg-red-600"
                                            style={{ top: nowTop }}
                                        >
                                            <span className="absolute -left-1 -top-[4px] h-3 w-3 border-2 border-black bg-red-600" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}