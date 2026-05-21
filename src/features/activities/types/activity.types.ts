export type ActivityStatus = "pending" | "completed" | "overdue";

export type ActivityPriority = "none" | "low" | "medium" | "high";

export interface ActivitySubtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Activity {
    id: string;
    title: string;
    description: string;
    tagId: string;
    date: string;
    startTime: string;
    endTime: string;
    color: string;
    status: ActivityStatus;
    priority: ActivityPriority;
    subtasks: ActivitySubtask[];
}