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
        message: string | ToastMessage,
        type: ToastType = "success",
        description?: ReactNode | string,
    ) => {
        const options =
            typeof message === "string"
                ? { title: message, description }
                : message;

        sileo[type](options);
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