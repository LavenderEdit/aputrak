"use client";

import type { ChangeEvent, DragEvent } from "react";
import { ImagePlus } from "lucide-react";
import { getImportCopy } from "../constants/import.constants";

interface SnapPlanDropzoneProps {
    lang: string;
    selectedFile: File | null;
    previewUrl: string | null;
    isProcessing: boolean;
    isDragging: boolean;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onDragOver: (event: DragEvent<HTMLDivElement>) => void;
    onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
    onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export function SnapPlanDropzone({
    lang,
    selectedFile,
    previewUrl,
    isProcessing,
    isDragging,
    onFileChange,
    onDragOver,
    onDragLeave,
    onDrop,
}: SnapPlanDropzoneProps) {
    const copy = getImportCopy(lang);

    return (
        <div className="space-y-4">
            <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                    {copy.imageScheduleLabel}
                </span>

                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`rounded-xl border-2 border-dashed p-5 text-center transition ${isDragging
                        ? "border-primary bg-indigo-50"
                        : "border-sborder bg-slate-50"
                        } ${isProcessing
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                        }`}
                >
                    <input
                        id="schedule-image-input"
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        disabled={isProcessing}
                        className="hidden"
                    />

                    <label
                        htmlFor="schedule-image-input"
                        className="block cursor-pointer"
                    >
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-primary">
                            <ImagePlus size={24} />
                        </div>

                        <p className="text-sm font-semibold text-slate-900">
                            {copy.imageDrop}
                        </p>

                        <p className="mt-1 text-sm text-muted">
                            {copy.imageBrowse}
                        </p>

                        {selectedFile && (
                            <p className="mt-3 text-xs font-medium text-primary">
                                {copy.selectedFile}: {selectedFile.name}
                            </p>
                        )}
                    </label>
                </div>
            </div>

            {previewUrl && (
                <div className="overflow-hidden rounded-xl border border-sborder bg-slate-50">
                    <img
                        src={previewUrl}
                        alt={copy.imageScheduleLabel}
                        className="max-h-[360px] w-full object-contain"
                    />
                </div>
            )}
        </div>
    );
}