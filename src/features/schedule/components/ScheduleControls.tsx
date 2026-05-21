"use client";

import { ChevronLeft, ChevronRight, Settings } from "lucide-react";

interface ScheduleControlsProps {
    weekId: string;
    changeWeek: (direction: number) => void;
    onOpenSettings: () => void;
}

export function ScheduleControls({
    weekId,
    changeWeek,
    onOpenSettings,
}: ScheduleControlsProps) {
    return (
        <section className="no-print rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Semana
                    </p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">{weekId}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => changeWeek(-1)}
                        className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={() => changeWeek(1)}
                        className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                        <ChevronRight size={18} />
                    </button>

                    <button
                        onClick={onOpenSettings}
                        className="flex h-10 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                        <Settings size={16} />
                        Ajustes
                    </button>
                </div>
            </div>
        </section>
    );
}