import { MERIDIEM_PATTERN } from "./constants";
import type { TimeRangeMatch } from "./types";

export function normalizeMeridiem(value?: string | null) {
    if (!value) return null;

    const normalized = value
        .toLowerCase()
        .replace(/\./g, "")
        .replace(/\s+/g, "");

    if (normalized === "am") return "AM";
    if (normalized === "pm") return "PM";

    if (normalized.startsWith("a") && normalized.endsWith("m")) return "AM";
    if (normalized.startsWith("p") && normalized.endsWith("m")) return "PM";

    return null;
}

export function extractMeridiem(value: string) {
    const match = value.match(new RegExp(MERIDIEM_PATTERN, "i"));

    return normalizeMeridiem(match?.[0]);
}

export function minutesFromTime(time: string) {
    const [hour, minutes] = time.split(":").map(Number);

    return hour * 60 + minutes;
}


export function parseTimeToken(token: string, fallbackMeridiem?: string | null) {
    const cleaned = token.trim();

    const match = cleaned.match(
        new RegExp(
            String.raw`^([01]?\d|2[0-3])(?::|\.|h)([0-5]\d)\s*(${MERIDIEM_PATTERN})?$`,
            "i",
        ),
    );

    const meridiemOnlyMatch = cleaned.match(
        new RegExp(
            String.raw`^(1[0-2]|0?[1-9])\s*(${MERIDIEM_PATTERN})$`,
            "i",
        ),
    );

    let hour: number;
    let minutes: string;
    let meridiem: string | null;

    if (match) {
        hour = Number(match[1]);
        minutes = match[2];
        meridiem = normalizeMeridiem(match[3]) ?? normalizeMeridiem(fallbackMeridiem);
    } else if (meridiemOnlyMatch) {
        hour = Number(meridiemOnlyMatch[1]);
        minutes = "00";
        meridiem = normalizeMeridiem(meridiemOnlyMatch[2]);
    } else {
        return null;
    }

    if (meridiem === "PM" && hour < 12) {
        hour += 12;
    }

    if (meridiem === "AM" && hour === 12) {
        hour = 0;
    }

    return `${String(hour).padStart(2, "0")}:${minutes}`;
}

export function getTimeTokenPattern() {
    return (
        String.raw`(?:[01]?\d|2[0-3])(?::|\.|h)[0-5]\d\s*${MERIDIEM_PATTERN}?` +
        String.raw`|(?:1[0-2]|0?[1-9])\s*${MERIDIEM_PATTERN}`
    );
}

export function findTimeRange(line: string): TimeRangeMatch | null {
    const timeToken = getTimeTokenPattern();

    const regex = new RegExp(
        String.raw`(?:^|[^\d])(${timeToken})\s*(?:-|–|—|a|hasta)\s*(${timeToken})(?:$|[^\d])`,
        "i",
    );

    const match = line.match(regex);

    if (!match) return null;

    const rawStart = match[1].trim();
    const rawEnd = match[2].trim();

    const fallbackMeridiem = extractMeridiem(rawEnd);
    const startTime = parseTimeToken(rawStart, fallbackMeridiem);
    const endTime = parseTimeToken(rawEnd);

    if (!startTime || !endTime) return null;

    const duration = minutesFromTime(endTime) - minutesFromTime(startTime);

    return {
        startTime,
        endTime,
        rawStart,
        rawEnd,
        suspicious: duration <= 0 || duration > 360,
    };
}

export function removeTimeRange(line: string) {
    const timeToken = getTimeTokenPattern();

    const regex = new RegExp(
        String.raw`(${timeToken})\s*(?:-|–|—|a|hasta)\s*(${timeToken})`,
        "gi",
    );

    return line.replace(regex, "").replace(/\s+/g, " ").trim();
}