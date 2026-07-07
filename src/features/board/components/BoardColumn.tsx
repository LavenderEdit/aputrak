"use client";

import React, { useState } from "react";
import { Trash2, GripVertical } from "lucide-react";
import type { BoardListResponseDto } from "@/shared/api/generated/models/BoardListResponseDto";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import { cn } from "@/shared/lib/cn";

interface BoardColumnProps {
    list: BoardListResponseDto;
    allTasks: ScheduleTask[];
    copy: any;
    onDragStart: (taskId: string, sourceListId: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, destListId: string, destIndex?: number) => void;
    onDeleteList: () => void;
}

export function BoardColumn({
    list,
    allTasks,
    copy,
    onDragStart,
    onDragOver,
    onDrop,
    onDeleteList,
}: BoardColumnProps) {
    const listTasks = (list.taskIds || [])
        .map((taskId) => allTasks.find((t) => t.id === taskId))
        .filter(Boolean) as ScheduleTask[];

    return (
        <div
            className="flex w-[300px] shrink-0 flex-col rounded-2xl border-[3px] border-black bg-[#FFFCF4] dark:bg-[#111827] dark:border-white/10 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, list.id as string)}
        >
            <div className="flex items-center justify-between border-b-[3px] border-black dark:border-white/10 p-3">
                <h3 className="font-display font-black uppercase tracking-widest text-black dark:text-white">
                    {list.title}
                </h3>
                <button
                    onClick={onDeleteList}
                    className="text-black/40 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400"
                    title={copy.deleteList}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-3 overflow-y-auto">
                {listTasks.length === 0 ? (
                    <div className="flex h-20 items-center justify-center rounded-xl border-2 border-dashed border-black/10 dark:border-white/10">
                        <span className="text-xs font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
                            Drop here
                        </span>
                    </div>
                ) : (
                    listTasks.map((task, index) => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => {
                                // e.dataTransfer.setData("taskId", task.id);
                                onDragStart(task.id, list.id as string);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.stopPropagation();
                                onDrop(e, list.id as string, index);
                            }}
                            className={cn(
                                "group relative flex cursor-grab items-start gap-2 rounded-xl border-[2px] border-black p-3 shadow-[3px_3px_0_#000] active:cursor-grabbing active:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all",
                                "dark:border-white/20 dark:shadow-[3px_3px_0_rgba(255,255,255,0.2)] dark:bg-white/5"
                            )}
                            style={{ backgroundColor: task.color ? `${task.color}20` : undefined }}
                        >
                            <GripVertical className="mt-0.5 h-4 w-4 shrink-0 opacity-30 group-hover:opacity-100" />
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-black dark:text-white leading-tight">
                                    {task.text}
                                </span>
                                <span className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-50" style={{ color: task.color }}>
                                    Day {task.day}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
