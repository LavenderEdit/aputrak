export const SCHEDULE_COPY = {
    es: {
        week: "Semana",
        day: "Día",
        createActivity: "Crear actividad",
        editActivity: "Editar actividad",
        activityTitle: "Actividad",
        titlePlaceholder: "Nombre de la actividad",
        notes: "Notas",
        notesPlaceholder: "Agrega detalles o subtareas, una por línea",
        timeRange: "Horario",
        colorCategory: "Color",
        cancel: "Cancelar",
        saveTask: "Guardar actividad",
        hide: "Ocultar",
        overdueFallback: "Tienes tareas atrasadas.",
        emptyWeekButton: "Crear actividad",
    },
    en: {
        week: "Week",
        day: "Day",
        createActivity: "Create activity",
        editActivity: "Edit activity",
        activityTitle: "Activity",
        titlePlaceholder: "Activity name",
        notes: "Notes",
        notesPlaceholder: "Add details or subtasks, one per line",
        timeRange: "Time",
        colorCategory: "Color",
        cancel: "Cancel",
        saveTask: "Save activity",
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

export function getScheduleCopy(lang: string) {
    return SCHEDULE_COPY[lang as ScheduleCopyLanguage] ?? SCHEDULE_COPY.es;
}