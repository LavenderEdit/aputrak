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
                    "w-full max-w-md overflow-hidden border-[3px] border-black bg-[#FFFCF4] shadow-[8px_8px_0_#000]",
                    "max-h-[calc(100vh-2rem)] overflow-y-auto",
                    className,
                )}
            >
                {title && (
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b-[3px] border-black bg-[#FFFCF4] px-5 py-4">
                        <h3 className="font-display text-lg font-black uppercase tracking-[0.08em] text-black">
                            {title}
                        </h3>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center border-2 border-black bg-white text-black transition hover:bg-black hover:text-white"
                            aria-label="Close"
                        >
                            <X size={18} strokeWidth={3} />
                        </button>
                    </div>
                )}

                {children}
            </div>
        </div>,
        document.body,
    );
}