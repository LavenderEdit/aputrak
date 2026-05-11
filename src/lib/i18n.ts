export type Language = "es" | "en";

export const translations = {
    es: {
        // Generales
        processing: "Procesando...",
        cancel: "Cancelar",
        save: "Guardar",
        close: "Cerrar",
        settings: "Configuración",
        emptyTitle: "¡Tu semana está en blanco!",
        emptyDesc: "Haz clic en cualquier celda del calendario para agregar tu primera actividad y empezar a organizarte.",
        cloneWeek: "Clonar semana anterior",

        // Header
        scheduleOf: "Horario de",
        savedOffline: "Guardado localmente",
        backup: "Respaldar",
        restore: "Restaurar",

        // Controles
        weekNav: "Semana",
        activeDays: "Días Activos",
        startHour: "Hora Inicio",
        endHour: "Hora Fin",

        // Modales
        editProfile: "Editar Perfil",
        yourName: "Tu nombre...",
        activity: "Actividad",
        assigningTo: "Asignando a",
        at: "a las",
        colorCategory: "Color / Categoría",
        taskPlaceholder: "Ej: Gimnasio\nEstudiar Inglés\n(Usa 'Enter' para múltiples tareas)",
        saveTask: "Guardar Tarea",

        // Mensajes Toast
        exportSuccess: "Exportación exitosa",
        exportError: "Error al exportar gráfico",
        backupSuccess: "Respaldo exportado con éxito",
        backupError: "Error al exportar respaldo",
        restoreSuccess: "Respaldo restaurado con éxito",
        invalidFile: "El archivo no es un respaldo válido",
        cloneSuccess: "¡Semana anterior copiada con éxito!",
        cloneError: "No hay actividades en la semana anterior para copiar.",

        // Días
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    },
    en: {
        // General
        processing: "Processing...",
        cancel: "Cancel",
        save: "Save",
        close: "Close",
        settings: "Settings",
        emptyTitle: "Your week is empty!",
        emptyDesc: "Click on any cell in the calendar to add your first activity and start getting organized.",
        cloneWeek: "Clone previous week",

        // Header
        scheduleOf: "Schedule of",
        savedOffline: "Saved locally",
        backup: "Backup",
        restore: "Restore",

        // Controls
        weekNav: "Week",
        activeDays: "Active Days",
        startHour: "Start Hour",
        endHour: "End Hour",

        // Modals
        editProfile: "Edit Profile",
        yourName: "Your name...",
        activity: "Activity",
        assigningTo: "Assigning to",
        at: "at",
        colorCategory: "Color / Category",
        taskPlaceholder: "Ex: Gym\nStudy English\n(Press 'Enter' for multiple tasks)",
        saveTask: "Save Task",

        // Toast Messages
        exportSuccess: "Export successful",
        exportError: "Error exporting graphic",
        backupSuccess: "Backup exported successfully",
        backupError: "Error exporting backup",
        restoreSuccess: "Backup restored successfully",
        invalidFile: "Invalid backup file",
        cloneSuccess: "Previous week copied successfully!",
        cloneError: "No activities found in the previous week to copy.",

        // Days
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    }
};