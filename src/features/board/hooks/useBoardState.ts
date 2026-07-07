"use client";

import { useEffect, useState } from "react";
import { DB } from "@/shared/lib/db";
import type { BoardResponseDto } from "@/shared/api/generated/models/BoardResponseDto";
import type { BoardListResponseDto } from "@/shared/api/generated/models/BoardListResponseDto";
import { BASE_RADIX_36 } from "@/shared/lib/constants";

export function useBoardState() {
    const [boards, setBoards] = useState<BoardResponseDto[]>([]);
    const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadBoards = async () => {
        try {
            const stored = await DB.getAll<BoardResponseDto>("boards");
            setBoards(stored || []);
            if (stored && stored.length > 0 && !activeBoardId) {
                setActiveBoardId(stored[0].id || null);
            }
        } catch (error) {
            console.error("Error loading boards from DB", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBoards();
    }, []);

    const saveBoard = async (board: BoardResponseDto) => {
        try {
            await DB.put("boards", { ...board, id: board.id as string });
            setBoards((prev) => {
                const exists = prev.find((b) => b.id === board.id);
                if (exists) {
                    return prev.map((b) => (b.id === board.id ? board : b));
                }
                return [...prev, board];
            });
            if (!activeBoardId) setActiveBoardId(board.id || null);
        } catch (error) {
            console.error("Error saving board", error);
        }
    };

    const deleteBoard = async (id: string) => {
        try {
            await DB.delete("boards", id);
            setBoards((prev) => prev.filter((b) => b.id !== id));
            if (activeBoardId === id) {
                setActiveBoardId(boards.find((b) => b.id !== id)?.id || null);
            }
        } catch (error) {
            console.error("Error deleting board", error);
        }
    };

    const createBoard = async (title: string, description: string = "", color: string = "#3b82f6") => {
        const newBoard: BoardResponseDto = {
            id: `board_${Date.now()}_${Math.random().toString(BASE_RADIX_36).substring(2, 9)}`,
            title,
            description,
            color,
            lists: [],
        };
        await saveBoard(newBoard);
        return newBoard;
    };

    const createList = async (boardId: string, title: string) => {
        const board = boards.find((b) => b.id === boardId);
        if (!board) return;

        const newList: BoardListResponseDto = {
            id: `list_${Date.now()}_${Math.random().toString(BASE_RADIX_36).substring(2, 9)}`,
            title,
            boardId,
            position: board.lists ? board.lists.length : 0,
            taskIds: [],
        };

        const updatedBoard = {
            ...board,
            lists: [...(board.lists || []), newList],
        };

        await saveBoard(updatedBoard);
    };

    const deleteList = async (boardId: string, listId: string) => {
        const board = boards.find((b) => b.id === boardId);
        if (!board) return;

        const updatedBoard = {
            ...board,
            lists: (board.lists || []).filter((l) => l.id !== listId),
        };

        await saveBoard(updatedBoard);
    };

    const moveTask = async (boardId: string, taskId: string, sourceListId: string, destListId: string, newIndex: number) => {
        const board = boards.find((b) => b.id === boardId);
        if (!board) return;

        const updatedLists = (board.lists || []).map((list) => {
            if (list.id === sourceListId) {
                return { ...list, taskIds: (list.taskIds || []).filter((id) => id !== taskId) };
            }
            return list;
        });

        const destList = updatedLists.find((l) => l.id === destListId);
        if (destList) {
            const newTaskIds = [...(destList.taskIds || [])];
            newTaskIds.splice(newIndex, 0, taskId);
            destList.taskIds = newTaskIds;
        }

        const updatedBoard = {
            ...board,
            lists: updatedLists,
        };

        // Optimistic update
        setBoards((prev) => prev.map((b) => (b.id === boardId ? updatedBoard : b)));
        await DB.put("boards", { ...updatedBoard, id: boardId });
    };

    const activeBoard = boards.find((b) => b.id === activeBoardId) || null;

    return {
        boards,
        activeBoard,
        activeBoardId,
        setActiveBoardId,
        isLoading,
        createBoard,
        deleteBoard,
        createList,
        deleteList,
        moveTask,
    };
}
