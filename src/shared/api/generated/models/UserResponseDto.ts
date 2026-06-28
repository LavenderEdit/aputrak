/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserResponseDto = {
    id?: string;
    username?: string;
    name?: string;
    email?: string;
    fullName?: string;
    displayName?: string;
    avatarUrl?: string;
    emailVerified?: boolean;
    subscriptionTier?: 'GUEST' | 'FREE' | 'PRO' | 'ENTERPRISE';
    systemRole?: 'ROLE_USER' | 'ROLE_ADMIN';
    experience?: number;
    pomodorosCompleted?: number;
    currentStreak?: number;
    longestStreak?: number;
    isGuest?: boolean;
};

