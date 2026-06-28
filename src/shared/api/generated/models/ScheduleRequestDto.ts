/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ScheduleRequestDto = {
    title: string;
    notes?: string;
    startTime: string;
    endTime: string;
    colorTheme?: string;
    activityType?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    linkedTaskId?: string;
    endTimeValid?: boolean;
};

