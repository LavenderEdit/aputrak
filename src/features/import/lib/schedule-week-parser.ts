const MONTH_ALIASES: Record<string, number> = {
    jan: 0,
    january: 0,
    ene: 0,
    enero: 0,

    feb: 1,
    february: 1,
    febrero: 1,

    mar: 2,
    march: 2,
    marzo: 2,

    apr: 3,
    april: 3,
    abr: 3,
    abril: 3,

    may: 4,
    mayo: 4,

    jun: 5,
    june: 5,
    junio: 5,

    jul: 6,
    july: 6,
    julio: 6,

    aug: 7,
    august: 7,
    ago: 7,
    agosto: 7,

    sep: 8,
    sept: 8,
    september: 8,
    septiembre: 8,

    oct: 9,
    october: 9,
    octubre: 9,

    nov: 10,
    november: 10,
    noviembre: 10,

    dec: 11,
    december: 11,
    dic: 11,
    diciembre: 11,
};

function normalizeText(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function getWeekStartIdentifier(date: Date) {
    const current = new Date(date);
    const day = current.getDay() || 7;

    current.setHours(-24 * (day - 1));

    return current.toISOString().split("T")[0];
}

function normalizeDayToken(value: string) {
    return value.replace(/[Oo]/g, "0");
}

export function extractWeekIdFromScheduleText(text: string) {
    const normalized = normalizeText(text);

    const match = normalized.match(
        /semana\s+de\s+([a-z]+)\.?\s+([0-9oO]{1,2}),?\s+(\d{4})/,
    );

    if (!match) return null;

    const monthLabel = match[1];
    const dayValue = Number(normalizeDayToken(match[2]));
    const yearValue = Number(match[3]);

    const monthIndex = MONTH_ALIASES[monthLabel];

    if (monthIndex === undefined) return null;
    if (Number.isNaN(dayValue) || Number.isNaN(yearValue)) return null;

    return getWeekStartIdentifier(new Date(yearValue, monthIndex, dayValue));
}

export function formatDetectedWeek(weekId: string, lang: string) {
    const date = new Date(`${weekId}T00:00:00`);

    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}