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
        "bg-slate-900 text-white shadow-sm hover:bg-black hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:bg-slate-950",
    secondary:
        "border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:text-black hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 active:bg-slate-100",
    ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-black",
    danger:
        "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 active:bg-red-800",
};

const sizes: Record<ButtonSize, string> = {
    sm: "px-3.5 py-2 text-xs rounded-lg",
    md: "px-4.5 py-2.5 text-sm rounded-xl",
    lg: "px-5.5 py-3 text-sm rounded-xl",
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
                "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-[0.06em] transition-all duration-200 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none",
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