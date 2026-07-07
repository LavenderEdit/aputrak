"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { getBoardCopy } from "../constants/board.constants";
import { useBoardState } from "../hooks/useBoardState";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { cn } from "@/shared/lib/cn";
import { BoardColumn } from "./BoardColumn";
import { useOfflineSchedule } from "@/features/schedule/hooks/useOfflineSchedule";

export function BoardView() {
    const { lang } = useLanguage();
    const copy = getBoardCopy(lang);
    const {
        boards,
        activeBoard,
        activeBoardId,
        setActiveBoardId,
        isLoading,
        createBoard,
        createList,
        deleteBoard,
        deleteList,
        moveTask,
    } = useBoardState();

    const { tasks: scheduleTasks } = useOfflineSchedule();

    const [isCreatingBoard, setIsCreatingBoard] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState("");

    const [isCreatingList, setIsCreatingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");

    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [draggedSourceListId, setDraggedSourceListId] = useState<string | null>(null);

    const handleCreateBoard = async () => {
        if (!newBoardTitle.trim()) return;
        await createBoard(newBoardTitle.trim());
        setNewBoardTitle("");
        setIsCreatingBoard(false);
    };

    const handleCreateList = async () => {
        if (!newListTitle.trim() || !activeBoard) return;
        await createList(activeBoard.id as string, newListTitle.trim());
        setNewListTitle("");
        setIsCreatingList(false);
    };

    const handleDragStart = (taskId: string, sourceListId: string) => {
        setDraggedTaskId(taskId);
        setDraggedSourceListId(sourceListId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent, destListId: string, destIndex?: number) => {
        e.preventDefault();
        if (!draggedTaskId || !draggedSourceListId || !activeBoard) return;
        
        const targetIndex = destIndex ?? (activeBoard.lists?.find(l => l.id === destListId)?.taskIds?.length || 0);

        moveTask(
            activeBoard.id as string,
            draggedTaskId,
            draggedSourceListId,
            destListId,
            targetIndex
        );

        setDraggedTaskId(null);
        setDraggedSourceListId(null);
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col p-4 sm:p-6 fade-in overflow-hidden">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white">
                        {copy.title}
                    </h2>
                    <p className="mt-1 text-sm font-bold text-white/60">
                        {copy.subtitle}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Select
                        value={activeBoardId || ""}
                        onChange={(val) => setActiveBoardId(val)}
                        placeholder={copy.selectBoard}
                        emptyMessage={copy.noBoards}
                        options={boards.map((b) => ({
                            value: b.id as string,
                            label: b.title,
                        }))}
                    />

                    <Button onClick={() => setIsCreatingBoard(true)} variant="primary">
                        <Plus className="mr-2 h-4 w-4" />
                        {copy.createBoard}
                    </Button>
                </div>
            </div>

            {isCreatingBoard && (
                <div className="mb-6 flex gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
                    <input
                        type="text"
                        className="flex-1 bg-transparent px-3 py-2 text-white outline-none placeholder:text-white/30"
                        placeholder={copy.boardName}
                        value={newBoardTitle}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
                    />
                    <Button onClick={handleCreateBoard} variant="primary">
                        {copy.createBoard}
                    </Button>
                    <Button onClick={() => setIsCreatingBoard(false)} variant="ghost">
                        Cancel
                    </Button>
                </div>
            )}

            {!activeBoard ? (
                <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5">
                    <p className="font-bold text-white/40 uppercase tracking-widest">{copy.noBoards}</p>
                </div>
            ) : (
                <div className="flex h-full gap-4 overflow-x-auto pb-4">
                    {activeBoard.lists?.map((list) => (
                        <BoardColumn
                            key={list.id}
                            list={list}
                            allTasks={scheduleTasks}
                            copy={copy}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDeleteList={() => deleteList(activeBoard.id as string, list.id as string)}
                        />
                    ))}

                    {/* Add new list button/form */}
                    <div className="w-[300px] shrink-0">
                        {isCreatingList ? (
                            <div className="rounded-xl border-[3px] border-black bg-white p-3">
                                <input
                                    type="text"
                                    className="w-full bg-transparent p-2 text-black font-bold outline-none placeholder:text-black/30"
                                    placeholder={copy.listName}
                                    value={newListTitle}
                                    onChange={(e) => setNewListTitle(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
                                />
                                <div className="mt-2 flex gap-2">
                                    <Button onClick={handleCreateList} variant="primary" className="flex-1 py-1 text-xs">
                                        {copy.addList}
                                    </Button>
                                    <Button onClick={() => setIsCreatingList(false)} variant="ghost" className="px-2">
                                        X
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsCreatingList(true)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-4 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                                <span className="font-bold uppercase tracking-widest text-sm">{copy.addList}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
