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

function normalizeDayToken(value: string) {
    return value
        .replace(/[Oo]/g, "0")
        .replace(/[Il|]/g, "1")
        .replace(/[^\d]/g, "");
}

function formatLocalDateId(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getWeekStartIdentifier(date: Date) {
    const current = new Date(date);
    const day = current.getDay() || 7;

    current.setDate(current.getDate() - day + 1);
    current.setHours(0, 0, 0, 0);

    return formatLocalDateId(current);
}

export function extractWeekIdFromScheduleText(text: string) {
    const normalized = normalizeText(text);

    const match = normalized.match(
        /semana\s+de\s+([a-z]{3,})[^0-9oOil|]*([0-9oOil|]{1,2})[^0-9]*(20\d{2}|19\d{2})/,
    );

    if (!match) return null;

    const monthLabel = match[1];
    const dayValue = Number(normalizeDayToken(match[2]));
    const yearValue = Number(match[3]);

    const monthIndex = MONTH_ALIASES[monthLabel];

    if (monthIndex === undefined) return null;
    if (Number.isNaN(dayValue) || Number.isNaN(yearValue)) return null;
    if (dayValue < 1 || dayValue > 31) return null;

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