export const DASHBOARD_COPY = {
    es: {
        title: "Organiza tu semana con claridad",
        subtitle: "Vista rápida de tus actividades, pendientes y progreso semanal.",
        newTask: "Nueva actividad",
        openCalendar: "Abrir calendario",
        activities: "Actividades",
        completed: "Completadas",
        pending: "Pendientes",
        progress: "Progreso",
        today: "Hoy",
        upcoming: "Pendientes próximos",
        emptyToday: "No tienes actividades para hoy.",
        emptyUpcoming: "Nada pendiente por ahora.",
    },
    en: {
        title: "Organize your week with clarity",
        subtitle: "A quick view of your activities, pending tasks, and weekly progress.",
        newTask: "New activity",
        openCalendar: "Open calendar",
        activities: "Activities",
        completed: "Completed",
        pending: "Pending",
        progress: "Progress",
        today: "Today",
        upcoming: "Upcoming pending",
        emptyToday: "You have no activities today.",
        emptyUpcoming: "Nothing pending for now.",
    },
} as const;

export type DashboardLanguage = keyof typeof DASHBOARD_COPY;

export function getDashboardCopy(lang: string) {
    return DASHBOARD_COPY[lang as DashboardLanguage] ?? DASHBOARD_COPY.es;
}