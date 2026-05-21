"use client";

import { useState } from "react";
import { Utils } from "@/shared/lib/utils";
import type { ScheduleTask } from "@/features/schedule/types/schedule.types";
import type { ToastType } from "@/shared/hooks/useToast";

interface Profile {
    username: string;
}

interface ScheduleData {
    weekId: string;
    settings: unknown;
    tasks: ScheduleTask[];
}

interface UseScheduleExportParams {
    profile: Profile | null;
    scheduleData: ScheduleData;
    t: (key: any) => string;
    showToast: (message: string, type?: ToastType) => void;
}

function loadHtmlToImage() {
    return new Promise<void>((resolve, reject) => {
        if ((window as any).htmlToImage) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js";
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function resetExportDom() {
    document.body.classList.remove("pdf-export-mode");

    const containerWrapper = document.getElementById("schedule-container-wrapper");
    const element = document.getElementById("schedule-container");

    if (containerWrapper) containerWrapper.style.overflow = "";
    if (element) {
        element.style.width = "";
        element.style.padding = "";
    }
}

export function useScheduleExport({
    profile,
    scheduleData,
    t,
    showToast,
}: UseScheduleExportParams) {
    const [exportLoading, setExportLoading] = useState(false);

    const handleGraphicExport = async (type: "pdf" | "desktop" | "mobile") => {
        try {
            setExportLoading(true);

            if (type === "pdf") {
                await Utils.loadExportScripts();
            }

            await loadHtmlToImage();

            const containerWrapper = document.getElementById(
                "schedule-container-wrapper",
            );
            const element = document.getElementById("schedule-container");

            if (!containerWrapper || !element) {
                throw new Error("Schedule container not found");
            }

            document.body.classList.add("pdf-export-mode");

            const originalOverflow = containerWrapper.style.overflow;
            containerWrapper.style.overflow = "visible";
            element.style.width = "max-content";
            element.style.padding = "32px";

            await new Promise((resolve) => window.setTimeout(resolve, 200));

            const canvas = await (window as any).htmlToImage.toCanvas(element, {
                pixelRatio: 2,
                backgroundColor: "#ffffff",
            });

            containerWrapper.style.overflow = originalOverflow;
            element.style.width = "";
            element.style.padding = "";
            document.body.classList.remove("pdf-export-mode");

            const filename = `ApuTrak_${profile?.username ?? "usuario"}_${scheduleData.weekId}`;

            if (type === "pdf") {
                const orientation = canvas.width > canvas.height ? "landscape" : "portrait";

                const pdf = new (window as any).jspdf.jsPDF({
                    orientation,
                    unit: "px",
                    format: [canvas.width, canvas.height],
                });

                pdf.addImage(
                    canvas.toDataURL("image/jpeg", 0.98),
                    "JPEG",
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );

                pdf.save(`${filename}.pdf`);
            } else {
                const targetWidth = type === "desktop" ? 1920 : 1080;
                const targetHeight = type === "desktop" ? 1080 : 1920;

                const finalCanvas = document.createElement("canvas");
                finalCanvas.width = targetWidth;
                finalCanvas.height = targetHeight;

                const ctx = finalCanvas.getContext("2d");

                if (!ctx) {
                    throw new Error("Canvas context not available");
                }

                ctx.fillStyle = "#1e293b";
                ctx.fillRect(0, 0, targetWidth, targetHeight);

                const padding = 80;
                const availableWidth = targetWidth - padding * 2;
                const availableHeight = targetHeight - padding * 2;
                const scale = Math.min(
                    availableWidth / canvas.width,
                    availableHeight / canvas.height,
                    1,
                );

                const drawWidth = canvas.width * scale;
                const drawHeight = canvas.height * scale;
                const x = (targetWidth - drawWidth) / 2;
                const y = (targetHeight - drawHeight) / 2;

                ctx.shadowColor = "rgba(0,0,0,0.5)";
                ctx.shadowBlur = 30;
                ctx.shadowOffsetY = 15;
                ctx.drawImage(canvas, x, y, drawWidth, drawHeight);

                const link = document.createElement("a");
                link.download = `${filename}_${type}.png`;
                link.href = finalCanvas.toDataURL("image/png", 1);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            showToast(t("exportSuccess"));
        } catch (error) {
            console.error(error);
            resetExportDom();
            showToast(t("exportError"), "error");
        } finally {
            setExportLoading(false);
        }
    };

    const handleExportJSON = async () => {
        try {
            setExportLoading(true);

            const backupData = {
                version: 2,
                username: profile?.username,
                exportDate: new Date().toISOString(),
                weekId: scheduleData.weekId,
                settings: scheduleData.settings,
                tasks: scheduleData.tasks,
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], {
                type: "application/json",
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `ApuTrak_Respaldo_${profile?.username ?? "usuario"}_${scheduleData.weekId}.json`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            showToast(t("backupSuccess"));
        } catch (error) {
            console.error(error);
            showToast(t("backupError"), "error");
        } finally {
            setExportLoading(false);
        }
    };

    return {
        exportLoading,
        handleGraphicExport,
        handleExportJSON,
    };
}