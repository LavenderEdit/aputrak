/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskRequestDto = {
    title: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    position?: number;
    dueDate?: string;
    tagIds?: Array<string>;
    boardListId?: string;
};

