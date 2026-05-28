"use client";

import { useMemo, useState } from "react";
import {
    BookOpen,
    Briefcase,
    Dumbbell,
    GraduationCap,
    Heart,
    Pencil,
    Plus,
    Tag,
    Tags,
    Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import { Button } from "@/shared/components/ui/Button";
import { getTagsCopy } from "../constants/tags.constants";
import type { ActivityTag } from "../types/tag.types";
import { scheduleTasksToActivities } from "@/features/activities/lib/activity-adapters";
import { TagModal } from "./TagModal";
import { useActivityTags } from "../hooks/useActivityTags";

interface TagsViewProps {
    lang: string;
    weekId: string;
    tasks: ScheduleTask[];
}

const iconMap: Record<string, LucideIcon> = {
    GraduationCap,
    Briefcase,
    Heart,
    Dumbbell,
    BookOpen,
    Tag,
};

export function TagsView({ lang, weekId, tasks }: TagsViewProps) {
    const copy = getTagsCopy(lang);

    const { tags, saveTag, deleteTag } = useActivityTags();
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
            <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-slate-950">
                    {copy.title}
                </h2>

                <Button
                    onClick={() => {
                        setEditingTag(null);
                        setIsModalOpen(true);
                    }}
                >
                    <Plus size={16} />
                    {copy.addTag}
                </Button>
            </div>

            <div className="space-y-3">
                {tags.length > 0 ? (
                    tags.map((tag) => {
                        const Icon = iconMap[tag.icon] ?? Tags;

                        return (
                            <article
                                key={tag.id}
                                className="flex items-center gap-4 rounded-xl border border-sborder bg-white p-4 transition hover:shadow-sm"
                            >
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                                    style={{ backgroundColor: tag.color }}
                                >
                                    <Icon size={16} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-slate-900">
                                        {tag.name}
                                    </div>

                                    <div className="text-xs text-muted">
                                        {counts[tag.id] ?? 0} {copy.activities}
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingTag(tag);
                                            setIsModalOpen(true);
                                        }}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-primary"
                                        aria-label={copy.editTag}
                                    >
                                        <Pencil size={14} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            void deleteTag(tag.id);
                                        }}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-danger"
                                        aria-label={copy.deleteTag}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <div className="py-16 text-center text-muted">
                        <Tags size={42} className="mx-auto mb-3 opacity-30" />

                        <p className="text-sm">{copy.emptyTitle}</p>

                        <p className="mt-1 text-xs">{copy.emptyDescription}</p>
                    </div>
                )}
            </div>

            <TagModal
                isOpen={isModalOpen}
                tag={editingTag}
                lang={lang}
                onClose={() => setIsModalOpen(false)}
                onSave={(tag) => {
                    void saveTag(tag);
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}