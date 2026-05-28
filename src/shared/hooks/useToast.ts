"use client";

import type { ReactNode } from "react";
import { sileo } from "sileo";

export type ToastType = "success" | "error" | "warning" | "info";

type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

export interface ToastStyles {
    title?: string;
    description?: string;
    badge?: string;
    button?: string;
}

export interface ToastButton {
    title: string;
    onClick: () => void;
}

export interface ToastMessage {
    title: string;
    description?: ReactNode | string;
    position?: ToastPosition;
    duration?: number | null;
    autopilot?: boolean | object;
    fill?: string;
    roundness?: number;
    icon?: ReactNode | null;
    styles?: ToastStyles;
    button?: ToastButton;
}

export interface PromiseToastMessages<T = unknown> {
    loading: ToastMessage;
    success: ToastMessage | ((data: T) => ToastMessage);
    error: ToastMessage | ((error: unknown) => ToastMessage);
}

const TOAST_AUTOPILOT = {
    expand: 0,
    collapse: 5000,
};

function getResponsiveToastPosition(): ToastPosition {
    if (typeof window === "undefined") return "top-right";

    return window.matchMedia("(max-width: 768px)").matches
        ? "top-center"
        : "top-right";
}

const withToastDefaults = (message: ToastMessage): ToastMessage => ({
    position: message.position ?? getResponsiveToastPosition(),
    duration: 7000,
    autopilot: TOAST_AUTOPILOT,
    roundness: 18,
    styles: {
        description: "block! opacity-100! text-slate-500!",
        ...message.styles,
    },
    ...message,
});

const resolvePromiseMessage = <T,>(
    message: ToastMessage | ((data: T) => ToastMessage),
) => {
    if (typeof message === "function") {
        return (data: T) => withToastDefaults(message(data));
    }

    return withToastDefaults(message);
};

export function useToast() {
    const showToast = (
        message: string | ToastMessage,
        type: ToastType = "success",
        description?: ReactNode | string,
    ) => {
        const options =
            typeof message === "string"
                ? withToastDefaults({ title: message, description })
                : withToastDefaults(message);

        sileo[type](options);
    };

    const showPromiseToast = <T,>(
        promise: Promise<T>,
        messages: PromiseToastMessages<T>,
    ) => {
        const position = getResponsiveToastPosition();

        return sileo.promise(promise, {
            position,
            loading: withToastDefaults({
                ...messages.loading,
                position: messages.loading.position ?? position,
            }),
            success: resolvePromiseMessage(messages.success),
            error: resolvePromiseMessage(messages.error),
        });
    };

    return {
        showToast,
        showPromiseToast,
    };
}