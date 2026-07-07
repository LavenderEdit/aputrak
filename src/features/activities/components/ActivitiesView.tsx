"use client";

import { useMemo, useState } from "react";
import { Check, Inbox, Plus, Search, Trash2, ChevronDown } from "lucide-react";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { useActivityTags } from "@/features/tags/hooks/useActivityTags";
import { scheduleTasksToActivities } from "../lib/activity-adapters";
import { getShortDate } from "@/features/calendar/lib/calendar-utils";
import { getActivitiesCopy } from "../constants/activities.constants";
import { cn } from "@/shared/lib/cn";

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
    const { tags } = useActivityTags();

    const [search, setSearch] = useState("");
    const [tagFilter, setTagFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "pending" | "completed"
    >("all");

    const activities = useMemo(
        () => scheduleTasksToActivities(tasks, weekId, tags),
        [tasks, weekId, tags],
    );

    const taskMap = useMemo(
        () => new Map(tasks.map((task) => [task.id, task])),
        [tasks],
    );

    const tagsMap = useMemo(
        () => new Map(tags.map((tag) => [tag.id, tag])),
        [tags],
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
        <div className="mx-auto max-w-5xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-6 border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-white/50">
                    Aputrak
                </p>

                <h2 className="font-display text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                    {copy.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-slate-600 dark:text-white/60">
                    {copy.subtitle}
                </p>
            </div>

            <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px_auto]">
                <div className="relative">
                    <Search
                        size={16}
                        strokeWidth={3}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white"
                    />

                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={copy.searchPlaceholder}
                        className="pl-10"
                    />
                </div>

                <Select
                    value={tagFilter}
                    onChange={(val) => setTagFilter(val)}
                    placeholder={copy.allTags}
                    options={[
                        { value: "all", label: copy.allTags },
                        ...tags.map((tag) => ({
                            value: tag.id,
                            label: (
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-3 w-3 rounded-full border-2 border-black dark:border-white/20"
                                        style={{ backgroundColor: tag.color || "black" }}
                                    />
                                    <span className="truncate">{tag.name}</span>
                                </div>
                            ),
                        })),
                    ]}
                />

                <Button onClick={onCreateTask} className="w-full lg:w-auto">
                    <Plus size={16} />
                    {copy.addTask}
                </Button>
            </div>

            <div className="mb-5 grid grid-cols-3 border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] shadow-[5px_5px_0_#000] dark:shadow-[5px_5px_0_rgba(0,0,0,0.5)]">
                {(["all", "pending", "completed"] as const).map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                            "border-r-[3px] border-black dark:border-white/10 px-3 py-3 text-xs font-black uppercase tracking-[0.1em] transition last:border-r-0",
                            statusFilter === status
                                ? "bg-black text-white"
                                : "bg-[#FFFCF4] dark:bg-[#111827] text-black dark:text-white hover:bg-white dark:hover:bg-white/10",
                        )}
                    >
                        {statusLabels[status]}
                    </button>
                ))}
            </div>

            {filtered.length > 0 ? (
                <div className="space-y-3">
                    {filtered.map((activity) => {
                        const sourceTask = taskMap.get(activity.id);
                        const tag = tagsMap.get(activity.tagId);
                        const color = activity.color || tag?.color || "#6366F1";
                        const completed = activity.status === "completed";

                        return (
                            <article
                                key={activity.id}
                                onClick={() => {
                                    if (sourceTask) {
                                        onEditTask(sourceTask);
                                    }
                                }}
                                className="flex cursor-pointer items-start gap-3 border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-4 shadow-[5px_5px_0_#000] dark:shadow-[5px_5px_0_rgba(0,0,0,0.5)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-white/10 hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_rgba(0,0,0,0.5)]"
                            >
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onToggleComplete(activity.id, 0);
                                    }}
                                    className={cn(
                                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-black dark:border-white/10",
                                        completed
                                            ? "bg-black text-white"
                                            : "bg-white dark:bg-white/5 text-black dark:text-white",
                                    )}
                                    aria-label={
                                        completed
                                            ? copy.completed
                                            : copy.pending
                                    }
                                >
                                    {completed && <Check size={15} strokeWidth={3} />}
                                </button>

                                <div
                                    className="w-2 self-stretch border-2 border-black dark:border-white/10"
                                    style={{ backgroundColor: color }}
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={cn(
                                                "text-sm font-black uppercase tracking-[0.04em]",
                                                completed
                                                    ? "text-slate-400 line-through"
                                                    : "text-black dark:text-white",
                                            )}
                                        >
                                            {activity.title}
                                        </span>

                                        <span
                                            className="border-2 border-black dark:border-white/10 bg-white dark:bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em]"
                                            style={{ color }}
                                        >
                                            {tag?.name ?? copy.untagged}
                                        </span>
                                    </div>

                                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-white/50">
                                        {getShortDate(activity.date, lang)} ·{" "}
                                        {activity.startTime} - {activity.endTime}
                                    </div>

                                    {activity.description && (
                                        <div className="mt-1 line-clamp-1 text-xs font-bold text-slate-500 dark:text-white/50">
                                            {activity.description}
                                        </div>
                                    )}

                                    {activity.priority !== "none" && (
                                        <span className="mt-2 inline-block border-2 border-black dark:border-white/10 bg-white dark:bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-black dark:text-white">
                                            {priorityLabels[activity.priority]}
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onDeleteTask(activity.id);
                                    }}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white transition hover:bg-red-600 hover:text-white"
                                    aria-label={copy.delete}
                                >
                                    <Trash2 size={15} strokeWidth={3} />
                                </button>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] py-16 text-center shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                    <Inbox size={42} strokeWidth={3} className="mx-auto mb-3 text-black dark:text-white" />

                    <p className="text-sm font-black uppercase tracking-[0.08em] text-black dark:text-white">
                        {copy.emptyTitle}
                    </p>

                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-white/50">
                        {copy.emptyDescription}
                    </p>
                </div>
            )}
        </div>
    );
}