"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { useLocalOcr } from "../hooks/useLocalOcr";
import {
    parseScheduleText,
    type ParsedScheduleItem,
} from "../lib/scheduleParser";
import { getImportCopy } from "../constants/import.constants";
import { SnapPlanDropzone } from "./SnapPlanDropzone";
import { SnapPlanDetectedTable } from "./SnapPlanDetectedTable";
import { formatDetectedWeek } from "../lib/schedule-week-parser";

interface SnapPlanImporterProps {
    lang: string;
    onConfirm?: (
        items: ParsedScheduleItem[],
        detectedWeekId?: string | null,
    ) => void | Promise<void>;
}

export function SnapPlanImporter({ lang, onConfirm }: SnapPlanImporterProps) {
    const copy = getImportCopy(lang);

    const {
        status,
        text,
        setText,
        progress,
        error,
        processImage,
        reset,
        isProcessing,
        detectedWeekId,
    } = useLocalOcr(lang);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [items, setItems] = useState<ParsedScheduleItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [parseMessage, setParseMessage] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const previewUrl = useMemo(() => {
        if (!selectedFile) return null;

        return URL.createObjectURL(selectedFile);
    }, [selectedFile]);

    const progressPercent = useMemo(() => {
        return progress ? Math.round((progress.progress || 0) * 100) : 0;
    }, [progress]);

    const detectedWeekLabel = detectedWeekId
        ? formatDetectedWeek(detectedWeekId, lang)
        : null;

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const clearParsedResults = () => {
        setItems([]);
        setParseMessage(null);
    };

    const handleSelectedFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setFileError(copy.invalidImage);
            return;
        }

        setFileError(null);
        setSelectedFile(file);
        clearParsedResults();
        reset();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        handleSelectedFile(file);
    };

    const handleProcessImage = async () => {
        if (!selectedFile) return;

        clearParsedResults();
        await processImage(selectedFile);
    };

    const handleParseText = () => {
        const parsedItems = parseScheduleText(text);

        setItems(parsedItems);

        if (parsedItems.length === 0) {
            setParseMessage(copy.noDetectedActivities);
            return;
        }

        setParseMessage(`${parsedItems.length} ${copy.detectedActivitiesMessage}`);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (!isProcessing) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        if (isProcessing) return;

        const file = event.dataTransfer.files?.[0];

        if (!file) return;

        handleSelectedFile(file);
    };

    const updateItem = (id: string, patch: Partial<ParsedScheduleItem>) => {
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id ? { ...item, ...patch } : item,
            ),
        );
    };

    const removeItem = (id: string) => {
        setItems((currentItems) =>
            currentItems.filter((item) => item.id !== id),
        );
    };

    const handleConfirm = async () => {
        if (!onConfirm || items.length === 0) return;

        try {
            setIsSaving(true);
            await onConfirm(items, detectedWeekId);
            setSelectedFile(null);
            setItems([]);
            setParseMessage(null);
            reset();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="space-y-5">
            <header>
                <h2 className="font-display text-xl font-bold text-slate-950">
                    {copy.imageImportTitle}
                </h2>

                <p className="mt-1 text-sm text-muted">{copy.imageImportSubtitle}</p>

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <div className="flex gap-2">
                        <AlertTriangle size={17} className="mt-0.5 shrink-0" />

                        <div>
                            <p className="font-semibold">{copy.imageImportWarningTitle}</p>
                            <p className="mt-1">{copy.imageImportWarningDescription}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-4">
                    <SnapPlanDropzone
                        lang={lang}
                        selectedFile={selectedFile}
                        previewUrl={previewUrl}
                        isProcessing={isProcessing}
                        isDragging={isDragging}
                        onFileChange={handleFileChange}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    />

                    <Button
                        type="button"
                        className="w-full"
                        disabled={!selectedFile || isProcessing}
                        onClick={handleProcessImage}
                    >
                        {isProcessing ? copy.processingImage : copy.processImage}
                    </Button>

                    {isProcessing && (
                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="mb-2 flex justify-between text-xs text-muted">
                                <span>{progress?.status || copy.preparingOcr}</span>
                                <span>{progressPercent}%</span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {(fileError || error) && (
                        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
                            {fileError || error}
                        </p>
                    )}

                    {status === "success" && (
                        <div className="rounded-xl border border-sborder bg-white px-4 py-3 text-sm">
                            <p className="font-semibold text-slate-900">
                                {copy.detectedWeek}
                            </p>

                            <p className="mt-1 text-muted">
                                {detectedWeekLabel ?? copy.noDetectedWeek}
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <details className="rounded-xl border border-sborder bg-slate-50 p-4">
                        <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                            {copy.detectedTextSummary}
                        </summary>

                        <textarea
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            placeholder={copy.detectedTextPlaceholder}
                            rows={8}
                            className="mt-3 w-full resize-none rounded-xl border border-sborder bg-white p-3 text-sm text-slate-800 outline-none transition focus:border-primary"
                        />
                    </details>

                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        disabled={!text.trim()}
                        onClick={handleParseText}
                    >
                        {copy.detectActivities}
                    </Button>

                    {parseMessage && (
                        <p
                            className={`rounded-xl px-3 py-2 text-sm ${items.length > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                                }`}
                        >
                            {parseMessage}
                        </p>
                    )}

                    {status === "success" && !items.length && (
                        <p className="text-sm text-muted">{copy.reviewDetectedText}</p>
                    )}
                </div>
            </div>

            <SnapPlanDetectedTable
                lang={lang}
                items={items}
                isSaving={isSaving}
                canConfirm={Boolean(onConfirm)}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
                onConfirm={handleConfirm}
            />
        </section>
    );
}