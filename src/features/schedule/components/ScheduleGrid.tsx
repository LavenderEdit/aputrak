"use client";
import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { ACTIVITY_COLORS, THEME_COLORS } from "../../../shared/lib/constants";
import { Utils } from "../../../shared/lib/utils";
import type { ScheduleTask } from "../types/schedule.types";

interface SettingsType {
    startHour: number;
    endHour: number;
    activeDays: number[];
}

interface ScheduleGridProps {
    settings: SettingsType;
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

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
    settings,
    tasks,
    weekId,
    getDayName,
    onCellClick,
    onTaskClick,
    onDeleteTask,
    onToggleComplete,
    onMoveTask,
}) => {
    const hoursRange = Array.from(
        { length: settings.endHour - settings.startHour },
        (_, i) => i + settings.startHour,
    );
    const weekDates = Utils.getDatesOfWeek(weekId);
    const [mobileActiveDay, setMobileActiveDay] = useState<number>(
        settings.activeDays[0],
    );
    const [dragOverCell, setDragOverCell] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.stopPropagation();
        e.dataTransfer.setData("application/json", JSON.stringify({ taskId }));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (
        e: React.DragEvent,
        targetDay: number,
        targetHour: number,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverCell(null);
        try {
            const parsed = JSON.parse(e.dataTransfer.getData("application/json"));
            if (parsed.taskId) onMoveTask(parsed.taskId, targetDay, targetHour);
        } catch { }
    };

    return (
        <div className="flex flex-col space-y-3 relative">
            <div className="md:hidden flex overflow-x-auto gap-2 pb-2 snap-x [&::-webkit-scrollbar]:hidden">
                {settings.activeDays.map((dayIdx) => (
                    <button
                        key={dayIdx}
                        onClick={() => setMobileActiveDay(dayIdx)}
                        className={`snap-start shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border flex flex-col items-center min-w-[90px] ${mobileActiveDay === dayIdx ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
                    >
                        {getDayName(dayIdx).slice(0, 3)}
                        <span
                            className={`text-[10px] font-medium mt-0.5 normal-case ${mobileActiveDay === dayIdx ? "text-indigo-200" : "text-slate-400"}`}
                        >
                            {weekDates[dayIdx]}
                        </span>
                    </button>
                ))}
            </div>

            <div
                id="schedule-container-wrapper"
                className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto relative min-h-[500px]"
            >
                <div className="w-16 sm:w-20 shrink-0 border-r border-slate-200 flex flex-col bg-slate-50 relative z-20">
                    <div className="h-[52px] border-b border-slate-200 bg-white"></div>
                    {hoursRange.map((hour) => (
                        <div
                            key={hour}
                            className="h-16 border-b border-slate-200 text-center py-2 text-xs font-semibold text-slate-500 relative flex flex-col justify-center"
                        >
                            <span className="absolute -top-2.5 left-0 right-0 bg-slate-50 px-1">
                                {Utils.formatTime(hour)}
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    id="schedule-container"
                    className="flex-1 flex flex-col relative min-w-max md:min-w-[700px]"
                >
                    <div className="flex h-[52px] border-b border-slate-200 sticky top-0 bg-white z-30 shadow-sm">
                        {settings.activeDays.map((dayIdx) => (
                            <div
                                key={dayIdx}
                                className={`flex-1 ${THEME_COLORS[dayIdx]} text-white font-bold py-2 px-2 text-xs uppercase tracking-wider text-center border-r border-slate-200 last:border-r-0 ${dayIdx !== mobileActiveDay ? "hidden md:flex flex-col items-center justify-center" : "flex flex-col items-center justify-center"}`}
                            >
                                <span>{getDayName(dayIdx)}</span>
                                <span className="text-[10px] font-medium opacity-90 normal-case tracking-normal mt-0.5">
                                    {weekDates[dayIdx]}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div
                        className="relative flex-1 flex"
                        style={{ height: `${hoursRange.length * HOUR_HEIGHT}px` }}
                    >
                        <div className="absolute inset-0 flex flex-col pointer-events-none z-0">
                            {hoursRange.map((hour) => (
                                <div
                                    key={hour}
                                    className="h-16 border-b border-slate-100 w-full relative"
                                >
                                    <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-100"></div>
                                </div>
                            ))}
                        </div>

                        {settings.activeDays.map((dayIdx) => {
                            const dayTasks = tasks.filter((t) => t.day === dayIdx);

                            return (
                                <div
                                    key={dayIdx}
                                    className={`flex-1 relative border-r border-slate-200 last:border-r-0 ${dayIdx !== mobileActiveDay ? "hidden md:block" : ""}`}
                                >
                                    <div className="absolute inset-0 flex flex-col z-10">
                                        {hoursRange.map((hour) => {
                                            const cellKey = `${dayIdx}-${hour}`;
                                            return (
                                                <div
                                                    key={hour}
                                                    className={`h-16 cursor-pointer hover:bg-slate-100/40 transition-colors ${dragOverCell === cellKey ? "bg-indigo-100/60 ring-2 ring-indigo-400 ring-inset" : ""}`}
                                                    onClick={() => onCellClick(dayIdx, hour)}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        e.dataTransfer.dropEffect = "move";
                                                        setDragOverCell(cellKey);
                                                    }}
                                                    onDragLeave={() => setDragOverCell(null)}
                                                    onDrop={(e) => handleDrop(e, dayIdx, hour)}
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

                                        const theme =
                                            ACTIVITY_COLORS.find((c) => c.id === task.color) ||
                                            ACTIVITY_COLORS[0];
                                        const lines = task.text
                                            .split("\n")
                                            .filter((t) => t.trim() !== "");
                                        const isSingle = lines.length === 1;

                                        if (
                                            topPixels < 0 ||
                                            topPixels >= hoursRange.length * HOUR_HEIGHT
                                        )
                                            return null;

                                        return (
                                            <div
                                                key={task.id}
                                                draggable={true}
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onTaskClick(task);
                                                }}
                                                className={`absolute left-1 right-1 rounded-md border shadow-sm group/item transition-all hover:shadow-md z-20 md:cursor-grab md:active:cursor-grabbing flex ${isSingle ? "items-center justify-center p-1.5 text-center" : "flex-col gap-1 p-2 justify-start"} ${theme.bg} ${theme.border}`}
                                                style={{
                                                    top: `${topPixels}px`,
                                                    height: `${heightPixels}px`,
                                                    minHeight: "30px",
                                                }}
                                            >
                                                {isSingle ? (
                                                    <div className="flex items-center justify-center gap-1.5 w-full relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onToggleComplete(task.id, 0);
                                                            }}
                                                            className={`shrink-0 transition-all z-30 ${task.completed[0] ? "text-emerald-500 opacity-100" : "text-slate-400 opacity-0 md:group-hover/item:opacity-100 opacity-100 md:hover:scale-110"}`}
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <span
                                                            className={`text-xs font-bold ${theme.text} leading-tight line-clamp-3 transition-all ${task.completed[0] ? "line-through opacity-40" : ""}`}
                                                        >
                                                            {lines[0]}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-1.5 w-full overflow-y-auto no-scrollbar">
                                                        {lines.map((line, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-start gap-1.5 text-left w-full group/task"
                                                            >
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onToggleComplete(task.id, i);
                                                                    }}
                                                                    className={`mt-0.5 shrink-0 transition-all z-30 ${task.completed[i] ? "text-emerald-500 opacity-100" : "text-slate-400 opacity-0 md:group-hover/item:opacity-100 opacity-100 md:hover:scale-110"}`}
                                                                >
                                                                    <CheckCircle size={12} />
                                                                </button>
                                                                <span
                                                                    className={`text-[10px] font-bold ${theme.text} leading-tight break-words flex-1 transition-all ${task.completed[i] ? "line-through opacity-40" : ""}`}
                                                                >
                                                                    {line}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteTask(task.id);
                                                    }}
                                                    className="absolute -top-2 -right-2 z-30 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center md:opacity-0 opacity-100 group-hover/item:opacity-100 transition-opacity shadow-md hover:bg-red-600 no-print"
                                                >
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </div>
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
};
