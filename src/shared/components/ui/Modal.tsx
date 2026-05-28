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
            className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={handleDialogClick}
                className={cn(
                    "w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl",
                    "max-h-[calc(100vh-2rem)] overflow-y-auto",
                    "animate-in fade-in zoom-in-95 duration-200",
                    className,
                )}
            >
                {title && (
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sborder bg-white px-5 py-4">
                        <h3 className="font-display text-lg font-bold text-slate-950">
                            {title}
                        </h3>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {children}
            </div>
        </div>,
        document.body,
    );
}