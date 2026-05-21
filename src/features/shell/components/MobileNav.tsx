"use client";

import { CalendarDays, Grid2X2, Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { AppView } from "../types/shell.types";

interface MobileNavProps {
    activeView: AppView;
    onChangeView: (view: AppView) => void;
    onCreateTask: () => void;
}

export function MobileNav({
    activeView,
    onChangeView,
    onCreateTask,
}: MobileNavProps) {
    return (
        <nav className="no-print fixed inset-x-4 bottom-4 z-40 rounded-[1.5rem] border border-white/70 bg-white/90 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={() => onChangeView("dashboard")}
                    className={cn(
                        "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-black transition",
                        activeView === "dashboard"
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-500",
                    )}
                >
                    <Grid2X2 size={18} />
                    Panel
                </button>

                <button
                    onClick={onCreateTask}
                    className="flex flex-col items-center gap-1 rounded-2xl bg-indigo-600 px-3 py-2 text-xs font-black text-white shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={18} />
                    Crear
                </button>

                <button
                    onClick={() => onChangeView("calendar")}
                    className={cn(
                        "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-black transition",
                        activeView === "calendar"
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-500",
                    )}
                >
                    <CalendarDays size={18} />
                    Agenda
                </button>
            </div>
        </nav>
    );
}