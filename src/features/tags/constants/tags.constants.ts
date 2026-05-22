import type { ActivityTag } from "../types/tag.types";

export const DEFAULT_ACTIVITY_TAGS: ActivityTag[] = [
    {
        id: "university",
        name: "Universidad",
        color: "#6366F1",
        icon: "GraduationCap",
    },
    {
        id: "work",
        name: "Trabajo",
        color: "#14B8A6",
        icon: "Briefcase",
    },
    {
        id: "personal",
        name: "Personal",
        color: "#EC4899",
        icon: "Heart",
    },
    {
        id: "exercise",
        name: "Ejercicio",
        color: "#F59E0B",
        icon: "Dumbbell",
    },
    {
        id: "study",
        name: "Estudio",
        color: "#8B5CF6",
        icon: "BookOpen",
    },
];

export const TAGS_COPY = {
    es: {
        title: "Etiquetas",
        addTag: "Agregar Etiqueta",
        editTag: "Editar Etiqueta",
        deleteTag: "Eliminar Etiqueta",
        tagName: "Nombre de Etiqueta",
        color: "Color",
        save: "Guardar",
        cancel: "Cancelar",
        activities: "actividades",
        emptyTitle: "Sin etiquetas aún",
        emptyDescription: "Agrega tu primera etiqueta para organizar actividades",
    },
    en: {
        title: "Tags",
        addTag: "Add Tag",
        editTag: "Edit Tag",
        deleteTag: "Delete Tag",
        tagName: "Tag Name",
        color: "Color",
        save: "Save",
        cancel: "Cancel",
        activities: "activities",
        emptyTitle: "No tags yet",
        emptyDescription: "Add your first tag to organize activities",
    },
} as const;

export type TagsLanguage = keyof typeof TAGS_COPY;

export function getTagsCopy(lang: string) {
    return TAGS_COPY[lang as TagsLanguage] ?? TAGS_COPY.es;
}