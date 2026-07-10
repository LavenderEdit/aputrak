"use client";

import { useEffect, useState } from "react";
import { DB } from "@/shared/lib/db";
import { SyncManager } from "@/shared/lib/sync";

interface UserProfile {
    id: string;
    username: string;
    backendId?: string;
    avatarUrl?: string;
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

                    const token = localStorage.getItem("token");
                    if (token) {
                        try {
                            const { authApi } = await import('@/features/auth/api/auth.api');
                            const res = await authApi.profile();
                            const serverUser = (res as any)?.user || res;
                            if (serverUser?.avatarUrl && serverUser.avatarUrl !== user.avatarUrl) {
                                const updated: UserProfile = { ...user, avatarUrl: serverUser.avatarUrl };
                                await DB.put("profile", updated);
                                setProfile(updated);
                            }
                        } catch {
                            // Token may be expired or server unavailable — silent fail
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading profile", error);
            } finally {
                setLoadingAuth(false);
            }
        };

        loadProfile();
    }, []);

    const handleAuthSuccess = async (token: string, user: { id: string, username: string, avatarUrl?: string }, refreshToken?: string) => {
        localStorage.setItem("token", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        const newProfile: UserProfile = {
            id: "current_user",
            username: user.username,
            backendId: user.id,
            avatarUrl: user.avatarUrl
        };
        await DB.put("profile", newProfile);
        setProfile(newProfile);
        await SyncManager.queueMutation('profile', user.id, 'UPDATE', newProfile);
    };

    const login = async (data: any) => {
        const { authApi } = await import('@/features/auth/api/auth.api');
        const payload = {
            identifier: data.email,
            password: data.password
        };
        const response = await authApi.login(payload);
        if (response.access_token && response.user) {
            await handleAuthSuccess(response.access_token, {
                id: response.user.id || "",
                username: response.user.username || response.user.email?.split('@')[0] || "User",
                avatarUrl: response.user.avatarUrl
            }, response.refresh_token);
        }
    };

    const register = async (data: any) => {
        const { authApi } = await import('@/features/auth/api/auth.api');
        await authApi.register(data);
        await login({ email: data.email, password: data.password });
    };

    const saveUsername = async (username: string) => {
        const newProfile: UserProfile = {
            id: "current_user",
            username,
            backendId: profile?.backendId,
            avatarUrl: profile?.avatarUrl
        };

        await DB.put("profile", newProfile);
        setProfile(newProfile);
        await SyncManager.queueMutation('profile', profile?.backendId || 'current_user', 'UPDATE', newProfile);
    };

    const saveAvatar = async (avatarUrl: string) => {
        const newProfile: UserProfile = {
            id: "current_user",
            username: profile?.username || "",
            backendId: profile?.backendId,
            avatarUrl
        };

        await DB.put("profile", newProfile);
        setProfile(newProfile);
        await SyncManager.queueMutation('profile', profile?.backendId || 'current_user', 'UPDATE', newProfile);

        try {
            const { UserControllerService } = await import('@/shared/api/generated');
            await UserControllerService.updateAvatar({ avatarUrl });
        } catch (error) {
            console.error("Error updating avatar on server:", error);
        }
    };

    const logout = async () => {
        try {
            const { authApi } = await import('@/features/auth/api/auth.api');
            await authApi.logout();
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            await DB.delete("profile", "current_user");
            setProfile(null);
            window.location.reload();
        }
    };

    return {
        profile,
        login,
        register,
        saveUsername,
        saveAvatar,
        logout,
        loadingAuth,
    };
};
