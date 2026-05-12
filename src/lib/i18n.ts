export type Language = "es" | "en";

export const translations = {
    es: {
        // Generales
        processing: "Procesando...",
        cancel: "Cancelar",
        save: "Guardar",

        // Smart Tetris
        smartTetrisTitle: "Tienes tareas atrasadas",
        smartTetrisDesc: "¿Quieres que ApuTrak mueva mágicamente tus tareas no completadas a los espacios libres de hoy o mañana?",
        smartTetrisBtn: "Reorganizar mágicamente",
        smartTetrisSuccess: "¡Tareas reorganizadas con éxito!",
        smartTetrisNoSpace: "No hay suficientes espacios libres en el futuro.",

        // Header
        scheduleOf: "Horario de",
        savedOffline: "Guardado localmente (Offline)",
        backup: "Respaldar",
        restore: "Restaurar",

        // Controles
        weekNav: "Navegación de Semana",
        activeDays: "Días Activos",
        startHour: "Hora Inicio",
        endHour: "Hora Fin",

        // Modales
        editProfile: "Editar Perfil",
        yourName: "Tu nombre...",
        activity: "Actividad",
        assigningTo: "Asignando a",
        at: "a las",
        taskPlaceholder: "Ej: Gimnasio\nEstudiar Inglés\n(Usa 'Enter' para múltiples tareas)",
        saveTask: "Guardar Tarea",

        // Mensajes Toast
        exportSuccess: "Exportación exitosa",
        exportError: "Error al exportar gráfico",
        backupSuccess: "Respaldo exportado con éxito",
        backupError: "Error al exportar respaldo",
        restoreSuccess: "Respaldo restaurado con éxito",
        invalidFile: "El archivo no es un respaldo válido",

        // Días
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    },
    en: {
        // General
        processing: "Processing...",
        cancel: "Cancel",
        save: "Save",

        // Smart Tetris
        smartTetrisTitle: "You have overdue tasks",
        smartTetrisDesc: "Do you want ApuTrak to magically move your uncompleted tasks to free slots today or tomorrow?",
        smartTetrisBtn: "Magically reorganize",
        smartTetrisSuccess: "Tasks reorganized successfully!",
        smartTetrisNoSpace: "Not enough free slots in the future.",

        // Header
        scheduleOf: "Schedule of",
        savedOffline: "Saved locally (Offline)",
        backup: "Backup",
        restore: "Restore",

        // Controls
        weekNav: "Week Navigation",
        activeDays: "Active Days",
        startHour: "Start Hour",
        endHour: "End Hour",

        // Modals
        editProfile: "Edit Profile",
        yourName: "Your name...",
        activity: "Activity",
        assigningTo: "Assigning to",
        at: "at",
        taskPlaceholder: "Ex: Gym\nStudy English\n(Press 'Enter' for multiple tasks)",
        saveTask: "Save Task",

        // Toast Messages
        exportSuccess: "Export successful",
        exportError: "Error exporting graphic",
        backupSuccess: "Backup exported successfully",
        backupError: "Error exporting backup",
        restoreSuccess: "Backup restored successfully",
        invalidFile: "Invalid backup file",

        // Days
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    }
};