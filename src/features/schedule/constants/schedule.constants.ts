export const SCHEDULE_COPY = {
    es: {
        week: "Semana",
        day: "Día",
        createActivity: "Crear actividad",
        hide: "Ocultar",
        overdueFallback: "Tienes tareas atrasadas.",
        emptyWeekButton: "Crear actividad",
    },
    en: {
        week: "Week",
        day: "Day",
        createActivity: "Create activity",
        hide: "Dismiss",
        overdueFallback: "You have overdue tasks.",
        emptyWeekButton: "Create activity",
    },
} as const;

export const SCHEDULE_UI = {
    hourRowHeight: 76,
    minTaskHeight: 54,
    desktopMinWidth: 860,
} as const;

export type ScheduleCopyLanguage = keyof typeof SCHEDULE_COPY;