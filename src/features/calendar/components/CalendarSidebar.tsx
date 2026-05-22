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
    return (
        <aside className="hidden w-[220px] shrink-0 flex-col border-r border-sborder bg-white md:flex">
            <div className="border-b border-sborder p-5">
                <button
                    onClick={onCreateActivity}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-primary-dark"
                >
                    <Plus size={16} />
                    {copy.addTask}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                    {copy.tags}
                </h4>

                <div className="space-y-1">
                    <button
                        onClick={() => onSelectTag("all")}
                        className={cn(
                            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                            selectedTag === "all"
                                ? "bg-indigo-50 text-primary"
                                : "text-muted hover:bg-hover hover:text-slate-950",
                        )}
                    >
                        <span className="h-3 w-3 rounded-full bg-slate-400" />
                        {copy.all}
                    </button>

                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => onSelectTag(tag.id)}
                            className={cn(
                                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                                selectedTag === tag.id
                                    ? "bg-indigo-50 text-primary"
                                    : "text-muted hover:bg-hover hover:text-slate-950",
                            )}
                        >
                            <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: tag.color }}
                            />
                            <span className="truncate">{tag.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}