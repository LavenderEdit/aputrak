"use client";

import type { MouseEvent } from "react";
import { CheckCircle2, GripVertical, Trash2 } from "lucide-react";
import { ACTIVITY_COLORS } from "@/shared/lib/constants";
import { cn } from "@/shared/lib/cn";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import {
    getTaskDurationLabel,
    getTaskLines,
} from "@/features/schedule/lib/schedule-view";

interface ActivityCardProps {
    task: ScheduleTask;
    top: number;
    height: number;
    onTaskClick: (task: ScheduleTask) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string, index: number) => void;
    onDragStart: (event: React.DragEvent, taskId: string) => void;
}

export function ActivityCard({
    task,
    top,
    height,
    onTaskClick,
    onDeleteTask,
    onToggleComplete,
    onDragStart,
}: ActivityCardProps) {
    const theme =
        ACTIVITY_COLORS.find((color) => color.id === task.color) ??
        ACTIVITY_COLORS[0];

    const lines = getTaskLines(task);

    const stop = (event: MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <article
            draggable
            onDragStart={(event) => onDragStart(event, task.id)}
            onClick={(event) => {
                event.stopPropagation();
                onTaskClick(task);
            }}
            className={cn(
                "group absolute left-2 right-2 z-20 cursor-pointer overflow-hidden rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg lg:cursor-grab lg:active:cursor-grabbing",
                theme.bg,
                theme.border,
            )}
            style={{
                top,
                height: Math.max(height, 54),
            }}
        >
            <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <GripVertical
                        className="hidden shrink-0 text-slate-300 group-hover:block"
                        size={14}
                    />

                    <p className={cn("truncate text-xs font-black", theme.text)}>
                        {lines[0] ?? task.text}
                    </p>
                </div>

                <button
                    onClick={(event) => {
                        stop(event);
                        onDeleteTask(task.id);
                    }}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/80 text-slate-400 opacity-100 transition hover:text-red-600 lg:opacity-0 lg:group-hover:opacity-100"
                >
                    <Trash2 size={13} />
                </button>
            </div>

            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                {getTaskDurationLabel(task)}
            </p>

            <div className="space-y-1 overflow-y-auto no-scrollbar">
                {lines.map((line, index) => (
                    <button
                        key={`${task.id}-${index}`}
                        onClick={(event) => {
                            stop(event);
                            onToggleComplete(task.id, index);
                        }}
                        className="flex w-full items-start gap-2 text-left"
                    >
                        <CheckCircle2
                            size={14}
                            className={cn(
                                "mt-0.5 shrink-0 transition",
                                task.completed[index]
                                    ? "text-emerald-500"
                                    : "text-slate-300 hover:text-emerald-500",
                            )}
                        />

                        <span
                            className={cn(
                                "text-[11px] font-bold leading-snug text-slate-700",
                                task.completed[index] && "text-slate-400 line-through",
                            )}
                        >
                            {line}
                        </span>
                    </button>
                ))}
            </div>
        </article>
    );
}