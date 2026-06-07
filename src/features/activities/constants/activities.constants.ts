export const ACTIVITIES_COPY = {
    es: {
        title: "Actividades",
        subtitle: "Organiza tus tareas semanales y mantente al día",
        searchPlaceholder: "Buscar actividades...",
        allTags: "Todas las Etiquetas",
        addTask: "Agregar Tarea",
        all: "Todas",
        delete: "Eliminar",
        pending: "Pendiente",
        completed: "Completada",
        untagged: "Sin etiqueta",
        high: "Alta",
        medium: "Media",
        low: "Baja",
        emptyTitle: "Sin actividades aún",
        emptyDescription: "Agrega tu primera actividad para comenzar",
    },
    en: {
        title: "Activities",
        subtitle: "Track your weekly tasks and stay organized",
        searchPlaceholder: "Search activities...",
        allTags: "All Tags",
        addTask: "Add Task",
        all: "All",
        delete: "Delete",
        pending: "Pending",
        completed: "Completed",
        untagged: "Untagged",
        high: "High",
        medium: "Medium",
        low: "Low",
        emptyTitle: "No activities yet",
        emptyDescription: "Add your first activity to get started",
    },
} as const;

export type ActivitiesLanguage = keyof typeof ACTIVITIES_COPY;

export function getActivitiesCopy(lang: string) {
    return ACTIVITIES_COPY[lang as ActivitiesLanguage] ?? ACTIVITIES_COPY.es;
}