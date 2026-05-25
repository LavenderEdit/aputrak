import type { ParsedScheduleItem } from "./types";
import { findSingleDay, getDaysInLine } from "./text";
import { findTimeRange } from "./time";
import {
    cleanTitle,
    collectExtraFromNextLines,
    collectTitleFromPreviousLines,
} from "./title";

export function parseScheduleText(rawText: string): ParsedScheduleItem[] {
    const lines = rawText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const items: ParsedScheduleItem[] = [];
    let currentDay: string | null = null;

    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];

        const detectedDays = getDaysInLine(line);

        if (detectedDays.length === 1) {
            currentDay = detectedDays[0];
        }

        const timeRange = findTimeRange(line);

        if (!timeRange) continue;

        const day = findSingleDay(line) ?? currentDay ?? "Revisar día";

        const titleFromSameLine = cleanTitle(line);
        const titleFromPreviousLines = collectTitleFromPreviousLines(lines, index);
        const extraFromNextLines = collectExtraFromNextLines(lines, index);

        const title = [
            titleFromPreviousLines || titleFromSameLine,
            extraFromNextLines,
        ]
            .filter(Boolean)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();

        items.push({
            id: crypto.randomUUID(),
            day,
            startTime: timeRange.startTime,
            endTime: timeRange.endTime,
            title,
            sourceLine: line,
            confidence: timeRange.suspicious || day === "Revisar día" ? 0.45 : 0.75,
        });
    }

    return items;
}   