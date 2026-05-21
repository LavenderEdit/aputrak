"use client";

import { useMemo, useState } from "react";
import { Inbox, Plus, Search, Trash2 } from "lucide-react";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import { Button } from "@/shared/components/ui/Button";
import { DEFAULT_ACTIVITY_TAGS } from "@/features/tags/constants/tags.constants";
import { scheduleTasksToActivities } from "../lib/activity-adapters";
import { getShortDate } from "@/features/calendar/lib/calendar-utils";

interface ActivitiesViewProps {
    lang: string;
    weekId: string;
    tasks: ScheduleTask[];
    onCreateTask: () => void;
    onEditTask: (task: ScheduleTask) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string, index: number) => void;
}

export function ActivitiesView({
    lang,
    weekId,
    tasks,
    onCreateTask,
    onEditTask,
    onDeleteTask,
    onToggleComplete,
}: ActivitiesViewProps) {
    const [search, setSearch] = useState("");
    const [tagFilter, setTagFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");

    const activities = useMemo(
        () => scheduleTasksToActivities(tasks, weekId),
        [tasks, weekId],
    );

    const filtered = activities.filter((activity) => {
        const matchesSearch = activity.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesTag = tagFilter === "all" || activity.tagId === tagFilter;
        const matchesStatus =
            statusFilter === "all" || activity.status === statusFilter;

        return matchesSearch && matchesTag && matchesStatus;
    });

    const taskMap = new Map(tasks.map((task) => [task.id, task]));

    return (
        <div className="mx-auto max-w-4xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={lang === "es" ? "Buscar actividades..." : "Search activities..."}
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-500"
                    />
                </div>

                <select
                    value={tagFilter}
                    onChange={(event) => setTagFilter(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
                >
                    <option value="all">
                        {lang === "es" ? "Todas las etiquetas" : "All tags"}
                    </option>

                    {DEFAULT_ACTIVITY_TAGS.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                            {tag.name}
                        </option>
                    ))}
                </select>

                <Button onClick={onCreateTask}>
                    <Plus size={16} />
                    {lang === "es" ? "Agregar tarea" : "Add task"}
                </Button>
            </div>

            <div className="mb-5 flex gap-1 rounded-xl bg-slate-100 p-1">
                {(["all", "pending", "completed"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${statusFilter === status
                            ? "bg-white text-indigo-600 shadow"
                            : "text-slate-500"
                            }`}
                    >
                        {status === "all"
                            ? lang === "es"
                                ? "Todas"
                                : "All"
                            : status === "pending"
                                ? lang === "es"
                                    ? "Pendiente"
                                    : "Pending"
                                : lang === "es"
                                    ? "Completada"
                                    : "Completed"}
                    </button>
                ))}
            </div>

            {filtered.length > 0 ? (
                filtered.map((activity) => {
                    const sourceTask = taskMap.get(activity.id);

                    return (
                        <article
                            key={activity.id}
                            onClick={() => {
                                if (sourceTask) onEditTask(sourceTask);
                            }}
                            className="mb-3 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-sm"
                        >
                            <input
                                type="checkbox"
                                checked={activity.status === "completed"}
                                onClick={(event) => event.stopPropagation()}
                                onChange={() => onToggleComplete(activity.id, 0)}
                                className="mt-0.5 h-5 w-5 rounded-md border-slate-300 text-indigo-600"
                            />

                            <div
                                className="w-1 self-stretch rounded-full"
                                style={{ backgroundColor: activity.color }}
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`text-sm font-medium ${activity.status === "completed"
                                            ? "text-slate-500 line-through"
                                            : "text-slate-900"
                                            }`}
                                    >
                                        {activity.title}
                                    </span>
                                </div>

                                <div className="mt-0.5 text-xs text-slate-500">
                                    {getShortDate(activity.date, lang)} · {activity.startTime} -{" "}
                                    {activity.endTime}
                                </div>

                                {activity.description && (
                                    <div className="mt-1 line-clamp-1 text-xs text-slate-500">
                                        {activity.description}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDeleteTask(activity.id);
                                }}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                                <Trash2 size={14} />
                            </button>
                        </article>
                    );
                })
            ) : (
                <div className="py-16 text-center text-slate-500">
                    <Inbox size={42} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                        {lang === "es" ? "Sin actividades aún" : "No activities yet"}
                    </p>
                    <p className="mt-1 text-xs">
                        {lang === "es"
                            ? "Agrega tu primera actividad para comenzar"
                            : "Add your first activity to get started"}
                    </p>
                </div>
            )}
        </div>
    );
}