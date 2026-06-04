export const AUTH_COPY = {
    es: {
        appName: "Aputrak",
        welcome: "Bienvenido",
        welcomeSub: "Tu planificador de horarios y actividades offline",
        name: "Nombre",
        enterName: "Ingresa tu nombre",
        language: "Idioma",
        english: "English",
        spanish: "Español",
        getStarted: "Comenzar",
        worksOffline: "Funciona sin internet — no requiere conexión",
        validationError: "Ingresa tu nombre.",
    },
    en: {
        appName: "Aputrak",
        welcome: "Welcome",
        welcomeSub: "Your offline-first schedule & activity planner",
        name: "Name",
        enterName: "Enter your name",
        language: "Language",
        english: "English",
        spanish: "Español",
        getStarted: "Get Started",
        worksOffline: "Works offline — no internet required",
        validationError: "Please enter your name.",
    },
} as const;

export type AuthLanguage = keyof typeof AUTH_COPY;

export function getAuthCopy(lang: string) {
    return AUTH_COPY[lang as AuthLanguage] ?? AUTH_COPY.es;
}