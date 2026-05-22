"use client";

import type { Activity } from "@/features/activities/types/activity.types";
import type { ScheduleSettings } from "@/features/schedule/types/schedule.types";
import {
    formatDateId,
    getShortDayName,
    getWeekDatesFromWeekId,
    isToday,
} from "../lib/calendar-utils";
import { timeToMinutes } from "@/features/activities/lib/activity-adapters";

interface WeekCalendarProps {
    lang: string;
    weekId: string;
    settings: ScheduleSettings;
    activities: Activity[];
    selectedTag: string;
    onCreateActivity: (day: number, hour: number) => void;
    onActivityClick: (activityId: string) => void;
}

const HOUR_HEIGHT = 64;

function formatHour(hour: number) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

    return `${displayHour} ${period}`;
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
        { length: settings.endHour - settings.startHour },
        (_, index) => settings.startHour + index,
    );

    const filteredActivities =
        selectedTag === "all"
            ? activities
            : activities.filter((activity) => activity.tagId === selectedTag);

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
            <div className="grid grid-cols-[60px_repeat(7,minmax(96px,1fr))] border-b border-sborder bg-white">
                <div className="border-r border-sborder py-2 text-center text-xs text-muted" />

                {week.map((date) => {
                    const today = isToday(date);

                    return (
                        <div
                            key={formatDateId(date)}
                            className="border-r border-slate-100 py-2 text-center last:border-r-0"
                            style={{
                                backgroundColor: today ? "rgba(99,102,241,0.04)" : undefined,
                            }}
                        >
                            <div className="text-xs font-medium text-muted">
                                {getShortDayName(date, lang)}
                            </div>

                            <div
                                className="font-display text-lg font-bold"
                                style={{ color: today ? "#6366F1" : "#0F172A" }}
                            >
                                {date.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
                <div
                    className="grid min-w-[840px] grid-cols-[60px_repeat(7,minmax(96px,1fr))]"
                    style={{
                        minHeight: `${hours.length * HOUR_HEIGHT}px`,
                    }}
                >
                    <div className="border-r border-sborder bg-white">
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="relative text-right text-[10px] text-muted"
                                style={{ height: HOUR_HEIGHT }}
                            >
                                <span className="absolute right-2 top-[-6px]">
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
                            ((currentMinutes - settings.startHour * 60) / 60) * HOUR_HEIGHT;

                        return (
                            <div
                                key={dateId}
                                className="relative border-r border-slate-100 last:border-r-0"
                            >
                                {hours.map((hour) => (
                                    <button
                                        key={hour}
                                        onClick={() => onCreateActivity(dayIndex, hour)}
                                        className="block w-full border-b border-slate-100 transition hover:bg-slate-50"
                                        style={{ height: HOUR_HEIGHT }}
                                    />
                                ))}

                                {dayActivities.map((activity) => {
                                    const start = timeToMinutes(activity.startTime);
                                    const end = timeToMinutes(activity.endTime);

                                    const top = Math.max(
                                        0,
                                        ((start - settings.startHour * 60) / 60) * HOUR_HEIGHT,
                                    );

                                    const height = Math.max(
                                        26,
                                        ((end - start) / 60) * HOUR_HEIGHT,
                                    );

                                    return (
                                        <button
                                            key={activity.id}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onActivityClick(activity.id);
                                            }}
                                            className="absolute left-[4px] right-[4px] z-20 overflow-hidden rounded-lg border-l-[3px] px-2 py-1 text-left text-xs leading-tight transition hover:scale-[1.02] hover:shadow-lg"
                                            style={{
                                                top,
                                                height,
                                                backgroundColor: `${activity.color}18`,
                                                borderLeftColor: activity.color,
                                                color: activity.color,
                                                opacity: activity.status === "completed" ? 0.6 : 1,
                                            }}
                                        >
                                            <div className="truncate font-semibold">
                                                {activity.title}
                                            </div>

                                            {height > 34 && (
                                                <div className="truncate text-[10px] opacity-85">
                                                    {activity.startTime} - {activity.endTime}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}

                                {showNowLine && (
                                    <div
                                        className="absolute left-0 right-0 z-30 h-0.5 bg-danger"
                                        style={{ top: nowTop }}
                                    >
                                        <span className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full bg-danger" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}