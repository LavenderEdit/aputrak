import { DAY_ALIASES } from "./constants";
import { findTimeRange, removeTimeRange } from "./time";
import {
    isJunkLine,
    looksLikeCourseCode,
    looksLikeRoomOrMode,
} from "./text";

export function cleanTitle(value: string) {
    let title = removeTimeRange(value);

    for (const alias of Object.keys(DAY_ALIASES)) {
        title = title.replace(new RegExp(`\\b${alias}\\b`, "gi"), "");
    }

    return title
        .replace(/\bLe\s+(?=\d{3,5}\b)/gi, "")
        .replace(/\bCiase\b/gi, "Clase")
        .replace(/\bSV\.?EV\b/gi, "SV-EV")
        .replace(/\bSVEV\b/gi, "SV-EV")
        .replace(/\bSVwEV\b/gi, "SV-EV")
        .replace(/[|/\\•]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function collectTitleFromPreviousLines(
    lines: string[],
    timeLineIndex: number,
) {
    const parts: string[] = [];

    for (let index = timeLineIndex - 1; index >= 0; index--) {
        const line = lines[index];

        if (findTimeRange(line)) break;
        if (isJunkLine(line)) continue;

        const cleaned = cleanTitle(line);

        if (cleaned) {
            parts.unshift(cleaned);
        }

        if (parts.length >= 3) break;
    }

    return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function collectExtraFromNextLines(
    lines: string[],
    timeLineIndex: number,
) {
    const parts: string[] = [];

    for (let index = timeLineIndex + 1; index < lines.length; index++) {
        const line = lines[index];

        if (findTimeRange(line)) break;
        if (looksLikeCourseCode(line)) break;
        if (isJunkLine(line)) continue;

        if (looksLikeRoomOrMode(line)) {
            parts.push(cleanTitle(line));
        }

        if (parts.length >= 2) break;
    }

    return parts.join(" ").replace(/\s+/g, " ").trim();
}