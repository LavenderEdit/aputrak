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
import {
    GENERAL_TAG_ID,
    getTagsCopy,
} from "../constants/tags.constants";
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
        () => scheduleTasksToActivities(tasks, weekId, tags),
        [tasks, weekId, tags],
    );

    const counts = activities.reduce<Record<string, number>>((acc, activity) => {
        acc[activity.tagId] = (acc[activity.tagId] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <div className="mx-auto max-w-3xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black">
                        {copy.title}
                    </h2>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        {lang === "es"
                            ? "Organiza tus actividades por categorías"
                            : "Organize your activities by categories"}
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setEditingTag(null);
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto"
                >
                    <Plus size={16} />
                    {copy.addTag}
                </Button>
            </div>

            <div className="space-y-3">
                {tags.length > 0 ? (
                    tags.map((tag) => {
                        const Icon = iconMap[tag.icon] ?? Tags;
                        const isGeneralTag = tag.id === GENERAL_TAG_ID;

                        return (
                            <article
                                key={tag.id}
                                className="flex items-center gap-4 border-[3px] border-black bg-white p-4 shadow-[5px_5px_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#000]"
                            >
                                <div
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                                    style={{ backgroundColor: tag.color }}
                                >
                                    <Icon size={18} strokeWidth={3} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-black uppercase tracking-[0.06em] text-black">
                                        {tag.name}
                                    </div>

                                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                                        {counts[tag.id] ?? 0} {copy.activities}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingTag(tag);
                                            setIsModalOpen(true);
                                        }}
                                        className="flex h-9 w-9 items-center justify-center border-2 border-black bg-white text-black transition hover:bg-black hover:text-white"
                                        aria-label={copy.editTag}
                                    >
                                        <Pencil size={15} strokeWidth={3} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isGeneralTag) return;
                                            void deleteTag(tag.id);
                                        }}
                                        disabled={isGeneralTag}
                                        className="flex h-9 w-9 items-center justify-center border-2 border-black bg-white text-black transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black"
                                        aria-label={copy.deleteTag}
                                    >
                                        <Trash2 size={15} strokeWidth={3} />
                                    </button>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <div className="border-[3px] border-black bg-white py-16 text-center shadow-[6px_6px_0_#000]">
                        <Tags size={42} className="mx-auto mb-3 text-black" />

                        <p className="text-sm font-black uppercase tracking-[0.08em] text-black">
                            {copy.emptyTitle}
                        </p>

                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                            {copy.emptyDescription}
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
                    void saveTag(tag);
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}