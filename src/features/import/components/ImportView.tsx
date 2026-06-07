"use client";

import type { DragEvent, KeyboardEvent } from "react";
import { useRef, useState } from "react";
import {
    CheckCircle2,
    CloudUpload,
    FileJson,
    ImagePlus,
    RotateCcw,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/cn";
import { getImportCopy } from "../constants/import.constants";
import type { ParsedScheduleItem } from "../lib/scheduleParser";
import { SnapPlanImporter } from "./SnapPlanImporter";

interface ImportViewProps {
    lang: string;
    onImportJSON: (file: File) => Promise<void> | void;
    onImportImageItems: (
        items: ParsedScheduleItem[],
        detectedWeekId?: string | null,
    ) => Promise<void> | void;
}

type ImportMode = "json" | "image";

export function ImportView({
    lang,
    onImportJSON,
    onImportImageItems,
}: ImportViewProps) {
    const copy = getImportCopy(lang);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mode, setMode] = useState<ImportMode>("json");
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [step, setStep] = useState<"upload" | "review" | "done">("upload");

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFile = (file: File) => {
        setSelectedFile(file);
        setStep("review");
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];

        if (file) {
            handleFile(file);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFilePicker();
        }
    };

    const reset = () => {
        setSelectedFile(null);
        setStep("upload");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const confirmImport = async () => {
        if (!selectedFile) return;

        await onImportJSON(selectedFile);
        setStep("done");
    };

    return (
        <div className="mx-auto w-full max-w-5xl p-4 pb-28 fade-in sm:p-6 sm:pb-32 lg:p-8">
            <div className="mb-6 border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000]">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Aputrak
                </p>

                <h2 className="font-display text-3xl font-black uppercase tracking-tight text-black">
                    {copy.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-slate-600">
                    {copy.subtitle}
                </p>
            </div>

            <div className="mb-6 grid grid-cols-2 border-[3px] border-black bg-[#FFFCF4] shadow-[5px_5px_0_#000]">
                <button
                    type="button"
                    onClick={() => setMode("json")}
                    className={cn(
                        "flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] transition",
                        mode === "json"
                            ? "bg-black text-white"
                            : "bg-[#FFFCF4] text-black hover:bg-white",
                    )}
                >
                    <FileJson size={16} strokeWidth={3} />
                    JSON
                </button>

                <button
                    type="button"
                    onClick={() => setMode("image")}
                    className={cn(
                        "flex items-center justify-center gap-2 border-l-[3px] border-black px-4 py-3 text-xs font-black uppercase tracking-[0.12em] transition",
                        mode === "image"
                            ? "bg-black text-white"
                            : "bg-[#FFFCF4] text-black hover:bg-white",
                    )}
                >
                    <ImagePlus size={16} strokeWidth={3} />
                    OCR
                </button>
            </div>

            {mode === "image" && (
                <section className="border-[3px] border-black bg-[#FFFCF4] p-4 shadow-[6px_6px_0_#000] sm:p-6">
                    <SnapPlanImporter
                        lang={lang}
                        onConfirm={onImportImageItems}
                    />
                </section>
            )}

            {mode === "json" && step === "upload" && (
                <section className="border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000] sm:p-6">
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={openFilePicker}
                        onKeyDown={handleKeyDown}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "border-[3px] border-dashed border-black bg-white p-8 text-center transition",
                            isDragging
                                ? "translate-x-[-2px] translate-y-[-2px] shadow-[6px_6px_0_#000]"
                                : "hover:bg-[#F5F0E6]",
                        )}
                    >
                        <CloudUpload
                            size={48}
                            strokeWidth={3}
                            className="mx-auto mb-4 text-black"
                        />

                        <p className="mb-1 text-sm font-black uppercase tracking-[0.08em] text-black">
                            {copy.drop}
                        </p>

                        <p className="text-sm font-bold text-slate-600">
                            {copy.browse}
                        </p>

                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                            {copy.supported}
                        </p>

                        <Button className="mt-5" onClick={openFilePicker}>
                            {copy.chooseFile}
                        </Button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            className="hidden"
                            onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) {
                                    handleFile(file);
                                }
                            }}
                        />
                    </div>

                    <div className="mt-5 flex items-center gap-2 border-2 border-black bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.1em] text-black">
                        <ShieldCheck size={16} strokeWidth={3} />
                        {copy.privacy}
                    </div>
                </section>
            )}

            {mode === "json" && step === "review" && selectedFile && (
                <section className="border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000] sm:p-6">
                    <h3 className="font-display mb-2 text-xl font-black uppercase tracking-tight text-black">
                        {copy.reviewTitle}
                    </h3>

                    <p className="mb-5 text-sm font-bold text-slate-600">
                        {copy.reviewNote}
                    </p>

                    <div className="mb-5 flex items-center gap-3 border-2 border-black bg-white p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-[#F5F0E6]">
                            <FileJson size={23} strokeWidth={3} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black uppercase tracking-[0.05em] text-black">
                                {selectedFile.name}
                            </p>

                            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <Button variant="secondary" className="w-full" onClick={reset}>
                            {copy.cancel}
                        </Button>

                        <Button className="w-full" onClick={confirmImport}>
                            {copy.confirm}
                        </Button>
                    </div>
                </section>
            )}

            {mode === "json" && step === "done" && (
                <section className="border-[3px] border-black bg-[#FFFCF4] p-10 text-center shadow-[6px_6px_0_#000]">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border-[3px] border-black bg-emerald-100 shadow-[4px_4px_0_#000]">
                        <CheckCircle2 size={32} strokeWidth={3} />
                    </div>

                    <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black">
                        {copy.done}
                    </h3>

                    <p className="mt-2 text-sm font-bold text-slate-600">
                        {copy.doneDesc}
                    </p>

                    <Button className="mt-6" variant="secondary" onClick={reset}>
                        <RotateCcw size={16} />
                        {copy.importAnother}
                    </Button>
                </section>
            )}
        </div>
    );
}