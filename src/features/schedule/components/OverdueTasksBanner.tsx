"use client";

import { Sparkles } from "lucide-react";
import type { TranslateFn } from "@/shared/types/i18n.types";

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
    return (
        <section className="rounded-[1.75rem] border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-lg font-black text-amber-950">
                        {t("smartTetrisTitle").replace("{count}", String(count))}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-amber-700/80">
                        {t("smartTetrisDesc")}
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        onClick={onDismiss}
                        className="rounded-2xl border border-amber-200 bg-white/70 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-white"
                    >
                        {lang === "es" ? "Ocultar" : "Dismiss"}
                    </button>

                    <button
                        onClick={onSmartReschedule}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
                    >
                        <Sparkles size={16} />
                        {t("smartTetrisBtn")}
                    </button>
                </div>
            </div>
        </section>
    );
}