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
    collapse: 5200,
};

const TOAST_FILL: Record<ToastType, string> = {
    success: "#FFFCF4",
    error: "#FEE2E2",
    warning: "#FFF3C4",
    info: "#FFFCF4",
};

const TOAST_STYLES: ToastStyles = {
    title: "text-black! font-black! uppercase! tracking-[0.06em]!",
    description: "block! opacity-100! text-slate-700! font-bold!",
    badge: "border-2! border-black! bg-white! text-black! font-black!",
    button: "border-2! border-black! bg-black! text-white! font-black! rounded-none!",
};

function getResponsiveToastPosition(): ToastPosition {
    if (typeof window === "undefined") return "top-right";

    return window.matchMedia("(max-width: 768px)").matches
        ? "top-center"
        : "top-right";
}

function getToastDefaults(
    message: ToastMessage,
    type: ToastType = "info",
): ToastMessage {
    return {
        position: message.position ?? getResponsiveToastPosition(),
        duration: message.duration ?? 6500,
        autopilot: message.autopilot ?? TOAST_AUTOPILOT,
        roundness: 0,
        fill: message.fill ?? TOAST_FILL[type],
        styles: {
            ...TOAST_STYLES,
            ...message.styles,
        },
        ...message,
    };
}

const resolvePromiseMessage = <T,>(
    message: ToastMessage | ((data: T) => ToastMessage),
    type: ToastType,
) => {
    if (typeof message === "function") {
        return (data: T) => getToastDefaults(message(data), type);
    }

    return getToastDefaults(message, type);
};

export function useToast() {
    const showToast = (
        message: string | ToastMessage,
        type: ToastType = "success",
        description?: ReactNode | string,
    ) => {
        const options =
            typeof message === "string"
                ? getToastDefaults({ title: message, description }, type)
                : getToastDefaults(message, type);

        sileo[type](options);
    };

    const showPromiseToast = <T,>(
        promise: Promise<T>,
        messages: PromiseToastMessages<T>,
    ) => {
        const position = getResponsiveToastPosition();

        return sileo.promise(promise, {
            position,
            loading: getToastDefaults(
                {
                    ...messages.loading,
                    position: messages.loading.position ?? position,
                },
                "info",
            ),
            success: resolvePromiseMessage(messages.success, "success"),
            error: resolvePromiseMessage(messages.error, "error"),
        });
    };

    return {
        showToast,
        showPromiseToast,
    };
}