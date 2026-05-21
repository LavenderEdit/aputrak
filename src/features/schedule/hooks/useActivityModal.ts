"use client";

import { useState } from "react";
import type {
    ActivityModalState,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";

export function useActivityModal(firstActiveDay: number, startHour: number) {
    const [modalState, setModalState] = useState<ActivityModalState>({
        isOpen: false,
        day: firstActiveDay,
        taskToEdit: null,
    });

    const openCreateModal = (day = firstActiveDay, defaultStartMin?: number) => {
        setModalState({
            isOpen: true,
            day,
            taskToEdit: null,
            defaultStartMin: defaultStartMin ?? startHour * 60,
        });
    };

    const openEditModal = (task: ScheduleTask) => {
        setModalState({
            isOpen: true,
            day: task.day,
            taskToEdit: task,
        });
    };

    const closeModal = () => {
        setModalState((current) => ({
            ...current,
            isOpen: false,
        }));
    };

    return {
        modalState,
        openCreateModal,
        openEditModal,
        closeModal,
    };
}