export const TOAST_COPY = {
    es: {
        processing: {
            title: "Procesando...",
            description: "Estamos ejecutando la operación.",
        },

        schedule: {
            cloneSuccess: {
                title: "Semana copiada",
                description:
                    "Las actividades de la semana anterior fueron copiadas correctamente.",
            },
            cloneError: {
                title: "No se pudo copiar",
                description: "No hay actividades en la semana anterior para copiar.",
            },
            smartRescheduleSuccess: {
                title: "Tareas reorganizadas",
                description:
                    "Las tareas pendientes fueron movidas a espacios disponibles.",
            },
            smartRescheduleNoSpace: {
                title: "Sin espacios disponibles",
                description: "No hay suficientes espacios libres en el futuro.",
            },
        },

        exportGraphic: {
            loading: {
                title: "Exportando horario...",
                description: "Preparando la imagen o PDF de tu calendario.",
            },
            success: {
                title: "Exportación completada",
                description: "Tu archivo fue generado correctamente.",
            },
            error: {
                title: "Error al exportar",
                description: "No se pudo generar el archivo. Inténtalo nuevamente.",
            },
        },

        exportBackup: {
            loading: {
                title: "Creando respaldo...",
                description: "Preparando tus datos en formato JSON.",
            },
            success: {
                title: "Respaldo exportado",
                description: "Tu respaldo fue descargado correctamente.",
            },
            error: {
                title: "Error al exportar respaldo",
                description: "No se pudo crear el archivo de respaldo.",
            },
        },

        importBackup: {
            loading: {
                title: "Importando respaldo...",
                description: "Leyendo y restaurando tus datos.",
            },
            success: {
                title: "Respaldo restaurado",
                description: "Tus datos fueron importados correctamente.",
            },
            error: {
                title: "Archivo inválido",
                description: "El archivo no es un respaldo válido de Aputrak.",
            },
        },
    },

    en: {
        processing: {
            title: "Processing...",
            description: "We are running the operation.",
        },

        schedule: {
            cloneSuccess: {
                title: "Week copied",
                description: "Previous week activities were copied successfully.",
            },
            cloneError: {
                title: "Could not copy week",
                description: "No activities were found in the previous week.",
            },
            smartRescheduleSuccess: {
                title: "Tasks rescheduled",
                description: "Pending tasks were moved to available time slots.",
            },
            smartRescheduleNoSpace: {
                title: "No free slots",
                description: "There are not enough free slots in the future.",
            },
        },

        exportGraphic: {
            loading: {
                title: "Exporting schedule...",
                description: "Preparing your calendar image or PDF.",
            },
            success: {
                title: "Export completed",
                description: "Your file was generated successfully.",
            },
            error: {
                title: "Export failed",
                description: "The file could not be generated. Try again.",
            },
        },

        exportBackup: {
            loading: {
                title: "Creating backup...",
                description: "Preparing your data as a JSON file.",
            },
            success: {
                title: "Backup exported",
                description: "Your backup was downloaded successfully.",
            },
            error: {
                title: "Backup export failed",
                description: "The backup file could not be created.",
            },
        },

        importBackup: {
            loading: {
                title: "Importing backup...",
                description: "Reading and restoring your data.",
            },
            success: {
                title: "Backup restored",
                description: "Your data was imported successfully.",
            },
            error: {
                title: "Invalid file",
                description: "This is not a valid Aputrak backup file.",
            },
        },
    },
} as const;

export type ToastLanguage = keyof typeof TOAST_COPY;

export function getToastCopy(lang: string) {
    return TOAST_COPY[lang as ToastLanguage] ?? TOAST_COPY.es;
}