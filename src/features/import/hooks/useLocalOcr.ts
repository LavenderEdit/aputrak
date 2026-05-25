"use client";

import { useState } from "react";
import { getImportCopy } from "../constants/import.constants";
import { recognizeImage, type OcrProgress } from "../lib/ocr";
import { extractWeekIdFromScheduleText } from "../lib/schedule-week-parser";

type OcrStatus = "idle" | "processing" | "success" | "error";

export function useLocalOcr(lang: string) {
    const copy = getImportCopy(lang);

    const [status, setStatus] = useState<OcrStatus>("idle");
    const [text, setText] = useState("");
    const [progress, setProgress] = useState<OcrProgress | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [detectedWeekId, setDetectedWeekId] = useState<string | null>(null);

    const processImage = async (file: File) => {
        setStatus("processing");
        setText("");
        setError(null);
        setProgress(null);
        setDetectedWeekId(null);

        try {
            const result = await recognizeImage(file, setProgress);

            if (!result.trim()) {
                setStatus("error");
                setError(copy.ocrEmptyText);
                return;
            }

            setText(result);
            setDetectedWeekId(extractWeekIdFromScheduleText(result));
            setStatus("success");
        } catch (err) {
            setStatus("error");
            setError(copy.ocrProcessError);
            console.error(err);
        }
    };

    const reset = () => {
        setStatus("idle");
        setText("");
        setProgress(null);
        setError(null);
        setDetectedWeekId(null);
    };

    return {
        status,
        text,
        setText,
        progress,
        error,
        detectedWeekId,
        processImage,
        reset,
        isProcessing: status === "processing",
    };
}