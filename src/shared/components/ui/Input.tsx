"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "w-full border-2 bg-white px-4 py-3 text-sm font-semibold text-black outline-none transition",
                    error
                        ? "border-red-500"
                        : "border-black focus:border-black focus:shadow-[3px_3px_0_#000]",
                    "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
                    className,
                )}
                {...props}
            />
        );
    },
);

Input.displayName = "Input";