"use client";

import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface ModalProps {
    isOpen: boolean;
    title?: string;
    children: ReactNode;
    onClose: () => void;
    className?: string;
}

export function Modal({
    isOpen,
    title,
    children,
    onClose,
    className,
}: ModalProps) {
    if (!isOpen || typeof document === "undefined") return null;

    const handleDialogClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={handleDialogClick}
                className={cn(
                    "w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-[#FFFCF4] shadow-2xl",
                    "max-h-[calc(100vh-2rem)] overflow-y-auto transition-all duration-200",
                    className,
                )}
            >
                {title && (
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/60 bg-[#FFFCF4] px-5 py-4">
                        <h3 className="font-display text-lg font-bold uppercase tracking-[0.06em] text-black">
                            {title}
                        </h3>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-black hover:border-slate-300"
                            aria-label="Close"
                        >
                            <X size={18} strokeWidth={2} />
                        </button>
                    </div>
                )}

                {children}
            </div>
        </div>,
        document.body,
    );
}