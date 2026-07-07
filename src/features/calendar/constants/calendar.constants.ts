export const CALENDAR_COPY = {
    es: {
        addTask: "Agregar tarea",
        tags: "Etiquetas",
        all: "Todas",
        today: "Hoy",
        week: "Semana",
        month: "Mes",
        previous: "Anterior",
        next: "Siguiente",
    },
    en: {
        addTask: "Add task",
        tags: "Tags",
        all: "All",
        today: "Today",
        week: "Week",
        month: "Month",
        previous: "Previous",
        next: "Next",
    },
} as const;

export type CalendarLanguage = keyof typeof CALENDAR_COPY;

export function getCalendarCopy(lang: string) {
    return CALENDAR_COPY[lang as CalendarLanguage] ?? CALENDAR_COPY.es;
}