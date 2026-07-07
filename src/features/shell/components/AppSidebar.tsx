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
    LayoutDashboard,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
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
        { id: "board" as const, label: copy.board, icon: LayoutDashboard },
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

    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "no-print fixed inset-y-0 left-0 z-40 flex flex-col border-r-[3px] border-black bg-[#FFFCF4] transition-all duration-300 dark:border-white/10 dark:bg-[#111827] md:static md:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "w-[80px] min-w-[80px]" : "w-[280px] min-w-[280px]"
            )}
        >
            <div className="border-b-[3px] border-black p-4 dark:border-white/10">
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                    <div className="flex shrink-0 h-12 w-12 items-center justify-center border-2 border-black bg-white shadow-[3px_3px_0_#000] dark:border-white/10 dark:bg-white/10 dark:shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
                        <CalendarCheck size={22} strokeWidth={3} />
                    </div>

                    <div className={cn(
                        "min-w-0 flex flex-col transition-all duration-300 overflow-hidden whitespace-nowrap",
                        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}>
                        <h2 className="font-display text-lg font-black uppercase tracking-tight text-black dark:text-white">
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
                                "flex w-full items-center border-2 border-black py-2.5 transition-all duration-300 dark:border-white/10 overflow-hidden whitespace-nowrap",
                                isCollapsed ? "justify-center px-0" : "px-3 text-left text-sm font-black uppercase tracking-[0.06em]",
                                active
                                    ? "translate-x-[2px] translate-y-[2px] bg-black text-white shadow-[2px_2px_0_#000] dark:bg-white/15 dark:text-white dark:shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
                                    : "bg-white text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#F5F0E6] hover:shadow-[4px_4px_0_#000] dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:shadow-[4px_4px_0_rgba(0,0,0,0.5)]",
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon size={18} strokeWidth={3} className="shrink-0" />
                            <span className={cn(
                                "truncate transition-all duration-300",
                                isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 ml-3 block"
                            )}>
                                {item.label}
                            </span>
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
                        "flex w-full items-center border-2 border-black py-2.5 transition-all duration-300 dark:border-white/10 overflow-hidden whitespace-nowrap",
                        isCollapsed ? "justify-center px-0" : "px-3 text-left text-sm font-black uppercase tracking-[0.06em]",
                        activeView === "settings"
                            ? "translate-x-[2px] translate-y-[2px] bg-black text-white shadow-[2px_2px_0_#000] dark:bg-white/15 dark:text-white dark:shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
                            : "bg-white text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#F5F0E6] hover:shadow-[4px_4px_0_#000] dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:shadow-[4px_4px_0_rgba(0,0,0,0.5)]",
                    )}
                    title={isCollapsed ? copy.settings : undefined}
                >
                    <Settings size={18} strokeWidth={3} className="shrink-0" />
                    <span className={cn(
                        "truncate transition-all duration-300",
                        isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 ml-3 block"
                    )}>
                        {copy.settings}
                    </span>
                </button>
            </nav>

            <div className="border-t-[3px] border-black p-4 flex flex-col gap-3 dark:border-white/10">
                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "hidden md:flex w-full items-center border-2 border-black py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-all duration-300 dark:border-white/10 overflow-hidden whitespace-nowrap",
                        isCollapsed 
                            ? "justify-center px-0 translate-x-[2px] translate-y-[2px] bg-black text-white shadow-[2px_2px_0_#000] dark:bg-white/15 dark:text-white dark:shadow-[2px_2px_0_rgba(0,0,0,0.5)]" 
                            : "justify-center px-3 bg-white text-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] dark:bg-white/10 dark:text-white dark:shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    )}
                    title={isCollapsed ? "Expandir Sidebar" : undefined}
                >
                    {isCollapsed ? <PanelLeftOpen size={14} strokeWidth={3} className="shrink-0" /> : <PanelLeftClose size={14} strokeWidth={3} className="shrink-0" />}
                    <span className={cn(
                        "transition-all duration-300",
                        isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 ml-2 block"
                    )}>
                        Colapsar
                    </span>
                </button>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className={cn(
                        "flex w-full items-center border-2 border-black bg-white py-2 text-[10px] font-black uppercase tracking-[0.14em] text-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] transition-all duration-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-[4px_4px_0_rgba(0,0,0,0.5)] overflow-hidden whitespace-nowrap",
                        isCollapsed ? "justify-center px-0" : "justify-center px-3"
                    )}
                    title={isCollapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
                >
                    {theme === 'dark' ? <Sun size={14} strokeWidth={3} className="shrink-0" /> : <Moon size={14} strokeWidth={3} className="shrink-0" />}
                    <span className={cn(
                        "transition-all duration-300",
                        isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 ml-2 block"
                    )}>
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>

                <div className={cn(
                    "flex items-center border-2 border-black bg-white py-2 text-[10px] font-black uppercase tracking-[0.14em] text-black dark:border-white/10 dark:bg-white/10 dark:text-white transition-all duration-300 overflow-hidden whitespace-nowrap",
                    isCollapsed ? "justify-center px-0" : "px-3"
                )}
                title={isCollapsed ? copy.savedLocally : undefined}>
                    <span className="shrink-0 h-2.5 w-2.5 border-2 border-black bg-emerald-500 dark:border-white/10" />
                    <span className={cn(
                        "truncate transition-all duration-300",
                        isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 ml-2 block"
                    )}>
                        {copy.savedLocally}
                    </span>
                </div>
            </div>
        </aside>
    );
}