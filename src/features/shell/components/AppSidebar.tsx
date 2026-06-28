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
    Moon,
    Sun,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useTheme } from "@/shared/components/providers/ThemeProvider";
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
    const { theme, toggleTheme } = useTheme();

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
                "no-print fixed inset-y-0 left-0 z-40 flex w-[270px] min-w-[270px] flex-col border-r-[3px] border-black bg-[#FFFCF4] transition-transform duration-300 md:static md:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
        >
            <div className="border-b-[3px] border-black p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-white shadow-[3px_3px_0_#000]">
                        <CalendarCheck size={22} strokeWidth={3} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="font-display text-lg font-black uppercase tracking-tight text-black">
                            {copy.appName}
                        </h2>

                        <p className="truncate text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                            {username}
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => handleChangeView(item.id)}
                            className={cn(
                                "flex w-full items-center gap-3 border-2 border-black px-3 py-2.5 text-left text-sm font-black uppercase tracking-[0.06em] transition",
                                active
                                    ? "bg-black text-white shadow-[4px_4px_0_#000]"
                                    : "bg-white text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#F5F0E6] hover:shadow-[4px_4px_0_#000]",
                            )}
                        >
                            <Icon size={18} strokeWidth={3} />
                            <span className="truncate">{item.label}</span>
                        </button>
                    );
                })}

                <button
                    type="button"
                    onClick={() => {
                        onOpenSettings();
                        onCloseSidebar();
                    }}
                    className={cn(
                        "flex w-full items-center gap-3 border-2 border-black px-3 py-2.5 text-left text-sm font-black uppercase tracking-[0.06em] transition",
                        activeView === "settings"
                            ? "bg-black text-white shadow-[4px_4px_0_#000]"
                            : "bg-white text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#F5F0E6] hover:shadow-[4px_4px_0_#000]",
                    )}
                >
                    <Settings size={18} strokeWidth={3} />
                    <span>{copy.settings}</span>
                </button>
            </nav>

            <div className="border-t-[3px] border-black p-4 flex flex-col gap-3">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex w-full items-center justify-center gap-2 border-2 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] transition"
                >
                    {theme === 'dark' ? <Sun size={14} strokeWidth={3} /> : <Moon size={14} strokeWidth={3} />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>

                <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-black">
                    <span className="h-2.5 w-2.5 border-2 border-black bg-emerald-500" />
                    {copy.savedLocally}
                </div>
            </div>
        </aside>
    );
}