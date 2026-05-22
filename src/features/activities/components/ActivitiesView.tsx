"use client";

import { useMemo, useState } from "react";
import { Inbox, Plus, Search, Trash2 } from "lucide-react";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import { Button } from "@/shared/components/ui/Button";
import { DEFAULT_ACTIVITY_TAGS } from "@/features/tags/constants/tags.constants";
import { scheduleTasksToActivities } from "../lib/activity-adapters";
import { getShortDate } from "@/features/calendar/lib/calendar-utils";
import { getActivitiesCopy } from "../constants/activities.constants";

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
    const copy = getActivitiesCopy(lang);

    const [search, setSearch] = useState("");
    const [tagFilter, setTagFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "pending" | "completed"
    >("all");

    const activities = useMemo(
        () => scheduleTasksToActivities(tasks, weekId),
        [tasks, weekId],
    );

    const taskMap = useMemo(
        () => new Map(tasks.map((task) => [task.id, task])),
        [tasks],
    );

    const tagsMap = useMemo(
        () => new Map(DEFAULT_ACTIVITY_TAGS.map((tag) => [tag.id, tag])),
        [],
    );

    const filtered = activities
        .filter((activity) => {
            const normalizedSearch = search.trim().toLowerCase();

            const matchesSearch =
                normalizedSearch.length === 0 ||
                activity.title.toLowerCase().includes(normalizedSearch) ||
                activity.description.toLowerCase().includes(normalizedSearch);

            const matchesTag = tagFilter === "all" || activity.tagId === tagFilter;

            const matchesStatus =
                statusFilter === "all" || activity.status === statusFilter;

            return matchesSearch && matchesTag && matchesStatus;
        })
        .sort((a, b) => {
            return (
                a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
            );
        });

    const statusLabels = {
        all: copy.all,
        pending: copy.pending,
        completed: copy.completed,
    };

    const priorityLabels = {
        high: copy.high,
        medium: copy.medium,
        low: copy.low,
    };

    return (
        <div className="mx-auto max-w-4xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={copy.searchPlaceholder}
                        className="w-full rounded-xl border border-sborder bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-primary"
                    />
                </div>

                <select
                    value={tagFilter}
                    onChange={(event) => setTagFilter(event.target.value)}
                    className="rounded-xl border border-sborder bg-white px-4 py-2.5 text-sm outline-none"
                >
                    <option value="all">{copy.allTags}</option>

                    {DEFAULT_ACTIVITY_TAGS.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                            {tag.name}
                        </option>
                    ))}
                </select>

                <Button onClick={onCreateTask}>
                    <Plus size={16} />
                    {copy.addTask}
                </Button>
            </div>

            <div className="mb-5 flex gap-1 rounded-xl bg-slate-100 p-1">
                {(["all", "pending", "completed"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${statusFilter === status
                            ? "bg-white text-primary shadow-sm"
                            : "text-muted hover:text-slate-900"
                            }`}
                    >
                        {statusLabels[status]}
                    </button>
                ))}
            </div>

            {filtered.length > 0 ? (
                filtered.map((activity) => {
                    const sourceTask = taskMap.get(activity.id);
                    const tag = tagsMap.get(activity.tagId);
                    const color = activity.color || tag?.color || "#6366F1";

                    return (
                        <article
                            key={activity.id}
                            onClick={() => {
                                if (sourceTask) {
                                    onEditTask(sourceTask);
                                }
                            }}
                            className="mb-3 flex cursor-pointer items-start gap-3 rounded-xl border border-sborder bg-white p-4 transition hover:shadow-sm"
                        >
                            <input
                                type="checkbox"
                                className="task-check mt-0.5"
                                checked={activity.status === "completed"}
                                onClick={(event) => event.stopPropagation()}
                                onChange={() => onToggleComplete(activity.id, 0)}
                            />

                            <div
                                className="w-1 self-stretch rounded-full"
                                style={{ backgroundColor: color }}
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`text-sm font-medium ${activity.status === "completed"
                                            ? "text-muted line-through"
                                            : "text-slate-900"
                                            }`}
                                    >
                                        {activity.title}
                                    </span>

                                    <span
                                        className="tag-pill"
                                        style={{
                                            backgroundColor: `${color}18`,
                                            color,
                                        }}
                                    >
                                        {tag?.name ?? copy.untagged}
                                    </span>
                                </div>

                                <div className="mt-0.5 text-xs text-muted">
                                    {getShortDate(activity.date, lang)} · {activity.startTime} -{" "}
                                    {activity.endTime}
                                </div>

                                {activity.description && (
                                    <div className="mt-1 line-clamp-1 text-xs text-muted">
                                        {activity.description}
                                    </div>
                                )}

                                {activity.priority !== "none" && (
                                    <span
                                        className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${activity.priority === "high"
                                            ? "bg-red-50 text-red-600"
                                            : activity.priority === "medium"
                                                ? "bg-amber-50 text-amber-700"
                                                : "bg-slate-100 text-muted"
                                            }`}
                                    >
                                        {priorityLabels[activity.priority]}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDeleteTask(activity.id);
                                }}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-danger"
                            >
                                <Trash2 size={14} />
                            </button>
                        </article>
                    );
                })
            ) : (
                <div className="py-16 text-center text-muted">
                    <Inbox size={42} className="mx-auto mb-3 opacity-30" />

                    <p className="text-sm">{copy.emptyTitle}</p>

                    <p className="mt-1 text-xs">{copy.emptyDescription}</p>
                </div>
            )}
        </div>
    );
}