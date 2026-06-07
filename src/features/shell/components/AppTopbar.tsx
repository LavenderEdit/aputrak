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
        <header className="no-print flex h-16 shrink-0 items-center gap-3 border-b-[3px] border-black bg-[#FFFCF4] px-4">
            <button
                type="button"
                onClick={onToggleSidebar}
                className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-black shadow-[3px_3px_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 md:hidden"
                aria-label={lang === "es" ? "Abrir menú" : "Open menu"}
            >
                <Menu size={18} strokeWidth={3} />
            </button>

            <div className="min-w-0">
                <h1 className="font-display truncate text-xl font-black uppercase tracking-tight text-black">
                    {titleMap[activeView]}
                </h1>

                <p className="hidden text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 sm:block">
                    Aputrak
                </p>
            </div>

            <div className="flex-1" />

            <div className="hidden items-center gap-2 border-2 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-black sm:flex">
                <span className="h-2.5 w-2.5 border-2 border-black bg-emerald-500" />
                {copy.savedLocally}
            </div>

            <button
                type="button"
                onClick={onEditProfile}
                className="flex h-10 w-10 items-center justify-center border-2 border-black bg-black text-sm font-black uppercase text-white shadow-[3px_3px_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5"
                title={username}
                aria-label={lang === "es" ? "Editar perfil" : "Edit profile"}
            >
                {username.charAt(0).toUpperCase()}
            </button>
        </header>
    );
}