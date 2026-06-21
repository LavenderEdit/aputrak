"use client";

import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
    return (
        <textarea
            className={cn(
                "w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-black outline-none transition-all duration-200",
                error
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-200/80 focus:border-slate-800 focus:shadow-sm focus:bg-slate-50/10",
                "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
                className,
            )}
            {...props}
        />
    );
}