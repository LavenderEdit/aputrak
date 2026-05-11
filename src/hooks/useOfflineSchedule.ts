"use client";
import { useState, useEffect } from 'react';
import { DB } from '../lib/db';
import { Utils } from '../lib/utils';
import { DEFAULT_SETTINGS } from '../lib/constants';

export const useOfflineSchedule = () => {
    const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
    const weekId = Utils.getWeekStartIdentifier(currentWeekDate);

    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [activities, setActivities] = useState<Record<string, string>>({});
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            const savedSettings = await DB.get('settings', 'global');
            if (savedSettings) setSettings(savedSettings);
        };
        loadSettings();
    }, []);

    useEffect(() => {
        const loadWeek = async () => {
            setLoadingData(true);
            const weekData = await DB.get('weeks', weekId);
            setActivities(weekData ? weekData.data : {});
            setLoadingData(false);
        };
        loadWeek();
    }, [weekId]);

    const saveActivity = async (day: number, hour: number, text: string) => {
        const key = `${day}-${hour}`;
        const newActivities = { ...activities };

        if (!text || text.trim() === '') delete newActivities[key];
        else newActivities[key] = text;

        setActivities(newActivities);
        await DB.put('weeks', { id: weekId, data: newActivities });
    };

    const moveActivity = async (fromDay: number, fromHour: number, toDay: number, toHour: number) => {
        const sourceKey = `${fromDay}-${fromHour}`;
        const targetKey = `${toDay}-${toHour}`;

        const sourceText = activities[sourceKey] || '';
        const targetText = activities[targetKey] || '';

        const newActivities = { ...activities };

        if (!sourceText || sourceText.trim() === '') {
            delete newActivities[targetKey];
        } else {
            newActivities[targetKey] = sourceText;
        }

        if (!targetText || targetText.trim() === '') {
            delete newActivities[sourceKey];
        } else {
            newActivities[sourceKey] = targetText;
        }

        setActivities(newActivities);

        await DB.put('weeks', { id: weekId, data: newActivities });
    };

    const updateSettings = async (newSettings: any) => {
        setSettings(newSettings);
        await DB.put('settings', { id: 'global', ...newSettings });
    };

    const changeWeek = (direction: number) => {
        const newDate = new Date(currentWeekDate);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentWeekDate(newDate);
    };

    return {
        weekId,
        settings,
        activities,
        loadingData,
        saveActivity,
        moveActivity,
        updateSettings,
        changeWeek
    };
};