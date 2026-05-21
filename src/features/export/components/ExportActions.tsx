"use client";

import { useRef } from "react";
import {
    Download,
    FileJson,
    ImageIcon,
    MonitorSmartphone,
    Upload,
} from "lucide-react";
import type { GraphicExportType } from "@/features/shell/types/shell.types";
import { getExportCopy } from "../constants/export.constants";

interface ExportActionsProps {
    lang: string;
    onExportPDF: () => void;
    onExportImage: (type: GraphicExportType) => void;
    onExportJSON: () => void;
    onImportJSON: (file: File) => void;
}

export function ExportActions({
    lang,
    onExportPDF,
    onExportImage,
    onExportJSON,
    onImportJSON,
}: ExportActionsProps) {
    const copy = getExportCopy(lang);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-wrap items-center gap-2">
            <button
                onClick={onExportPDF}
                className="flex items-center gap-2 rounded-2xl bg-rose-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-rose-700"
            >
                <Download size={16} />
                {copy.pdf}
            </button>

            <button
                onClick={() => onExportImage("desktop")}
                className="flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
            >
                <MonitorSmartphone size={16} />
                {copy.desktop}
            </button>

            <button
                onClick={() => onExportImage("mobile")}
                className="flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
            >
                <ImageIcon size={16} />
                {copy.mobile}
            </button>

            <button
                onClick={onExportJSON}
                className="flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
            >
                <FileJson size={16} />
                {copy.backup}
            </button>

            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
            >
                <Upload size={16} />
                {copy.restore}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                        onImportJSON(file);
                    }

                    event.target.value = "";
                }}
            />
        </div>
    );
}