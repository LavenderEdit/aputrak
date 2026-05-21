export function formatDateId(date: Date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

export function parseDateId(dateId: string) {
    const [year, month, day] = dateId.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function isSameDay(first: Date, second: Date) {
    return formatDateId(first) === formatDateId(second);
}

export function isToday(date: Date) {
    return isSameDay(date, new Date());
}

export function getWeekDatesFromWeekId(weekId: string) {
    const start = parseDateId(weekId);

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return date;
    });
}

export function getMonthGrid(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay() || 7;
    const days: Date[] = [];

    for (let index = 1 - startDay; index < 50; index++) {
        const item = new Date(year, month, first.getDate() + index);
        days.push(item);

        if (days.length >= 35) break;
    }

    return days;
}

export function getMonthName(date: Date, lang: string) {
    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
        month: "long",
        year: "numeric",
    });
}

export function getShortDayName(date: Date, lang: string) {
    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
        weekday: "short",
    });
}

export function getShortDate(dateId: string, lang: string) {
    return parseDateId(dateId).toLocaleDateString(
        lang === "es" ? "es-ES" : "en-US",
        {
            month: "short",
            day: "numeric",
        },
    );
}