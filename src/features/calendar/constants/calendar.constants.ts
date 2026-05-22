export const CALENDAR_COPY = {
    es: {
        addTask: "Agregar tarea",
        tags: "Etiquetas",
        all: "Todas",
        today: "Hoy",
        week: "Semana",
        month: "Mes",
    },
    en: {
        addTask: "Add task",
        tags: "Tags",
        all: "All",
        today: "Today",
        week: "Week",
        month: "Month",
    },
} as const;

export type CalendarLanguage = keyof typeof CALENDAR_COPY;

export function getCalendarCopy(lang: string) {
    return CALENDAR_COPY[lang as CalendarLanguage] ?? CALENDAR_COPY.es;
}