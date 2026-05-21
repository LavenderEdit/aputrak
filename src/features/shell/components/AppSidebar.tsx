"use client";

import {
    CalendarCheck,
    CalendarDays,
    FileDown,
    FileUp,
    Grid2X2,
    ListTodo,
    Settings,
    Tags,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { getShellCopy } from "../constants/shell.constants";
import type { AppView } from "../types/shell.types";

interface AppSidebarProps {
    username: string;
    lang: string;
    activeView: AppView;
    sidebarOpen: boolean;
    onCloseSidebar: () => void;
    onChangeView: (view: AppView) => void;
    onOpenSettings: () => void;
}

export function AppSidebar({
    username,
    lang,
    activeView,
    sidebarOpen,
    onCloseSidebar,
    onChangeView,
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

    const handleChangeView = (view: AppView) => {
        onChangeView(view);
        onCloseSidebar();
    };

    return (
        <aside
            className={cn(
                "no-print fixed inset-y-0 left-0 z-40 flex w-[260px] min-w-[260px] flex-col border-r border-sborder bg-white transition-transform duration-300 md:static md:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
        >
            <div className="border-b border-sborder p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                        <CalendarCheck size={20} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="font-display text-base font-bold text-slate-950">
                            {copy.appName}
                        </h2>

                        <p className="truncate text-xs text-muted">{username}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleChangeView(item.id)}
                            className={cn(
                                "flex w-full items-center gap-2.5 rounded-[10px] px-3.5 py-2 text-sm font-medium transition",
                                activeView === item.id
                                    ? "bg-indigo-50 font-semibold text-primary"
                                    : "text-muted hover:bg-hover hover:text-slate-950",
                            )}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}

                <button
                    onClick={() => {
                        onOpenSettings();
                        onCloseSidebar();
                    }}
                    className={cn(
                        "flex w-full items-center gap-2.5 rounded-[10px] px-3.5 py-2 text-sm font-medium transition",
                        activeView === "settings"
                            ? "bg-indigo-50 font-semibold text-primary"
                            : "text-muted hover:bg-hover hover:text-slate-950",
                    )}
                >
                    <Settings size={18} />
                    <span>{copy.settings}</span>
                </button>
            </nav>

            <div className="border-t border-sborder p-4">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted">
                    <span className="status-dot bg-success" />
                    {lang === "es" ? "Guardado localmente" : "Saved locally"}
                </div>
            </div>
        </aside>
    );
}