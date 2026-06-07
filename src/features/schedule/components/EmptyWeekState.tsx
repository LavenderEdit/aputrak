"use client";

import { CalendarPlus, Copy, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
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
        <section className="border-[3px] border-black bg-[#FFFCF4] p-8 text-center shadow-[6px_6px_0_#000]">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center border-[3px] border-black bg-white shadow-[4px_4px_0_#000]">
                <CalendarPlus size={32} strokeWidth={3} className="text-black" />
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                {t("emptyTitle")}
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-relaxed text-slate-600">
                {t("emptyDesc")}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button onClick={onCreateTask} size="lg">
                    <Plus size={18} />
                    {t("activity")}
                </Button>

                <Button onClick={onCopyPreviousWeek} variant="secondary" size="lg">
                    <Copy size={18} />
                    {t("cloneWeek")}
                </Button>
            </div>
        </section>
    );
}