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
                "w-full resize-none border-2 bg-white px-4 py-3 text-sm font-semibold text-black outline-none transition",
                error
                    ? "border-red-500"
                    : "border-black focus:border-black focus:shadow-[3px_3px_0_#000]",
                "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
                className,
            )}
            {...props}
        />
    );
}