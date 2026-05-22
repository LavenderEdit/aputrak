"use client";

import { Menu } from "lucide-react";
import { getShellCopy } from "../constants/shell.constants";
import type { AppView, GraphicExportType } from "../types/shell.types";

interface AppTopbarProps {
    username: string;
    activeView: AppView;
    lang: string;
    onToggleSidebar: () => void;
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
    onToggleSidebar,
    onEditProfile,
}: AppTopbarProps) {
    const copy = getShellCopy(lang);

    const titleMap: Record<AppView, string> = {
        dashboard: copy.dashboard,
        calendar: copy.calendar,
        activities: copy.activities,
        tags: copy.tags,
        import: copy.import,
        export: copy.export,
        settings: copy.settings,
    };

    return (
        <header className="no-print flex h-14 shrink-0 items-center gap-3 border-b border-sborder bg-white px-4">
            <button
                onClick={onToggleSidebar}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-hover md:hidden"
            >
                <Menu size={18} />
            </button>

            <h1 className="font-display text-lg font-bold text-slate-950">
                {titleMap[activeView]}
            </h1>

            <div className="flex-1" />

            <div className="flex items-center gap-2 text-xs text-muted">
                <span className="status-dot bg-success" />
                <span className="hidden sm:inline">
                    {copy.savedLocally}
                </span>
            </div>

            <button
                onClick={onEditProfile}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-primary"
                title={username}
            >
                {username.charAt(0).toUpperCase()}
            </button>
        </header>
    );
}