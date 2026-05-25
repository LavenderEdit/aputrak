"use client";

import Image from "next/image";
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
                    className={`rounded-xl border-2 border-dashed p-4 text-center transition sm:p-5 ${isDragging
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
                        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-primary sm:h-12 sm:w-12">
                            <ImagePlus size={22} />
                        </div>

                        <p className="text-sm font-semibold text-slate-900">
                            {copy.imageDrop}
                        </p>

                        <p className="mt-1 text-xs text-muted sm:text-sm">
                            {copy.imageBrowse}
                        </p>

                        {selectedFile && (
                            <p className="mx-auto mt-3 max-w-full truncate text-xs font-medium text-primary">
                                {copy.selectedFile}: {selectedFile.name}
                            </p>
                        )}
                    </label>
                </div>
            </div>

            {previewUrl && (
                <div className="relative h-[220px] overflow-hidden rounded-xl border border-sborder bg-slate-50 sm:h-[300px] lg:h-[360px]">
                    <Image
                        src={previewUrl}
                        alt={copy.imageScheduleLabel}
                        fill
                        unoptimized
                        className="object-contain"
                    />
                </div>
            )}
        </div>
    );
}