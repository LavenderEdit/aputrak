export const IMPORT_COPY = {
    es: {
        title: "Importar Horario",
        subtitle: "Restaura respaldos JSON y revisa el archivo antes de cargarlo.",
        drop: "Arrastra tu respaldo aquí",
        browse: "o haz clic para seleccionar un archivo",
        supported: "Formato soportado: .json",
        privacy: "La importación ocurre localmente en tu navegador.",
        reviewTitle: "Revisar archivo seleccionado",
        reviewNote: "Confirma que este es el respaldo correcto antes de importarlo.",
        cancel: "Cancelar",
        confirm: "Confirmar Importación",
        done: "Importación completada",
        doneDesc: "Tu respaldo fue procesado correctamente.",
        importAnother: "Importar otro archivo",
        chooseFile: "Seleccionar archivo",
        invalidFile: "El archivo no es un respaldo válido",
        restoreSuccess: "Respaldo restaurado con éxito",
        missingSettings: "El respaldo no contiene configuración.",
        missingTasks: "El respaldo no contiene tareas.",
    },
    en: {
        title: "Import Schedule",
        subtitle: "Restore JSON backups and review the file before loading it.",
        drop: "Drop your backup here",
        browse: "or click to choose a file",
        supported: "Supported format: .json",
        privacy: "Import runs locally in your browser.",
        reviewTitle: "Review selected file",
        reviewNote: "Confirm this is the correct backup before importing.",
        cancel: "Cancel",
        confirm: "Confirm Import",
        done: "Import completed",
        doneDesc: "Your backup was processed successfully.",
        importAnother: "Import another file",
        chooseFile: "Choose file",
        invalidFile: "Invalid backup file",
        restoreSuccess: "Backup restored successfully",
        missingSettings: "The backup does not include settings.",
        missingTasks: "The backup does not include tasks.",
    },
} as const;

export type ImportLanguage = keyof typeof IMPORT_COPY;

export function getImportCopy(lang: string) {
    return IMPORT_COPY[lang as ImportLanguage] ?? IMPORT_COPY.es;
}