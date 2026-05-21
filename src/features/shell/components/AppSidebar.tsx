"use client";

import {
    CalendarDays,
    Grid2X2,
    Plus,
    Settings,
    Sparkles,
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
    ];

    return (
        <aside className="no-print hidden w-[280px] shrink-0 border-r border-white/70 bg-white/80 p-4 shadow-[12px_0_40px_rgba(15,23,42,0.04)] backdrop-blur-xl lg:flex lg:flex-col">
            <div className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <Sparkles size={22} />
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-black tracking-tight text-slate-950">
                            {copy.appName}
                        </h1>

                        <p className="truncate text-xs font-medium text-slate-500">
                            {copy.workspace}
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.userLabel}
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-800">
                        {username}
                    </p>
                </div>
            </div>

            <button
                onClick={onCreateTask}
                className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
            >
                <Plus size={18} />
                {copy.newActivity}
            </button>

            <nav className="space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                                activeView === item.id
                                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                            )}
                        >
                            <Icon size={18} />
                            {item.label}
                        </button>
                    );
                })}

                <button
                    onClick={onOpenSettings}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                    <Settings size={18} />
                    {copy.settings}
                </button>
            </nav>

            <div className="mt-auto rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <p className="text-sm font-bold text-emerald-700">
                        {copy.offlineActive}
                    </p>
                </div>

                <p className="mt-1 text-xs leading-relaxed text-emerald-700/70">
                    {copy.offlineDescription}
                </p>
            </div>
        </aside>
    );
}