"use client";

import { Globe2, Menu, Pencil, Plus } from "lucide-react";
import { ExportActions } from "@/features/export/components/ExportActions";
import { getShellCopy } from "../constants/shell.constants";
import type { AppView, GraphicExportType } from "../types/shell.types";

interface AppTopbarProps {
    username: string;
    activeView: AppView;
    lang: string;
    onToggleLanguage: () => void;
    onEditProfile: () => void;
    onCreateTask: () => void;
    onExportPDF: () => void;
    onExportImage: (type: GraphicExportType) => void;
    onExportJSON: () => void;
    onImportJSON: (file: File) => void;
}

export function AppTopbar({
    username,
    activeView,
    lang,
    onToggleLanguage,
    onEditProfile,
    onCreateTask,
    onExportPDF,
    onExportImage,
    onExportJSON,
    onImportJSON,
}: AppTopbarProps) {
    const copy = getShellCopy(lang);
    const title =
        activeView === "dashboard" ? copy.dashboard : copy.weeklyCalendar;

    return (
        <header className="no-print sticky top-0 z-40 border-b border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center gap-3">
                <button className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500 lg:hidden">
                    <Menu size={18} />
                </button>

                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        {copy.appName}
                    </p>

                    <h2 className="truncate text-xl font-black tracking-tight text-slate-950">
                        {title}
                    </h2>
                </div>

                <div className="ml-auto hidden items-center gap-2 md:flex">
                    <button
                        onClick={onToggleLanguage}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Globe2 size={16} />
                        {lang.toUpperCase()}
                    </button>

                    <ExportActions
                        lang={lang}
                        onExportPDF={onExportPDF}
                        onExportImage={onExportImage}
                        onExportJSON={onExportJSON}
                        onImportJSON={onImportJSON}
                    />
                </div>

                <button
                    onClick={onEditProfile}
                    className="hidden h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:flex"
                >
                    <Pencil size={16} />
                    {username}
                </button>

                <button
                    onClick={onCreateTask}
                    className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                    <Plus size={18} />
                </button>
            </div>
        </header>
    );
}