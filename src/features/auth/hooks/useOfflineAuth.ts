"use client";

import { useEffect, useState } from "react";
import { DB } from "@/shared/lib/db";

interface UserProfile {
    id: string;
    username: string;
}

export const useOfflineAuth = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = await DB.get<UserProfile>("profile", "current_user");

                if (user) {
                    setProfile(user);
                }
            } catch (error) {
                console.error("Error loading profile", error);
            } finally {
                setLoadingAuth(false);
            }
        };

        loadProfile();
    }, []);

    const saveUsername = async (username: string) => {
        const newProfile: UserProfile = {
            id: "current_user",
            username,
        };

        await DB.put("profile", newProfile);
        setProfile(newProfile);
    };

    return {
        profile,
        saveUsername,
        loadingAuth,
    };
};