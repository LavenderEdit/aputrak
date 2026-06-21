"use client";

import type { SelectHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}

export function Select({ className, error, children, ...props }: SelectProps) {
    return (
        <select
            className={cn(
                "w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-black outline-none transition-all duration-200",
                error
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200/80 focus:border-slate-800 focus:shadow-sm focus:bg-slate-50/10",
                "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
                className,
            )}
            {...props}
        >
            {children}
        </select>
    );
}