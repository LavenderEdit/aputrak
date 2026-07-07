"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface SelectOption {
    label: ReactNode;
    value: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    className?: string;
    placeholder?: ReactNode;
    emptyMessage?: string;
}

export function Select({ value, onChange, options, className, placeholder, emptyMessage = "No options" }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-xl border-[3px] border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.06em] text-black shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#000] transition-all dark:border-white/10 dark:bg-[#111827] dark:text-white dark:shadow-[3px_3px_0_rgba(0,0,0,0.5)]"
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} strokeWidth={3} className="ml-2 shrink-0" />
            </button>
            
            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] dark:border-white/10 dark:bg-[#111827] dark:shadow-[4px_4px_0_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="max-h-[300px] w-full overflow-y-auto custom-scrollbar">
                        {options.length === 0 ? (
                            <div className="p-3 text-xs font-bold text-black/50 dark:text-white/50">{emptyMessage}</div>
                        ) : (
                            options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "block w-full border-b-[2px] border-black/10 dark:border-white/5 px-4 py-3 text-left text-sm font-bold transition-colors hover:bg-[#F5F0E6] dark:hover:bg-white/5 last:border-b-0",
                                        value === opt.value ? "bg-black text-white dark:bg-white/10" : "text-black dark:text-white"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}