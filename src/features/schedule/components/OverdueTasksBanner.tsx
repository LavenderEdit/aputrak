"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type { TranslateFn } from "@/shared/types/i18n.types";
import { getScheduleCopy } from "../constants/schedule.constants";

interface OverdueTasksBannerProps {
    count: number;
    lang: string;
    t: TranslateFn;
    onDismiss: () => void;
    onSmartReschedule: () => Promise<void>;
}

export function OverdueTasksBanner({
    count,
    lang,
    t,
    onDismiss,
    onSmartReschedule,
}: OverdueTasksBannerProps) {
    const copy = getScheduleCopy(lang);

    return (
        <section className="border-[3px] border-black bg-[#FFF3C4] p-5 shadow-[6px_6px_0_#000]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                    <div className="mb-2 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-black">
                        <Sparkles size={13} strokeWidth={3} />
                        {lang === "es" ? "Reordenar" : "Reschedule"}
                    </div>

                    <h2 className="text-xl font-black uppercase tracking-tight text-black">
                        {t("smartTetrisTitle").replace("{count}", String(count))}
                    </h2>

                    <p className="mt-2 text-sm font-bold text-slate-700">
                        {t("smartTetrisDesc")}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="secondary" onClick={onDismiss}>
                        {copy.hide}
                    </Button>

                    <Button onClick={onSmartReschedule}>
                        <Sparkles size={16} />
                        {t("smartTetrisBtn")}
                    </Button>
                </div>
            </div>
        </section>
    );
}