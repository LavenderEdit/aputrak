export const EXPORT_COPY = {
    es: {
        title: "Exportar Horario",
        subtitle: "Genera archivos para compartir, imprimir o respaldar tus datos.",
        dateRange: "Rango de Fechas",
        week: "Horario Semanal",
        month: "Horario Mensual",
        includeCompleted: "Incluir tareas completadas",
        includeNotes: "Incluir notas",
        layoutStyle: "Estilo de Diseño",
        compact: "Compacto",
        detailed: "Detallado",
        generatePDF: "Generar PDF",
        desktopImage: "Imagen escritorio",
        mobileImage: "Imagen móvil",
        backupData: "Respaldar Datos",
        pdf: "PDF",
        desktop: "PC",
        mobile: "Móvil",
        backup: "Backup",
        restore: "Restore",
    },
    en: {
        title: "Export Schedule",
        subtitle: "Generate files to share, print, or back up your data.",
        dateRange: "Date Range",
        week: "Weekly Schedule",
        month: "Monthly Schedule",
        includeCompleted: "Include completed tasks",
        includeNotes: "Include notes",
        layoutStyle: "Layout Style",
        compact: "Compact",
        detailed: "Detailed",
        generatePDF: "Generate PDF",
        desktopImage: "Desktop image",
        mobileImage: "Mobile image",
        backupData: "Backup Data",
        pdf: "PDF",
        desktop: "PC",
        mobile: "Mobile",
        backup: "Backup",
        restore: "Restore",
    },
} as const;

export type ExportLanguage = keyof typeof EXPORT_COPY;

export function getExportCopy(lang: string) {
    return EXPORT_COPY[lang as ExportLanguage] ?? EXPORT_COPY.es;
}

export const EXPORT_CONFIG = {
    desktop: {
        width: 1920,
        height: 1080,
    },
    mobile: {
        width: 1080,
        height: 1920,
    },
    backgroundColor: "#1e293b",
    imagePixelRatio: 2,
    imageQuality: 0.98,
} as const;