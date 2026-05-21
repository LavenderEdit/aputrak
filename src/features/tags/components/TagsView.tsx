"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import { Button } from "@/shared/components/ui/Button";
import { DEFAULT_ACTIVITY_TAGS } from "../constants/tags.constants";
import type { ActivityTag } from "../types/tag.types";
import { scheduleTasksToActivities } from "@/features/activities/lib/activity-adapters";
import { TagModal } from "./TagModal";

interface TagsViewProps {
    lang: string;
    weekId: string;
    tasks: ScheduleTask[];
}

export function TagsView({ lang, weekId, tasks }: TagsViewProps) {
    const [tags, setTags] = useState<ActivityTag[]>(DEFAULT_ACTIVITY_TAGS);
    const [editingTag, setEditingTag] = useState<ActivityTag | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activities = useMemo(
        () => scheduleTasksToActivities(tasks, weekId),
        [tasks, weekId],
    );

    const counts = activities.reduce<Record<string, number>>((acc, activity) => {
        acc[activity.tagId] = (acc[activity.tagId] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <div className="mx-auto max-w-3xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-slate-950">
                    {lang === "es" ? "Etiquetas" : "Tags"}
                </h2>

                <Button
                    onClick={() => {
                        setEditingTag(null);
                        setIsModalOpen(true);
                    }}
                >
                    <Plus size={16} />
                    {lang === "es" ? "Agregar Etiqueta" : "Add Tag"}
                </Button>
            </div>

            <div className="space-y-3">
                {tags.length > 0 ? (
                    tags.map((tag) => (
                        <article
                            key={tag.id}
                            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-sm"
                        >
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                                style={{ backgroundColor: tag.color }}
                            >
                                <Tags size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-slate-900">
                                    {tag.name}
                                </div>

                                <div className="text-xs text-slate-500">
                                    {counts[tag.id] ?? 0}{" "}
                                    {lang === "es" ? "actividades" : "activities"}
                                </div>
                            </div>

                            <div className="flex gap-1">
                                <button
                                    onClick={() => {
                                        setEditingTag(tag);
                                        setIsModalOpen(true);
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                                >
                                    <Pencil size={14} />
                                </button>

                                <button
                                    onClick={() => {
                                        setTags((current) =>
                                            current.filter((item) => item.id !== tag.id),
                                        );
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="py-16 text-center text-slate-500">
                        <Tags size={42} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">
                            {lang === "es" ? "Sin etiquetas aún" : "No tags yet"}
                        </p>
                        <p className="mt-1 text-xs">
                            {lang === "es"
                                ? "Agrega tu primera etiqueta para organizar actividades"
                                : "Add your first tag to organize activities"}
                        </p>
                    </div>
                )}
            </div>

            <TagModal
                isOpen={isModalOpen}
                tag={editingTag}
                lang={lang}
                onClose={() => setIsModalOpen(false)}
                onSave={(tag) => {
                    setTags((current) => {
                        const exists = current.some((item) => item.id === tag.id);

                        if (exists) {
                            return current.map((item) => (item.id === tag.id ? tag : item));
                        }

                        return [...current, tag];
                    });

                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}