"use client";

import { Toaster } from "sileo";

interface SileoProviderProps {
    children: React.ReactNode;
}

export function SileoProvider({ children }: SileoProviderProps) {
    return (
        <>
            <Toaster
                position="bottom-right"
                theme="light"
                offset={{ top: 20, right: 20 }}
                options={{
                    duration: 4500,
                    roundness: 16,
                    fill: "#ffffff",
                }}
            />
            {children}
        </>
    );
}