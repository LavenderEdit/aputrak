import type { ActivityTag } from "../types/tag.types";

export const GENERAL_TAG_ID = "general";

export const DEFAULT_ACTIVITY_TAGS: ActivityTag[] = [
    {
        id: GENERAL_TAG_ID,
        name: "General",
        color: "#6366F1",
        icon: "Tag",
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