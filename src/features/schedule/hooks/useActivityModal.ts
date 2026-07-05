"use client";

import { useState } from "react";
import type {
    ActivityModalState,
    ScheduleTask,
} from "@/features/schedule/types/schedule.types";

function getTodayDayIndex(): number {
    const jsDay = new Date().getDay();
    return (jsDay + 6) % 7;
}

export function useActivityModal(firstActiveDay: number, startHour: number) {
    const [modalState, setModalState] = useState<ActivityModalState>({
        isOpen: false,
        day: firstActiveDay,
        taskToEdit: null,
    });

    const openCreateModal = (day?: number, defaultStartMin?: number) => {
        setModalState({
            isOpen: true,
            day: day ?? getTodayDayIndex(),
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