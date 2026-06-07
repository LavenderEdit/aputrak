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
                "w-full border-2 bg-white px-4 py-3 text-sm font-bold text-black outline-none transition",
                error
                    ? "border-red-500"
                    : "border-black focus:border-black focus:shadow-[3px_3px_0_#000]",
                "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
                className,
            )}
            {...props}
        >
            {children}
        </select>
    );
}