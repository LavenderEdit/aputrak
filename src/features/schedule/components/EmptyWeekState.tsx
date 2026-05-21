"use client";

import { CalendarPlus, Copy, Plus } from "lucide-react";
import type { TranslateFn } from "@/shared/types/i18n.types";

interface EmptyWeekStateProps {
    t: TranslateFn;
    onCreateTask: () => void;
    onCopyPreviousWeek: () => Promise<void>;
}

export function EmptyWeekState({
    t,
    onCreateTask,
    onCopyPreviousWeek,
}: EmptyWeekStateProps) {
    return (
        <section className="rounded-[2rem] border border-indigo-100 bg-indigo-50/80 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
                <CalendarPlus className="text-indigo-600" size={32} />
            </div>

            <h3 className="text-xl font-black text-indigo-950">
                {t("emptyTitle")}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-relaxed text-indigo-700/80">
                {t("emptyDesc")}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                    onClick={onCreateTask}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    {t("activity")}
                </button>

                <button
                    onClick={onCopyPreviousWeek}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
                >
                    <Copy size={18} />
                    {t("cloneWeek")}
                </button>
            </div>
        </section>
    );
}