"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
    primary:
        "border-2 border-black bg-black text-white shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#000]",
    secondary:
        "border-2 border-black bg-white text-black shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[6px_6px_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#000]",
    ghost:
        "border-2 border-transparent bg-transparent text-slate-700 hover:border-black hover:bg-white hover:text-black",
    danger:
        "border-2 border-black bg-red-600 text-white shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[6px_6px_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#000]",
};

const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                "inline-flex items-center justify-center gap-2 font-black uppercase tracking-[0.08em] transition disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none",
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}