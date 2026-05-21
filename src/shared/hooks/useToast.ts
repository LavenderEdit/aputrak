"use client";

import { sileo } from "sileo";

export type ToastType = "success" | "error" | "warning" | "info";

export function useToast() {
    const showToast = (message: string, type: ToastType = "success") => {
        sileo[type]({
            title: message,
        });
    };

    return {
        showToast,
    };
}