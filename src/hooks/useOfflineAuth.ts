"use client";
import { useState, useEffect } from 'react';
import { DB } from '../lib/db';

export const useOfflineAuth = () => {
    const [profile, setProfile] = useState<{ id: string, username: string } | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = await DB.get('profile', 'current_user');
                if (user) setProfile(user);
            } catch (e) {
                console.error("Error loading profile", e);
            } finally {
                setLoadingAuth(false);
            }
        };
        loadProfile();
    }, []);

    const saveUsername = async (username: string) => {
        const newProfile = { id: 'current_user', username };
        await DB.put('profile', newProfile);
        setProfile(newProfile);
    };

    return { profile, saveUsername, loadingAuth };
};
