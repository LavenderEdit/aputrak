"use client";

import { useEffect } from "react";
import { SyncManager } from "@/shared/lib/sync";
// Import to initialize API client configuration
import "@/shared/api/client";

export function SyncProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initial sync when the app loads
        if (navigator.onLine) {
            SyncManager.pushMutations().catch(console.error);
            SyncManager.pullUpdates().catch(console.error);
        }

        // Set up intervals to sync every 30 seconds
        const syncInterval = setInterval(() => {
            if (navigator.onLine) {
                SyncManager.pushMutations().catch(console.error);
                SyncManager.pullUpdates().catch(console.error);
            }
        }, 30000);

        // Listen for online events to sync immediately
        const handleOnline = () => {
            SyncManager.pushMutations().catch(console.error);
            SyncManager.pullUpdates().catch(console.error);
        };

        window.addEventListener("online", handleOnline);

        return () => {
            clearInterval(syncInterval);
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    return <>{children}</>;
}
