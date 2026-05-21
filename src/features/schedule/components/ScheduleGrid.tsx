"use client";

import { useState } from "react";
import { THEME_COLORS } from "@/shared/lib/constants";
import { Utils } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/cn";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";
import { ActivityCard } from "./ActivityCard";

interface ScheduleGridProps {
    settings: ScheduleSettings;
    tasks: ScheduleTask[];
    weekId: string;
    getDayName: (index: number) => string;
    onCellClick: (day: number, hour: number) => void;
    onTaskClick: (task: ScheduleTask) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string, index: number) => void;
    onMoveTask: (taskId: string, newDay: number, newHour: number) => void;
}

const HOUR_HEIGHT = 64;

export function ScheduleGrid({
    settings,
    tasks,
    weekId,
    getDayName,
    onCellClick,
    onTaskClick,
    onDeleteTask,
    onToggleComplete,
    onMoveTask,
}: ScheduleGridProps) {
    const hoursRange = Array.from(
        { length: settings.endHour - settings.startHour },
        (_, index) => index + settings.startHour,
    );

    const weekDates = Utils.getDatesOfWeek(weekId);
    const [mobileActiveDay, setMobileActiveDay] = useState<number>(
        settings.activeDays[0] ?? 0,
    );
    const [dragOverCell, setDragOverCell] = useState<string | null>(null);

    const handleDragStart = (event: React.DragEvent, taskId: string) => {
        event.stopPropagation();
        event.dataTransfer.setData("application/json", JSON.stringify({ taskId }));
        event.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (
        event: React.DragEvent,
        targetDay: number,
        targetHour: number,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOverCell(null);

        try {
            const parsed = JSON.parse(event.dataTransfer.getData("application/json"));

            if (parsed.taskId) {
                onMoveTask(parsed.taskId, targetDay, targetHour);
            }
        } catch { }
    };

    return (
        <div className="relative flex flex-col space-y-3">
            <div className="flex snap-x gap-2 overflow-x-auto pb-2 md:hidden [&::-webkit-scrollbar]:hidden">
                {settings.activeDays.map((dayIdx) => (
                    <button
                        key={dayIdx}
                        onClick={() => setMobileActiveDay(dayIdx)}
                        className={cn(
                            "flex min-w-[90px] shrink-0 snap-start flex-col items-center rounded-xl border px-4 py-2 text-sm font-bold shadow-sm transition-all",
                            mobileActiveDay === dayIdx
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                        )}
                    >
                        {getDayName(dayIdx).slice(0, 3)}

                        <span
                            className={cn(
                                "mt-0.5 text-[10px] font-medium normal-case",
                                mobileActiveDay === dayIdx ? "text-indigo-200" : "text-slate-400",
                            )}
                        >
                            {weekDates[dayIdx]}
                        </span>
                    </button>
                ))}
            </div>

            <div
                id="schedule-container-wrapper"
                className="relative flex min-h-[500px] overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"
            >
                <div className="relative z-20 flex w-16 shrink-0 flex-col border-r border-slate-200 bg-slate-50 sm:w-20">
                    <div className="h-[52px] border-b border-slate-200 bg-white" />

                    {hoursRange.map((hour) => (
                        <div
                            key={hour}
                            className="relative flex h-16 flex-col justify-center border-b border-slate-200 py-2 text-center text-xs font-semibold text-slate-500"
                        >
                            <span className="absolute -top-2.5 left-0 right-0 bg-slate-50 px-1">
                                {Utils.formatTime(hour)}
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    id="schedule-container"
                    className="relative flex min-w-max flex-1 flex-col md:min-w-[700px]"
                >
                    <div className="sticky top-0 z-30 flex h-[52px] border-b border-slate-200 bg-white shadow-sm">
                        {settings.activeDays.map((dayIdx) => (
                            <div
                                key={dayIdx}
                                className={cn(
                                    "flex-1 border-r border-slate-200 px-2 py-2 text-center text-xs font-bold uppercase tracking-wider text-white last:border-r-0",
                                    THEME_COLORS[dayIdx],
                                    dayIdx !== mobileActiveDay
                                        ? "hidden flex-col items-center justify-center md:flex"
                                        : "flex flex-col items-center justify-center",
                                )}
                            >
                                <span>{getDayName(dayIdx)}</span>

                                <span className="mt-0.5 text-[10px] font-medium normal-case tracking-normal opacity-90">
                                    {weekDates[dayIdx]}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div
                        className="relative flex flex-1"
                        style={{ height: `${hoursRange.length * HOUR_HEIGHT}px` }}
                    >
                        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col">
                            {hoursRange.map((hour) => (
                                <div
                                    key={hour}
                                    className="relative h-16 w-full border-b border-slate-100"
                                >
                                    <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-slate-100" />
                                </div>
                            ))}
                        </div>

                        {settings.activeDays.map((dayIdx) => {
                            const dayTasks = tasks.filter((task) => task.day === dayIdx);

                            return (
                                <div
                                    key={dayIdx}
                                    className={cn(
                                        "relative flex-1 border-r border-slate-200 last:border-r-0",
                                        dayIdx !== mobileActiveDay && "hidden md:block",
                                    )}
                                >
                                    <div className="absolute inset-0 z-10 flex flex-col">
                                        {hoursRange.map((hour) => {
                                            const cellKey = `${dayIdx}-${hour}`;

                                            return (
                                                <button
                                                    key={hour}
                                                    onClick={() => onCellClick(dayIdx, hour)}
                                                    onDragOver={(event) => {
                                                        event.preventDefault();
                                                        event.dataTransfer.dropEffect = "move";
                                                        setDragOverCell(cellKey);
                                                    }}
                                                    onDragLeave={() => setDragOverCell(null)}
                                                    onDrop={(event) => handleDrop(event, dayIdx, hour)}
                                                    className={cn(
                                                        "h-16 cursor-pointer transition-colors hover:bg-slate-100/40",
                                                        dragOverCell === cellKey &&
                                                        "bg-indigo-100/60 ring-2 ring-inset ring-indigo-400",
                                                    )}
                                                />
                                            );
                                        })}
                                    </div>

                                    {dayTasks.map((task) => {
                                        const topPixels =
                                            ((task.startMinute - settings.startHour * 60) / 60) *
                                            HOUR_HEIGHT;

                                        const durationMinutes = task.endMinute - task.startMinute;
                                        const heightPixels = (durationMinutes / 60) * HOUR_HEIGHT;

                                        if (
                                            topPixels < 0 ||
                                            topPixels >= hoursRange.length * HOUR_HEIGHT
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <ActivityCard
                                                key={task.id}
                                                task={task}
                                                top={topPixels}
                                                height={heightPixels}
                                                onTaskClick={onTaskClick}
                                                onDeleteTask={onDeleteTask}
                                                onToggleComplete={onToggleComplete}
                                                onDragStart={handleDragStart}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}