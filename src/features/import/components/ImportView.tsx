"use client";

import type { DragEvent } from "react";
import { useRef, useState } from "react";
import { CheckCircle2, CloudUpload, FileJson, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";

interface ImportViewProps {
    lang: string;
    onImportJSON: (file: File) => Promise<void> | void;
}

export function ImportView({ lang, onImportJSON }: ImportViewProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [step, setStep] = useState<"upload" | "review" | "done">("upload");

    const copy = {
        title: lang === "es" ? "Importar Horario" : "Import Schedule",
        subtitle:
            lang === "es"
                ? "Trae respaldos externos a Aputrak."
                : "Bring external backups into Aputrak.",
        drop:
            lang === "es"
                ? "Arrastra un respaldo aquí o haz clic para buscar"
                : "Drop a backup here or click to browse",
        supported:
            lang === "es"
                ? "Soportado por ahora: archivos JSON de respaldo"
                : "Currently supported: JSON backup files",
        reviewTitle:
            lang === "es" ? "Revisar archivo seleccionado" : "Review selected file",
        reviewNote:
            lang === "es"
                ? "Confirma que este es el respaldo correcto antes de importarlo."
                : "Confirm this is the correct backup before importing.",
        cancel: lang === "es" ? "Cancelar" : "Cancel",
        confirm: lang === "es" ? "Confirmar Importación" : "Confirm Import",
        done: lang === "es" ? "Importación completada" : "Import completed",
        importAnother: lang === "es" ? "Importar otro archivo" : "Import another file",
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
        <div className="mx-auto max-w-3xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-slate-950">
                    {copy.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
            </div>

            {step === "upload" && (
                <Card className="rounded-2xl p-6">
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${isDragging
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                            }`}
                    >
                        <CloudUpload
                            size={46}
                            className="mx-auto mb-4 text-slate-400"
                        />

                        <p className="mb-1 text-sm font-semibold text-slate-800">
                            {copy.drop}
                        </p>

                        <p className="text-xs text-slate-500">{copy.supported}</p>

                        <Button className="mt-5">
                            {lang === "es" ? "Importar" : "Import"}
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
                </Card>
            )}

            {step === "review" && selectedFile && (
                <Card className="rounded-2xl p-6">
                    <h3 className="font-display mb-2 text-base font-bold text-slate-950">
                        {copy.reviewTitle}
                    </h3>

                    <p className="mb-5 text-xs text-slate-500">{copy.reviewNote}</p>

                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <FileJson size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {selectedFile.name}
                            </p>

                            <p className="text-xs text-slate-500">
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
                </Card>
            )}

            {step === "done" && (
                <Card className="rounded-2xl p-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CheckCircle2 size={30} />
                    </div>

                    <h3 className="font-display text-lg font-bold text-slate-950">
                        {copy.done}
                    </h3>

                    <Button className="mt-6" variant="secondary" onClick={reset}>
                        <RotateCcw size={16} />
                        {copy.importAnother}
                    </Button>
                </Card>
            )}
        </div>
    );
}