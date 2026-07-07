export const BOARD_COPY = {
    es: {
        title: "Tableros",
        subtitle: "Organiza tus tareas en listas y flujos de trabajo personalizados.",
        createBoard: "Crear Tablero",
        boardName: "Nombre del tablero",
        addList: "Añadir Lista",
        listName: "Nombre de la lista",
        addTask: "Añadir tarea",
        emptyBoard: "No tienes listas aún. Crea una para empezar.",
        noBoards: "No has creado ningún tablero.",
        deleteBoard: "Eliminar tablero",
        deleteList: "Eliminar lista",
        selectBoard: "Seleccionar tablero",
    },
    en: {
        title: "Boards",
        subtitle: "Organize your tasks into lists and custom workflows.",
        createBoard: "Create Board",
        boardName: "Board Name",
        addList: "Add List",
        listName: "List Name",
        addTask: "Add task",
        emptyBoard: "You don't have any lists yet. Create one to get started.",
        noBoards: "You haven't created any boards.",
        deleteBoard: "Delete board",
        deleteList: "Delete list",
        selectBoard: "Select board",
    }
} as const;

export type BoardLanguage = keyof typeof BOARD_COPY;

export function getBoardCopy(lang: string) {
    return BOARD_COPY[lang as BoardLanguage] ?? BOARD_COPY.es;
}
