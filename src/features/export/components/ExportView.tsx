"use client";

import { useState } from "react";
import {
    Calendar,
    CalendarDays,
    Download,
    FileJson,
    ImageIcon,
    MonitorSmartphone,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type { GraphicExportType } from "@/features/shell/types/shell.types";
import { getExportCopy } from "../constants/export.constants";

interface ExportViewProps {
    lang: string;
    onExportPDF: () => void;
    onExportImage: (type: GraphicExportType) => void;
    onExportJSON: () => void;
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

    return (
        <div className="mx-auto max-w-3xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-slate-950">
                    {copy.title}
                </h2>

                <p className="mt-1 text-sm text-muted">{copy.subtitle}</p>
            </div>

            <section className="rounded-xl border border-sborder bg-white p-6">
                <div className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">
                            {copy.dateRange}
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setRange("week")}
                                className={`rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-slate-50 ${range === "week"
                                    ? "border-primary ring-2 ring-indigo-100"
                                    : "border-sborder"
                                    }`}
                            >
                                <CalendarDays size={18} className="mr-2 inline text-primary" />
                                {copy.week}
                            </button>

                            <button
                                onClick={() => setRange("month")}
                                className={`rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-slate-50 ${range === "month"
                                    ? "border-primary ring-2 ring-indigo-100"
                                    : "border-sborder"
                                    }`}
                            >
                                <Calendar size={18} className="mr-2 inline text-secondary" />
                                {copy.month}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                type="checkbox"
                                checked={includeCompleted}
                                onChange={(event) => setIncludeCompleted(event.target.checked)}
                                className="task-check"
                            />

                            <span className="text-sm text-slate-700">
                                {copy.includeCompleted}
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                type="checkbox"
                                checked={includeNotes}
                                onChange={(event) => setIncludeNotes(event.target.checked)}
                                className="task-check"
                            />

                            <span className="text-sm text-slate-700">
                                {copy.includeNotes}
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">
                            {copy.layoutStyle}
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setLayoutStyle("compact")}
                                className={`rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-slate-50 ${layoutStyle === "compact"
                                    ? "border-primary ring-2 ring-indigo-100"
                                    : "border-sborder"
                                    }`}
                            >
                                {copy.compact}
                            </button>

                            <button
                                onClick={() => setLayoutStyle("detailed")}
                                className={`rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-slate-50 ${layoutStyle === "detailed"
                                    ? "border-primary ring-2 ring-indigo-100"
                                    : "border-sborder"
                                    }`}
                            >
                                {copy.detailed}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <Button onClick={onExportPDF} className="w-full">
                            <Download size={16} />
                            {copy.generatePDF}
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => onExportImage("desktop")}
                            className="w-full"
                        >
                            <MonitorSmartphone size={16} />
                            {copy.desktopImage}
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => onExportImage("mobile")}
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
            </section>
        </div>
    );
}