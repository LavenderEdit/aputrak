"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Utils } from "@/shared/lib/utils";
import type {
    ScheduleSettings,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";
import type { PromiseToastMessages } from "@/shared/hooks/useToast";
import { getToastCopy } from "@/shared/constants/toast.constants";

interface Profile {
    username: string;
}

interface ScheduleData {
    weekId: string;
    settings: ScheduleSettings;
    tasks: ScheduleTask[];
    getTasksForWeek?: (weekId: string) => Promise<ScheduleTask[]>;
}

interface UseScheduleExportParams {
    lang: string;
    profile: Profile | null;
    scheduleData: ScheduleData;
    showPromiseToast: <T>(
        promise: Promise<T>,
        messages: PromiseToastMessages<T>,
    ) => Promise<T>;
}

export interface ExportOptions {
    range: "week" | "month";
    includeCompleted: boolean;
    includeNotes: boolean;
    layoutStyle: "compact" | "detailed";
}

const DAY_LABELS_ES = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

const DAY_LABELS_EN = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

function getDateFromWeekId(weekId: string) {
    return new Date(`${weekId}T00:00:00`);
}

function formatDate(date: Date, lang: string) {
    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTimeFromMinutes(minutes: number) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

    return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function getWeekDates(weekId: string) {
    const start = getDateFromWeekId(weekId);

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return date;
    });
}

function getMonthWeekIds(weekId: string) {
    const baseDate = getDateFromWeekId(weekId);
    const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const monthEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

    const cursor = new Date(monthStart);
    cursor.setDate(cursor.getDate() - ((cursor.getDay() || 7) - 1));

    const weekIds = new Set<string>();

    while (cursor <= monthEnd || cursor.getDay() !== 1) {
        weekIds.add(Utils.getWeekStartIdentifier(cursor));
        cursor.setDate(cursor.getDate() + 7);

        if (weekIds.size > 8) break;
    }

    return Array.from(weekIds);
}

function sanitizeFilename(value: string) {
    return value
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "");
}

function createExportRoot(width: number) {
    const root = document.createElement("div");

    root.style.position = "fixed";
    root.style.left = "-10000px";
    root.style.top = "0";
    root.style.width = `${width}px`;
    root.style.background = "#ffffff";
    root.style.zIndex = "-1";

    document.body.appendChild(root);

    return root;
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderTask(task: ScheduleTask, options: ExportOptions) {
    const lines = task.text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const title = lines[0] ?? "Untitled";
    const notes = lines.slice(1);

    const completed =
        lines.length > 0 && lines.every((_, index) => task.completed[index]);

    if (completed && !options.includeCompleted) {
        return "";
    }

    const opacity = completed ? "0.55" : "1";

    return `
        <div style="
            margin-bottom: 8px;
            border-left: 4px solid #6366F1;
            border-radius: 12px;
            background: #EEF2FF;
            padding: 10px 12px;
            opacity: ${opacity};
        ">
            <div style="
                font-size: 13px;
                font-weight: 800;
                color: #312E81;
                line-height: 1.35;
            ">
                ${escapeHtml(title)}
            </div>

            <div style="
                margin-top: 4px;
                font-size: 11px;
                font-weight: 700;
                color: #475569;
            ">
                ${formatTimeFromMinutes(task.startMinute)} - ${formatTimeFromMinutes(task.endMinute)}
            </div>

            ${options.includeNotes && notes.length > 0
            ? `<div style="
                        margin-top: 6px;
                        font-size: 11px;
                        color: #475569;
                        line-height: 1.45;
                        white-space: pre-wrap;
                    ">${escapeHtml(notes.join("\n"))}</div>`
            : ""
        }
        </div>
    `;
}

function renderWeekExport({
    lang,
    weekId,
    tasks,
    username,
    options,
}: {
    lang: string;
    weekId: string;
    tasks: ScheduleTask[];
    username: string;
    options: ExportOptions;
}) {
    const days = lang === "es" ? DAY_LABELS_ES : DAY_LABELS_EN;
    const weekDates = getWeekDates(weekId);
    const start = weekDates[0];
    const end = weekDates[6];

    const dayColumns = days
        .map((day, index) => {
            const dayTasks = tasks
                .filter((task) => task.day === index)
                .sort((a, b) => a.startMinute - b.startMinute);

            return `
                <div style="
                    min-height: 420px;
                    border: 1px solid #E2E8F0;
                    background: #F8FAFC;
                    border-radius: 16px;
                    padding: 12px;
                ">
                    <div style="
                        margin-bottom: 12px;
                        border-bottom: 1px solid #E2E8F0;
                        padding-bottom: 8px;
                    ">
                        <div style="font-size: 14px; font-weight: 900; color: #0F172A;">
                            ${day}
                        </div>
                        <div style="font-size: 11px; color: #64748B;">
                            ${formatDate(weekDates[index], lang)}
                        </div>
                    </div>

                    ${dayTasks.map((task) => renderTask(task, options)).join("")}
                </div>
            `;
        })
        .join("");

    return `
        <div style="
            width: 1200px;
            background: #FFFFFF;
            color: #0F172A;
            font-family: Inter, Arial, sans-serif;
            padding: 36px;
        ">
            <div style="
                margin-bottom: 28px;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 24px;
            ">
                <div>
                    <div style="
                        color: #6366F1;
                        font-size: 13px;
                        font-weight: 900;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                    ">
                        Aputrak
                    </div>

                    <h1 style="
                        margin: 6px 0 0;
                        font-size: 32px;
                        line-height: 1.1;
                        font-weight: 950;
                    ">
                        ${lang === "es" ? "Horario semanal" : "Weekly schedule"}
                    </h1>

                    <p style="
                        margin: 8px 0 0;
                        color: #64748B;
                        font-size: 14px;
                    ">
                        ${formatDate(start, lang)} - ${formatDate(end, lang)}
                    </p>
                </div>

                <div style="
                    text-align: right;
                    color: #475569;
                    font-size: 13px;
                    font-weight: 700;
                ">
                    ${escapeHtml(username)}
                </div>
            </div>

            <div style="
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 10px;
            ">
                ${dayColumns}
            </div>
        </div>
    `;
}

function renderMonthExport({
    lang,
    weekGroups,
    username,
    options,
}: {
    lang: string;
    weekGroups: Array<{
        weekId: string;
        tasks: ScheduleTask[];
    }>;
    username: string;
    options: ExportOptions;
}) {
    const days = lang === "es" ? DAY_LABELS_ES : DAY_LABELS_EN;

    const sections = weekGroups
        .map(({ weekId, tasks }) => {
            const weekDates = getWeekDates(weekId);

            const dayRows = days
                .map((day, dayIndex) => {
                    const dayTasks = tasks
                        .filter((task) => task.day === dayIndex)
                        .sort((a, b) => a.startMinute - b.startMinute);

                    if (dayTasks.length === 0) return "";

                    return `
                        <div style="
                            display: grid;
                            grid-template-columns: 150px 1fr;
                            gap: 16px;
                            border-top: 1px solid #E2E8F0;
                            padding: 14px 0;
                        ">
                            <div>
                                <div style="font-size: 14px; font-weight: 900; color: #0F172A;">
                                    ${day}
                                </div>
                                <div style="font-size: 11px; color: #64748B;">
                                    ${formatDate(weekDates[dayIndex], lang)}
                                </div>
                            </div>

                            <div>
                                ${dayTasks.map((task) => renderTask(task, options)).join("")}
                            </div>
                        </div>
                    `;
                })
                .join("");

            if (!dayRows.trim()) return "";

            return `
                <section style="
                    margin-top: 24px;
                    border: 1px solid #E2E8F0;
                    border-radius: 18px;
                    padding: 18px;
                    background: #FFFFFF;
                ">
                    <h2 style="
                        margin: 0 0 8px;
                        font-size: 18px;
                        font-weight: 950;
                        color: #0F172A;
                    ">
                        ${lang === "es" ? "Semana de" : "Week of"} ${formatDate(weekDates[0], lang)}
                    </h2>

                    ${dayRows}
                </section>
            `;
        })
        .join("");

    return `
        <div style="
            width: 1200px;
            background: #F8FAFC;
            color: #0F172A;
            font-family: Inter, Arial, sans-serif;
            padding: 36px;
        ">
            <div style="
                border-radius: 22px;
                background: #FFFFFF;
                padding: 28px;
                border: 1px solid #E2E8F0;
            ">
                <div style="
                    color: #6366F1;
                    font-size: 13px;
                    font-weight: 900;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                ">
                    Aputrak
                </div>

                <h1 style="
                    margin: 6px 0 0;
                    font-size: 32px;
                    line-height: 1.1;
                    font-weight: 950;
                ">
                    ${lang === "es" ? "Resumen mensual" : "Monthly summary"}
                </h1>

                <p style="
                    margin: 8px 0 0;
                    color: #64748B;
                    font-size: 14px;
                ">
                    ${escapeHtml(username)}
                </p>
            </div>

            ${sections || `
                <div style="
                    margin-top: 24px;
                    border-radius: 18px;
                    background: #FFFFFF;
                    border: 1px solid #E2E8F0;
                    padding: 24px;
                    color: #64748B;
                    font-size: 14px;
                ">
                    ${lang === "es" ? "No hay actividades para exportar." : "No activities to export."}
                </div>
            `}
        </div>
    `;
}

function renderDesktopImageExport({
    lang,
    username,
    options,
    weekId,
    weekGroups,
}: {
    lang: string;
    username: string;
    options: ExportOptions;
    weekId: string;
    weekGroups: Array<{
        weekId: string;
        tasks: ScheduleTask[];
    }>;
}) {
    const monthLabel = getMonthLabelFromWeekId(weekId, lang);

    const totalTasks = weekGroups.reduce(
        (acc, item) => acc + getActiveTaskCount(item.tasks, options.includeCompleted),
        0,
    );

    const totalWeeks = weekGroups.filter((item) => item.tasks.length > 0).length;

    const sections = weekGroups
        .map(({ weekId: currentWeekId, tasks }) => {
            const weekDates = getWeekDates(currentWeekId);
            const days = lang === "es" ? DAY_LABELS_ES : DAY_LABELS_EN;

            const rows = days
                .map((day, dayIndex) => {
                    const dayTasks = tasks
                        .filter((task) => task.day === dayIndex)
                        .sort((a, b) => a.startMinute - b.startMinute);

                    if (dayTasks.length === 0) return "";

                    return `
                        <div style="
                            display: grid;
                            grid-template-columns: 190px 1fr;
                            gap: 24px;
                            padding: 18px 0;
                            border-top: 1px solid #E2E8F0;
                        ">
                            <div>
                                <div style="
                                    font-size: 18px;
                                    font-weight: 900;
                                    color: #0F172A;
                                ">
                                    ${escapeHtml(day)}
                                </div>

                                <div style="
                                    margin-top: 4px;
                                    font-size: 13px;
                                    color: #64748B;
                                    font-weight: 600;
                                ">
                                    ${formatDate(weekDates[dayIndex], lang)}
                                </div>
                            </div>

                            <div>
                                ${dayTasks.map((task) => renderTask(task, options)).join("")}
                            </div>
                        </div>
                    `;
                })
                .join("");

            if (!rows.trim()) return "";

            return `
                <section style="
                    margin-top: 22px;
                    border: 1px solid #E2E8F0;
                    border-radius: 24px;
                    background: #FFFFFF;
                    padding: 24px;
                    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 18px;
                        margin-bottom: 8px;
                    ">
                        <h2 style="
                            margin: 0;
                            font-size: 24px;
                            font-weight: 950;
                            color: #0F172A;
                        ">
                            ${lang === "es" ? "Semana de" : "Week of"} ${formatDate(weekDates[0], lang)}
                        </h2>

                        <div style="
                            font-size: 13px;
                            color: #64748B;
                            font-weight: 700;
                        ">
                            ${getActiveTaskCount(tasks, options.includeCompleted)}
                            ${lang === "es" ? "actividades" : "activities"}
                        </div>
                    </div>

                    ${rows}
                </section>
            `;
        })
        .join("");

    return `
        <div style="
            width: 1640px;
            min-height: 920px;
            background:
                radial-gradient(circle at top right, rgba(99,102,241,0.18), transparent 25%),
                linear-gradient(180deg, #0B1736 0%, #101E46 100%);
            padding: 58px;
            font-family: Inter, Arial, sans-serif;
        ">
            <div style="
                max-width: 1524px;
                margin: 0 auto;
                border-radius: 32px;
                background: #F8FAFC;
                border: 1px solid rgba(255,255,255,0.08);
                padding: 34px;
                box-shadow: 0 28px 80px rgba(0,0,0,0.28);
            ">
                <div style="
                    border-radius: 28px;
                    background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
                    border: 1px solid #E2E8F0;
                    padding: 28px 30px;
                ">
                    <div style="
                        font-size: 13px;
                        font-weight: 900;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        color: #6366F1;
                    ">
                        Aputrak
                    </div>

                    <div style="
                        display: flex;
                        align-items: flex-end;
                        justify-content: space-between;
                        gap: 24px;
                        margin-top: 8px;
                    ">
                        <div>
                            <h1 style="
                                margin: 0;
                                font-size: 46px;
                                line-height: 1.04;
                                font-weight: 950;
                                color: #0F172A;
                            ">
                                ${options.range === "month"
            ? lang === "es"
                ? "Resumen mensual"
                : "Monthly summary"
            : lang === "es"
                ? "Horario semanal"
                : "Weekly schedule"
        }
                            </h1>

                            <p style="
                                margin: 10px 0 0;
                                font-size: 16px;
                                color: #64748B;
                                font-weight: 600;
                                text-transform: capitalize;
                            ">
                                ${escapeHtml(monthLabel)}
                            </p>
                        </div>

                        <div style="
                            text-align: right;
                            font-size: 15px;
                            font-weight: 700;
                            color: #475569;
                        ">
                            ${escapeHtml(username)}
                        </div>
                    </div>
                </div>

                <div style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-top: 20px;
                ">
                    ${renderStatCard(lang === "es" ? "Periodo" : "Period", monthLabel)}
                    ${renderStatCard(lang === "es" ? "Semanas" : "Weeks", String(totalWeeks))}
                    ${renderStatCard(lang === "es" ? "Actividades" : "Activities", String(totalTasks))}
                </div>

                ${sections ||
        `
                    <div style="
                        margin-top: 22px;
                        border-radius: 24px;
                        background: #FFFFFF;
                        border: 1px solid #E2E8F0;
                        padding: 28px;
                        color: #64748B;
                        font-size: 15px;
                    ">
                        ${lang === "es" ? "No hay actividades para exportar." : "No activities to export."}
                    </div>
                `
        }
            </div>
        </div>
    `;
}

function renderMobileImageExport({
    lang,
    username,
    options,
    weekId,
    weekGroups,
}: {
    lang: string;
    username: string;
    options: ExportOptions;
    weekId: string;
    weekGroups: Array<{
        weekId: string;
        tasks: ScheduleTask[];
    }>;
}) {
    const monthLabel = getMonthLabelFromWeekId(weekId, lang);

    const totalTasks = weekGroups.reduce(
        (acc, item) => acc + getActiveTaskCount(item.tasks, options.includeCompleted),
        0,
    );

    const sections = weekGroups
        .map(({ weekId: currentWeekId, tasks }) => {
            const weekDates = getWeekDates(currentWeekId);
            const days = lang === "es" ? DAY_LABELS_ES : DAY_LABELS_EN;

            const cards = days
                .map((day, dayIndex) => {
                    const dayTasks = tasks
                        .filter((task) => task.day === dayIndex)
                        .sort((a, b) => a.startMinute - b.startMinute);

                    if (dayTasks.length === 0) return "";

                    return `
                        <div style="
                            margin-top: 14px;
                            border-radius: 24px;
                            border: 1px solid #E2E8F0;
                            background: #FFFFFF;
                            padding: 20px;
                            box-shadow: 0 16px 34px rgba(15, 23, 42, 0.06);
                        ">
                            <div style="
                                display: flex;
                                align-items: flex-start;
                                justify-content: space-between;
                                gap: 16px;
                            ">
                                <div>
                                    <div style="
                                        font-size: 23px;
                                        font-weight: 950;
                                        color: #0F172A;
                                        line-height: 1.1;
                                    ">
                                        ${escapeHtml(day)}
                                    </div>

                                    <div style="
                                        margin-top: 6px;
                                        font-size: 14px;
                                        color: #64748B;
                                        font-weight: 800;
                                    ">
                                        ${formatDate(weekDates[dayIndex], lang)}
                                    </div>
                                </div>

                                <div style="
                                    border-radius: 999px;
                                    background: #EEF2FF;
                                    color: #4F46E5;
                                    font-size: 12px;
                                    font-weight: 900;
                                    padding: 7px 10px;
                                ">
                                    ${dayTasks.length}
                                </div>
                            </div>

                            <div style="margin-top: 14px;">
                                ${dayTasks.map((task) => renderTask(task, options)).join("")}
                            </div>
                        </div>
                    `;
                })
                .join("");

            if (!cards.trim()) return "";

            return `
                <section style="margin-top: 24px;">
                    <div style="
                        font-size: 24px;
                        font-weight: 950;
                        color: #FFFFFF;
                        line-height: 1.15;
                    ">
                        ${lang === "es" ? "Semana de" : "Week of"} ${formatDate(weekDates[0], lang)}
                    </div>

                    <div style="margin-top: 14px;">
                        ${cards}
                    </div>
                </section>
            `;
        })
        .join("");

    return `
        <div style="
                width: 860px;
                background: transparent;
                padding: 42px;
                font-family: Inter, Arial, sans-serif;
            ">
            <div style="
                display: flex;
                flex-direction: column;
                border-radius: 34px;
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.14);
                padding: 24px;
                box-shadow: 0 30px 80px rgba(0,0,0,0.28);
            ">
                <div style="
                    border-radius: 28px;
                    background: #FFFFFF;
                    padding: 28px;
                    box-shadow: 0 20px 48px rgba(15, 23, 42, 0.08);
                ">
                    <div style="
                        font-size: 13px;
                        font-weight: 900;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        color: #6366F1;
                    ">
                        Aputrak
                    </div>

                    <h1 style="
                        margin: 12px 0 0;
                        font-size: 42px;
                        line-height: 1.03;
                        font-weight: 950;
                        color: #0F172A;
                    ">
                        ${options.range === "month"
            ? lang === "es"
                ? "Resumen mensual"
                : "Monthly summary"
            : lang === "es"
                ? "Horario semanal"
                : "Weekly schedule"
        }
                    </h1>

                    <div style="
                        margin-top: 10px;
                        font-size: 16px;
                        color: #64748B;
                        font-weight: 800;
                        text-transform: capitalize;
                    ">
                        ${escapeHtml(username)} · ${escapeHtml(monthLabel)}
                    </div>

                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 12px;
                        margin-top: 20px;
                    ">
                        ${renderStatCard(lang === "es" ? "Periodo" : "Period", monthLabel)}
                        ${renderStatCard(lang === "es" ? "Actividades" : "Activities", String(totalTasks))}
                    </div>
                </div>

                <div style="flex: 0;">
                    ${sections ||
        `
                        <div style="
                            margin-top: 24px;
                            border-radius: 24px;
                            background: #FFFFFF;
                            padding: 24px;
                            color: #64748B;
                            font-size: 15px;
                        ">
                            ${lang === "es" ? "No hay actividades para exportar." : "No activities to export."}
                        </div>
                    `
        }
                </div>

                <div style="
                    margin-top: 24px;
                    border-top: 1px solid rgba(255,255,255,0.14);
                    padding-top: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: rgba(255,255,255,0.74);
                    font-size: 13px;
                    font-weight: 800;
                ">
                    <span>Aputrak</span>
                    <span>${lang === "es" ? "Exportado desde tu horario" : "Exported from your schedule"}</span>
                </div>
            </div>
        </div>
    `;
}

async function downloadCanvasAsImage(
    canvas: HTMLCanvasElement,
    filename: string,
    type: "desktop" | "mobile",
) {
    const targetWidth = type === "desktop" ? 1920 : 1080;
    const targetHeight = type === "desktop" ? 1080 : 1920;

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;

    const ctx = finalCanvas.getContext("2d");

    if (!ctx) {
        throw new Error("Canvas context not available");
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, targetHeight);
    gradient.addColorStop(0, "#0B1736");
    gradient.addColorStop(1, "#101E46");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const padding = type === "desktop" ? 40 : 28;
    const availableWidth = targetWidth - padding * 2;
    const availableHeight = targetHeight - padding * 2;

    const scale = Math.min(
        availableWidth / canvas.width,
        availableHeight / canvas.height,
    );

    const drawWidth = canvas.width * scale;
    const drawHeight = canvas.height * scale;
    const x = (targetWidth - drawWidth) / 2;
    const y =
        type === "mobile"
            ? Math.max(20, (targetHeight - drawHeight) / 2)
            : (targetHeight - drawHeight) / 2;

    ctx.shadowColor = "rgba(0,0,0,0.30)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;
    ctx.drawImage(canvas, x, y, drawWidth, drawHeight);

    const link = document.createElement("a");
    link.download = `${filename}_${type}.png`;
    link.href = finalCanvas.toDataURL("image/png", 1);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadCanvasAsPdf(canvas: HTMLCanvasElement, filename: string) {
    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";

    const pdf = new jsPDF({
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
}

function getActiveTaskCount(
    tasks: ScheduleTask[],
    includeCompleted: boolean,
) {
    return tasks.filter((task) => {
        const lines = task.text
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        const completed =
            lines.length > 0 && lines.every((_, index) => task.completed[index]);

        return includeCompleted ? true : !completed;
    }).length;
}

function getMonthLabelFromWeekId(weekId: string, lang: string) {
    const date = getDateFromWeekId(weekId);

    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
        month: "long",
        year: "numeric",
    });
}

function renderStatCard(label: string, value: string) {
    return `
        <div style="
            border: 1px solid #E2E8F0;
            background: #FFFFFF;
            border-radius: 18px;
            padding: 16px 18px;
        ">
            <div style="
                font-size: 12px;
                color: #64748B;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.06em;
            ">
                ${escapeHtml(label)}
            </div>
            <div style="
                margin-top: 6px;
                font-size: 24px;
                color: #0F172A;
                font-weight: 900;
                line-height: 1.1;
            ">
                ${escapeHtml(value)}
            </div>
        </div>
    `;
}

export function useScheduleExport({
    lang,
    profile,
    scheduleData,
    showPromiseToast,
}: UseScheduleExportParams) {
    const toastCopy = getToastCopy(lang);
    const [exportLoading, setExportLoading] = useState(false);

    const handleGraphicExport = async (
        type: "pdf" | "desktop" | "mobile",
        options: ExportOptions,
    ) => {
        const exportTask = async () => {
            const username = profile?.username ?? "usuario";

            const root = createExportRoot(type === "mobile" ? 860 : 1640);

            try {
                const weekGroups =
                    options.range === "month"
                        ? await Promise.all(
                            getMonthWeekIds(scheduleData.weekId).map(async (weekId) => ({
                                weekId,
                                tasks: scheduleData.getTasksForWeek
                                    ? await scheduleData.getTasksForWeek(weekId)
                                    : weekId === scheduleData.weekId
                                        ? scheduleData.tasks
                                        : [],
                            })),
                        )
                        : [
                            {
                                weekId: scheduleData.weekId,
                                tasks: scheduleData.tasks,
                            },
                        ];

                if (type === "pdf") {
                    if (options.range === "month") {
                        root.innerHTML = renderMonthExport({
                            lang,
                            weekGroups,
                            username,
                            options,
                        });
                    } else {
                        root.innerHTML = renderWeekExport({
                            lang,
                            weekId: scheduleData.weekId,
                            tasks: scheduleData.tasks,
                            username,
                            options,
                        });
                    }
                } else if (type === "desktop") {
                    root.innerHTML = renderDesktopImageExport({
                        lang,
                        username,
                        options,
                        weekId: scheduleData.weekId,
                        weekGroups,
                    });
                } else {
                    root.innerHTML = renderMobileImageExport({
                        lang,
                        username,
                        options,
                        weekId: scheduleData.weekId,
                        weekGroups,
                    });
                }

                await document.fonts.ready;
                await new Promise((resolve) => window.setTimeout(resolve, 120));

                const canvas = await html2canvas(root.firstElementChild as HTMLElement, {
                    backgroundColor: type === "pdf" ? "#ffffff" : null,
                    scale: 2,
                    useCORS: true,
                });

                const filename = sanitizeFilename(
                    `ApuTrak_${username}_${scheduleData.weekId}_${options.range}`,
                );

                if (type === "pdf") {
                    downloadCanvasAsPdf(canvas, filename);
                    return;
                }

                await downloadCanvasAsImage(canvas, filename, type);
            } finally {
                document.body.removeChild(root);
            }
        };

        try {
            setExportLoading(true);
            await showPromiseToast(exportTask(), toastCopy.exportGraphic);
        } catch (error) {
            console.error(error);
        } finally {
            setExportLoading(false);
        }
    };

    const handleExportJSON = async () => {
        const backupTask = async () => {
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
        };

        try {
            setExportLoading(true);
            await showPromiseToast(backupTask(), toastCopy.exportBackup);
        } catch (error) {
            console.error(error);
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