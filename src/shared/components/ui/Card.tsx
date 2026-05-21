import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface CardProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <article
            className={cn(
                "rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl",
                className,
            )}
            {...props}
        >
            {children}
        </article>
    );
}