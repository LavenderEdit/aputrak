import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface CardProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    muted?: boolean;
}

export function Card({ children, className, muted = false, ...props }: CardProps) {
    return (
        <article
            className={cn(
                "rounded-2xl border border-slate-200/60 p-5 shadow-sm transition-all duration-200",
                muted ? "bg-[#F5F0E6] dark:bg-[#0a1628]" : "bg-[#FFFCF4] dark:bg-[#111827]",
                className,
            )}
            {...props}
        >
            {children}
        </article>
    );
}