export const EXPORT_COPY = {
    es: {
        pdf: "PDF",
        desktop: "PC",
        mobile: "Móvil",
        backup: "Backup",
        restore: "Restore",
        exportError: "Error al exportar gráfico",
        backupError: "Error al exportar respaldo",
    },
    en: {
        pdf: "PDF",
        desktop: "PC",
        mobile: "Mobile",
        backup: "Backup",
        restore: "Restore",
        exportError: "Error exporting graphic",
        backupError: "Error exporting backup",
    },
} as const;

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