"use client";

import { Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { ActivityTag } from "@/features/tags/types/tag.types";

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
    return (
        <aside className="hidden w-[220px] min-w-[220px] flex-col border-r border-slate-200 bg-white md:flex">
            <div className="border-b border-slate-200 p-5">
                <button
                    onClick={onCreateActivity}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                    <Plus size={16} />
                    {lang === "es" ? "Agregar tarea" : "Add task"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                    {lang === "es" ? "Etiquetas" : "Tags"}
                </h4>

                <div className="space-y-1">
                    <button
                        onClick={() => onSelectTag("all")}
                        className={cn(
                            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                            selectedTag === "all"
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                        )}
                    >
                        <span className="h-3 w-3 rounded-full bg-slate-400" />
                        {lang === "es" ? "Todas las etiquetas" : "All tags"}
                    </button>

                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => onSelectTag(tag.id)}
                            className={cn(
                                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                                selectedTag === tag.id
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
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