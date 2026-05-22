export const DASHBOARD_COPY = {
    es: {
        hello: "Hola",
        addTask: "Agregar Tarea",
        importSchedule: "Importar Horario",
        exportPDF: "Exportar PDF",
        openCalendar: "Abrir Calendario",
        totalActivities: "Total Actividades",
        completedTasks: "Tareas Completadas",
        pendingTasks: "Tareas Pendientes",
        productivity: "Productividad",
        todaySchedule: "Horario de Hoy",
        upcoming: "Actividades Próximas",
        noTasks: "Sin tareas",
        noActivitiesYet: "Sin actividades aún",
        emptyToday: "No tienes actividades para hoy.",
        emptyUpcoming: "Nada pendiente por ahora.",
    },
    en: {
        hello: "Hello",
        addTask: "Add Task",
        importSchedule: "Import Schedule",
        exportPDF: "Export PDF",
        openCalendar: "Open Calendar",
        totalActivities: "Total Activities",
        completedTasks: "Completed Tasks",
        pendingTasks: "Pending Tasks",
        productivity: "Productivity",
        todaySchedule: "Today's Schedule",
        upcoming: "Upcoming Activities",
        noTasks: "No tasks",
        noActivitiesYet: "No activities yet",
        emptyToday: "You have no activities today.",
        emptyUpcoming: "Nothing pending for now.",
    },
} as const;

export type DashboardLanguage = keyof typeof DASHBOARD_COPY;

export function getDashboardCopy(lang: string) {
    return DASHBOARD_COPY[lang as DashboardLanguage] ?? DASHBOARD_COPY.es;
}