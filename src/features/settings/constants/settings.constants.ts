export const SETTINGS_COPY = {
    es: {
        title: "Ajustes",
        subtitle: "Personaliza tu perfil, idioma, semana y horario activo.",
        profile: "Perfil",
        username: "Nombre de usuario",
        saveUsername: "Guardar nombre",
        schedule: "Horario",
        activeDays: "Días activos",
        startHour: "Hora de inicio",
        endHour: "Hora de fin",
        preferences: "Preferencias",
        language: "Idioma",
        currentLanguage: "Idioma actual",
        changeLanguage: "Cambiar a inglés",
        notifications: "Recordatorios",
        notificationsDesc: "Próximamente: notificaciones antes de cada actividad.",
        storage: "Datos locales",
        storageDesc: "Tus datos se guardan en este navegador usando almacenamiento local.",
        resetDefaults: "Restaurar horario base",
        soon: "Pronto",
    },
    en: {
        title: "Settings",
        subtitle: "Customize your profile, language, week, and active hours.",
        profile: "Profile",
        username: "Username",
        saveUsername: "Save name",
        schedule: "Schedule",
        activeDays: "Active days",
        startHour: "Start hour",
        endHour: "End hour",
        preferences: "Preferences",
        language: "Language",
        currentLanguage: "Current language",
        changeLanguage: "Switch to Spanish",
        notifications: "Reminders",
        notificationsDesc: "Coming soon: notifications before each activity.",
        storage: "Local data",
        storageDesc: "Your data is stored in this browser using local storage.",
        resetDefaults: "Restore default schedule",
        soon: "Soon",
    },
} as const;

export type SettingsLanguage = keyof typeof SETTINGS_COPY;

export function getSettingsCopy(lang: string) {
    return SETTINGS_COPY[lang as SettingsLanguage] ?? SETTINGS_COPY.es;
}