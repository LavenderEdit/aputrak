export const EXPORT_COPY = {
    es: {
        pdf: "PDF",
        desktop: "PC",
        mobile: "Móvil",
        backup: "Backup",
        restore: "Restore",
    },
    en: {
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