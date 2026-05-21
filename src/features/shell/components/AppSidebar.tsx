"use client";

import {
    CalendarDays,
    FileDown,
    FileUp,
    Grid2X2,
    ListTodo,
    Plus,
    Settings,
    Sparkles,
    Tags,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { getShellCopy } from "../constants/shell.constants";
import type { AppView } from "../types/shell.types";

interface AppSidebarProps {
    username: string;
    lang: string;
    activeView: AppView;
    onChangeView: (view: AppView) => void;
    onCreateTask: () => void;
    onOpenSettings: () => void;
}

export function AppSidebar({
    username,
    lang,
    activeView,
    onChangeView,
    onCreateTask,
    onOpenSettings,
}: AppSidebarProps) {
    const copy = getShellCopy(lang);

    const navItems = [
        { id: "dashboard" as const, label: copy.dashboard, icon: Grid2X2 },
        { id: "calendar" as const, label: copy.calendar, icon: CalendarDays },
        { id: "activities" as const, label: copy.activities, icon: ListTodo },
        { id: "tags" as const, label: copy.tags, icon: Tags },
        { id: "import" as const, label: copy.import, icon: FileUp },
        { id: "export" as const, label: copy.export, icon: FileDown },
    ];

    return (
        <aside className="no-print hidden w-[260px] min-w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
            <div className="border-b border-slate-200 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Sparkles size={20} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="font-display text-base font-bold text-slate-950">
                            {copy.appName}
                        </h2>

                        <p className="truncate text-xs text-slate-500">{username}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                <button
                    onClick={onCreateTask}
                    className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                    <Plus size={16} />
                    {copy.newActivity}
                </button>

                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id)}
                            className={cn(
                                "flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium transition",
                                activeView === item.id
                                    ? "bg-indigo-50 font-semibold text-indigo-600"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
                            )}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}

                <button
                    onClick={onOpenSettings}
                    className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium transition",
                        activeView === "settings"
                            ? "bg-indigo-50 font-semibold text-indigo-600"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
                    )}
                >
                    <Settings size={18} />
                    <span>{copy.settings}</span>
                </button>
            </nav>

            <div className="border-t border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {lang === "es" ? "Guardado localmente" : "Saved locally"}
                </div>
            </div>
        </aside>
    );
}