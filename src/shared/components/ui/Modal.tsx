"use client";

import type { ReactNode } from "react";
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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={cn(
                    "w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200",
                    className,
                )}
            >
                {title && (
                    <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
                        <h3 className="text-lg font-bold text-white">{title}</h3>

                        <button
                            onClick={onClose}
                            className="text-slate-300 transition hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}