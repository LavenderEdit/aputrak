import { DAY_ALIASES } from "./constants";

export function normalizeText(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

export function getDaysInLine(line: string): string[] {
    const normalized = normalizeText(line);
    const days = new Set<string>();

    for (const [alias, day] of Object.entries(DAY_ALIASES)) {
        const normalizedAlias = normalizeText(alias);
        const regex = new RegExp(`\\b${normalizedAlias}\\b`, "i");

        if (regex.test(normalized)) {
            days.add(day);
        }
    }

    return Array.from(days);
}

export function findSingleDay(line: string): string | null {
    const days = getDaysInLine(line);

    return days.length === 1 ? days[0] : null;
}

export function isJunkLine(line: string) {
    const normalized = normalizeText(line);

    if (!normalized) return true;

    if (normalized.includes("semana anterior")) return true;
    if (normalized.includes("siguiente semana")) return true;
    if (normalized.startsWith("semana de")) return true;

    if (/^(pm|am|spm|epm)$/i.test(normalized)) return true;
    if (/^\d{1,2}\s*(am|pm)$/i.test(normalized)) return true;

    const days = getDaysInLine(line);

    return days.length > 1;
}

export function looksLikeCourseCode(line: string) {
    return /^[A-Z]{2,6}\s*\d{3,4}[-.]?\d*/i.test(line.trim());
}

export function looksLikeRoomOrMode(line: string) {
    const normalized = normalizeText(line);

    return /^(sv\.?ev|sv-ev|svev|svwev|svwev)$/i.test(normalized);
}