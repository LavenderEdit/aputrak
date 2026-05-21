export const SHELL_COPY = {
    es: {
        appName: "Aputrak",
        workspace: "Espacio personal",
        userLabel: "Usuario",
        dashboard: "Panel",
        calendar: "Calendario",
        activities: "Actividades",
        tags: "Etiquetas",
        import: "Importar",
        export: "Exportar",
        settings: "Ajustes",
        weeklyCalendar: "Calendario semanal",
        newActivity: "Nueva actividad",
        create: "Crear",
        schedule: "Agenda",
        offlineActive: "Modo offline activo",
        offlineDescription: "Tus datos se guardan localmente en este navegador.",
    },
    en: {
        appName: "Aputrak",
        workspace: "Personal workspace",
        userLabel: "User",
        dashboard: "Dashboard",
        calendar: "Calendar",
        activities: "Activities",
        tags: "Tags",
        import: "Import",
        export: "Export",
        settings: "Settings",
        weeklyCalendar: "Weekly calendar",
        newActivity: "New activity",
        create: "Create",
        schedule: "Schedule",
        offlineActive: "Offline mode active",
        offlineDescription: "Your data is stored locally in this browser.",
    },
} as const;

export type ShellLanguage = keyof typeof SHELL_COPY;

export function getShellCopy(lang: string) {
    return SHELL_COPY[lang as ShellLanguage] ?? SHELL_COPY.es;
}