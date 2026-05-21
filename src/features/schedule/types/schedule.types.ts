export interface ScheduleSettings {
    startHour: number;
    endHour: number;
    activeDays: number[];
}

export interface ScheduleTask {
    id: string;
    day: number;
    startMinute: number;
    endMinute: number;
    text: string;
    color: string;
    completed: boolean[];
}

export interface ActivityModalState {
    isOpen: boolean;
    day: number;
    taskToEdit: ScheduleTask | null;
    defaultStartMin?: number;
}