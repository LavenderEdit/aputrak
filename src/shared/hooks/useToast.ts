"use client";

import type { ReactNode } from "react";
import { sileo } from "sileo";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
    title: string;
    description?: ReactNode | string;
}

export interface PromiseToastMessages<T = unknown> {
    loading: ToastMessage;
    success: ToastMessage | ((data: T) => ToastMessage);
    error: ToastMessage | ((error: unknown) => ToastMessage);
}

export function useToast() {
    const showToast = (
        message: string,
        type: ToastType = "success",
        description?: ReactNode | string,
    ) => {
        sileo[type]({
            title: message,
            description,
        });
    };

    const showPromiseToast = <T,>(
        promise: Promise<T>,
        messages: PromiseToastMessages<T>,
    ) => {
        return sileo.promise(promise, messages);
    };

    return {
        showToast,
        showPromiseToast,
    };
}