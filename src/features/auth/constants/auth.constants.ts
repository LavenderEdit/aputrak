export const AUTH_COPY = {
    es: {
        appName: "Aputrak",
        welcome: "Bienvenido",
        welcomeSub: "Tu planificador de horarios y actividades offline",
        name: "Nombre",
        enterName: "Ingresa tu nombre",
        email: "Correo electrónico",
        enterEmail: "Ingresa tu correo",
        password: "Contraseña",
        enterPassword: "Ingresa tu contraseña",
        language: "Idioma",
        english: "English",
        spanish: "Español",
        getStarted: "Usar sin cuenta",
        login: "Iniciar Sesión",
        register: "Registrarse",
        switchToRegister: "¿No tienes cuenta? Regístrate",
        switchToLogin: "¿Ya tienes cuenta? Inicia sesión",
        worksOffline: "Funciona sin internet — no requiere conexión",
        validationError: "Por favor, completa todos los campos.",
        authError: "Error de autenticación. Verifica tus credenciales.",
    },
    en: {
        appName: "Aputrak",
        welcome: "Welcome",
        welcomeSub: "Your offline-first schedule & activity planner",
        name: "Name",
        enterName: "Enter your name",
        email: "Email",
        enterEmail: "Enter your email",
        password: "Password",
        enterPassword: "Enter your password",
        language: "Language",
        english: "English",
        spanish: "Español",
        getStarted: "Use Offline (Guest)",
        login: "Log In",
        register: "Register",
        switchToRegister: "Don't have an account? Register",
        switchToLogin: "Already have an account? Log in",
        worksOffline: "Works offline — no internet required",
        validationError: "Please fill in all fields.",
        authError: "Authentication error. Check your credentials.",
    },
} as const;

export type AuthLanguage = keyof typeof AUTH_COPY;

export function getAuthCopy(lang: string) {
    return AUTH_COPY[lang as AuthLanguage] ?? AUTH_COPY.es;
}