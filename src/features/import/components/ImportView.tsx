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
    onImportImageItems: (items: ParsedScheduleItem[]) => Promise<void> | void;
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
        <div className="mx-auto max-w-4xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-slate-950">
                    {copy.title}
                </h2>

                <p className="mt-1 text-sm text-muted">{copy.subtitle}</p>
            </div>

            <div className="mb-6 grid gap-2 rounded-2xl bg-slate-100 p-1 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => setMode("json")}
                    className={cn(
                        "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                        mode === "json"
                            ? "bg-white text-primary shadow-sm"
                            : "text-muted hover:text-slate-900",
                    )}
                >
                    <FileJson size={16} />
                    JSON
                </button>

                <button
                    type="button"
                    onClick={() => setMode("image")}
                    className={cn(
                        "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                        mode === "image"
                            ? "bg-white text-primary shadow-sm"
                            : "text-muted hover:text-slate-900",
                    )}
                >
                    <ImagePlus size={16} />
                    OCR
                </button>
            </div>

            {mode === "image" && (
                <section className="rounded-xl border border-sborder bg-white p-6">
                    <SnapPlanImporter
                        lang={lang}
                        onConfirm={onImportImageItems}
                    />
                </section>
            )}

            {mode === "json" && step === "upload" && (
                <section className="rounded-xl border border-sborder bg-white p-6">
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
                        className={`drop-zone ${isDragging ? "dragover" : ""}`}
                    >
                        <CloudUpload size={48} className="mx-auto mb-4 text-primary" />

                        <p className="mb-1 text-sm font-semibold text-slate-900">
                            {copy.drop}
                        </p>

                        <p className="text-sm text-muted">{copy.browse}</p>

                        <p className="mt-3 text-xs text-muted">{copy.supported}</p>

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

                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                        <ShieldCheck size={16} />
                        {copy.privacy}
                    </div>
                </section>
            )}

            {mode === "json" && step === "review" && selectedFile && (
                <section className="rounded-xl border border-sborder bg-white p-6">
                    <h3 className="font-display mb-2 text-base font-bold text-slate-950">
                        {copy.reviewTitle}
                    </h3>

                    <p className="mb-5 text-sm text-muted">{copy.reviewNote}</p>

                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-sborder bg-slate-50 p-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                            <FileJson size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-950">
                                {selectedFile.name}
                            </p>

                            <p className="text-xs text-muted">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button variant="secondary" className="flex-1" onClick={reset}>
                            {copy.cancel}
                        </Button>

                        <Button className="flex-1" onClick={confirmImport}>
                            {copy.confirm}
                        </Button>
                    </div>
                </section>
            )}

            {mode === "json" && step === "done" && (
                <section className="rounded-xl border border-sborder bg-white p-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-success">
                        <CheckCircle2 size={30} />
                    </div>

                    <h3 className="font-display text-lg font-bold text-slate-950">
                        {copy.done}
                    </h3>

                    <p className="mt-1 text-sm text-muted">{copy.doneDesc}</p>

                    <Button className="mt-6" variant="secondary" onClick={reset}>
                        <RotateCcw size={16} />
                        {copy.importAnother}
                    </Button>
                </section>
            )}
        </div>
    );
}