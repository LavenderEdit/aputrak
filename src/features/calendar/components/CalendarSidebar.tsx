"use client";

import { Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { ActivityTag } from "@/features/tags/types/tag.types";
import { getCalendarCopy } from "../constants/calendar.constants";

interface CalendarSidebarProps {
    lang: string;
    tags: ActivityTag[];
    selectedTag: string;
    onSelectTag: (tagId: string) => void;
    onCreateActivity: () => void;
}

export function CalendarSidebar({
    lang,
    tags,
    selectedTag,
    onSelectTag,
    onCreateActivity,
}: CalendarSidebarProps) {
    const copy = getCalendarCopy(lang);
    const safeTags = Array.isArray(tags) ? tags : [];

    return (
        <aside className="hidden w-[240px] shrink-0 flex-col border-r-[3px] border-black dark:border-white/10 bg-white dark:bg-white/5 md:flex">
            <div className="border-b-[3px] border-black dark:border-white/10 p-5">
                <button
                    type="button"
                    onClick={onCreateActivity}
                    className="flex w-full items-center justify-center gap-2 border-2 border-black dark:border-white/10 bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition hover:bg-black hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] dark:hover:shadow-[6px_6px_0_rgba(0,0,0,0.5)]"
                >
                    <Plus size={16} strokeWidth={3} />
                    {copy.addTask}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <h4 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-white/50">
                    {copy.tags}
                </h4>

                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => onSelectTag("all")}
                        className={cn(
                            "flex w-full items-center gap-3 border-2 border-black dark:border-white/10 px-3 py-2.5 text-left text-sm font-black uppercase tracking-[0.06em] transition",
                            selectedTag === "all"
                                ? "bg-black text-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                                : "bg-white dark:bg-white/5 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-white/10",
                        )}
                    >
                        <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10 bg-slate-400 shadow-sm" />
                        <span className="truncate">{copy.all}</span>
                    </button>

                    {safeTags.map((tag) => {
                        const active = selectedTag === tag.id;

                        return (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => onSelectTag(tag.id)}
                                className={cn(
                                    "flex w-full items-center gap-3 border-2 border-black dark:border-white/10 px-3 py-2.5 text-left text-sm font-black uppercase tracking-[0.06em] transition",
                                    active
                                        ? "bg-white dark:bg-white/5 text-black dark:text-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                                        : "bg-white dark:bg-white/5 text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10",
                                )}
                            >
                                <span
                                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10 shadow-sm"
                                    style={{ backgroundColor: tag.color }}
                                />

                                <span className="min-w-0 truncate">
                                    {tag.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}