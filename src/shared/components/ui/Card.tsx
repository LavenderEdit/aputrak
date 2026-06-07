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
                "border-[3px] border-black p-5 shadow-[6px_6px_0_#000]",
                muted ? "bg-[#F5F0E6]" : "bg-[#FFFCF4]",
                className,
            )}
            {...props}
        >
            {children}
        </article>
    );
}