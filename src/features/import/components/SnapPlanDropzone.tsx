"use client";

import Image from "next/image";
import type { ChangeEvent, DragEvent } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
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
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black">
                    {copy.imageScheduleLabel}
                </span>

                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={cn(
                        "border-[3px] border-dashed border-black bg-white p-5 text-center transition sm:p-6",
                        isDragging &&
                        "translate-x-[-2px] translate-y-[-2px] bg-[#F5F0E6] shadow-[6px_6px_0_#000]",
                        isProcessing
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer hover:bg-[#F5F0E6]",
                    )}
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
                        className={cn(
                            "block",
                            isProcessing ? "cursor-not-allowed" : "cursor-pointer",
                        )}
                    >
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-[3px] border-black bg-[#FFFCF4] shadow-[4px_4px_0_#000]">
                            <ImagePlus size={25} strokeWidth={3} />
                        </div>

                        <p className="text-sm font-black uppercase tracking-[0.08em] text-black">
                            {copy.imageDrop}
                        </p>

                        <p className="mt-2 text-xs font-bold text-slate-600 sm:text-sm">
                            {copy.imageBrowse}
                        </p>

                        {selectedFile && (
                            <p className="mx-auto mt-4 max-w-full truncate border-2 border-black bg-[#FFFCF4] px-3 py-2 text-xs font-black uppercase tracking-[0.06em] text-black">
                                {copy.selectedFile}: {selectedFile.name}
                            </p>
                        )}
                    </label>
                </div>
            </div>

            {previewUrl && (
                <div className="relative h-[220px] overflow-hidden border-[3px] border-black bg-white shadow-[5px_5px_0_#000] sm:h-[300px] lg:h-[360px]">
                    <Image
                        src={previewUrl}
                        alt={copy.imageScheduleLabel}
                        fill
                        unoptimized
                        className="object-contain p-3"
                    />
                </div>
            )}
        </div>
    );
}