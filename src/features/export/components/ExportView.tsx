"use client";

import { useState } from "react";
import {
    Calendar,
    CalendarDays,
    Check,
    Download,
    FileJson,
    ImageIcon,
    MonitorSmartphone,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/cn";
import type { GraphicExportType } from "@/features/shell/types/shell.types";
import type { ExportOptions } from "../hooks/useScheduleExport";
import { getExportCopy } from "../constants/export.constants";

interface ExportViewProps {
    lang: string;
    onExportPDF: (options: ExportOptions) => void;
    onExportImage: (type: GraphicExportType, options: ExportOptions) => void;
    onExportJSON: () => void;
}

function OptionButton({
    active,
    icon,
    label,
    onClick,
}: {
    active: boolean;
    icon?: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex min-h-[64px] items-center justify-center gap-2 border-[3px] border-black dark:border-white/10 px-4 py-3 text-sm font-black uppercase tracking-[0.08em] transition",
                active
                    ? "bg-black text-white shadow-[4px_4px_0_#000]"
                    : "bg-white dark:bg-white/5 text-black dark:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#F5F0E6] dark:hover:bg-white/10 hover:shadow-[4px_4px_0_#000] dark:hover:shadow-[4px_4px_0_rgba(0,0,0,0.5)]",
            )}
        >
            {icon}
            {label}
        </button>
    );
}

function CheckboxOption({
    checked,
    label,
    onChange,
}: {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-3 border-2 border-black dark:border-white/10 bg-white dark:bg-white/5 p-3 transition hover:bg-[#F5F0E6] dark:hover:bg-white/10">
            <span
                className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center border-2 border-black dark:border-white/10",
                    checked ? "bg-black text-white" : "bg-white dark:bg-white/5 text-black dark:text-white",
                )}
            >
                {checked && <Check size={15} strokeWidth={3} />}
            </span>

            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="sr-only"
            />

            <span className="text-sm font-black uppercase tracking-[0.06em] text-black dark:text-white">
                {label}
            </span>
        </label>
    );
}

export function ExportView({
    lang,
    onExportPDF,
    onExportImage,
    onExportJSON,
}: ExportViewProps) {
    const [range, setRange] = useState<"week" | "month">("week");
    const [includeCompleted, setIncludeCompleted] = useState(true);
    const [includeNotes, setIncludeNotes] = useState(true);
    const [layoutStyle, setLayoutStyle] = useState<"compact" | "detailed">(
        "compact",
    );

    const copy = getExportCopy(lang);

    const exportOptions: ExportOptions = {
        range,
        includeCompleted,
        includeNotes,
        layoutStyle,
    };

    return (
        <div className="mx-auto max-w-4xl p-4 pb-8 fade-in sm:p-6 lg:p-8">
            <div className="mb-6 border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-white/50">
                    Aputrak
                </p>

                <h2 className="font-display text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                    {copy.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-slate-600 dark:text-white/60">
                    {copy.subtitle}
                </p>
            </div>

            <section className="border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)] sm:p-6">
                <div className="space-y-6">
                    <div>
                        <label className="mb-3 block text-xs font-black uppercase tracking-[0.14em] text-black dark:text-white">
                            {copy.dateRange}
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <OptionButton
                                active={range === "week"}
                                icon={<CalendarDays size={18} strokeWidth={3} />}
                                label={copy.week}
                                onClick={() => setRange("week")}
                            />

                            <OptionButton
                                active={range === "month"}
                                icon={<Calendar size={18} strokeWidth={3} />}
                                label={copy.month}
                                onClick={() => setRange("month")}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-3 block text-xs font-black uppercase tracking-[0.14em] text-black dark:text-white">
                            {lang === "es" ? "Contenido" : "Content"}
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <CheckboxOption
                                checked={includeCompleted}
                                label={copy.includeCompleted}
                                onChange={setIncludeCompleted}
                            />

                            <CheckboxOption
                                checked={includeNotes}
                                label={copy.includeNotes}
                                onChange={setIncludeNotes}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-3 block text-xs font-black uppercase tracking-[0.14em] text-black dark:text-white">
                            {copy.layoutStyle}
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <OptionButton
                                active={layoutStyle === "compact"}
                                label={copy.compact}
                                onClick={() => setLayoutStyle("compact")}
                            />

                            <OptionButton
                                active={layoutStyle === "detailed"}
                                label={copy.detailed}
                                onClick={() => setLayoutStyle("detailed")}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <label className="mb-3 block text-xs font-black uppercase tracking-[0.14em] text-black dark:text-white">
                            {lang === "es" ? "Formato de exportación" : "Export format"}
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Button onClick={() => onExportPDF(exportOptions)} className="w-full">
                                <Download size={16} />
                                {copy.generatePDF}
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => onExportImage("desktop", exportOptions)}
                                className="w-full"
                            >
                                <MonitorSmartphone size={16} />
                                {copy.desktopImage}
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => onExportImage("mobile", exportOptions)}
                                className="w-full"
                            >
                                <ImageIcon size={16} />
                                {copy.mobileImage}
                            </Button>

                            <Button variant="secondary" onClick={onExportJSON} className="w-full">
                                <FileJson size={16} />
                                {copy.backup}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}