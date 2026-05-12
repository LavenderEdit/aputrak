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

    // Cargar Ajustes Globales
    useEffect(() => {
        const loadSettings = async () => {
            const savedSettings = await DB.get('settings', 'global');
            if (savedSettings) setSettings(savedSettings);
        };
        loadSettings();
    }, []);

    // Cargar Actividades de la Semana
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

    const smartReschedule = async () => {
        const now = new Date();
        const currentDayIdx = now.getDay();
        const currentHour = now.getHours();

        const newActivities = { ...activities };
        const tasksToMove: { text: string, color: string }[] = [];

        for (const [key, value] of Object.entries(newActivities)) {
            const [dayStr, hourStr] = key.split('-');
            const day = parseInt(dayStr);
            const hour = parseInt(hourStr);

            const isPast = day < currentDayIdx || (day === currentDayIdx && hour < currentHour);

            if (isPast && value && value.startsWith("{")) {
                try {
                    const parsed = JSON.parse(value);
                    const taskLines = parsed.text.split('\n').filter((t: string) => t.trim() !== "");
                    const completed = parsed.completed || [];

                    let hasChanges = false;
                    const remainingTasks: string[] = [];
                    const remainingCompleted: boolean[] = [];

                    taskLines.forEach((task: string, idx: number) => {
                        if (completed[idx]) {
                            remainingTasks.push(task);
                            remainingCompleted.push(true);
                        } else {
                            tasksToMove.push({ text: task, color: parsed.color || 'indigo' });
                            hasChanges = true;
                        }
                    });

                    if (hasChanges) {
                        if (remainingTasks.length === 0) {
                            delete newActivities[key];
                        } else {
                            newActivities[key] = JSON.stringify({
                                text: remainingTasks.join('\n'),
                                color: parsed.color,
                                completed: remainingCompleted
                            });
                        }
                    }
                } catch (e) { }
            }
        }

        if (tasksToMove.length === 0) return { success: false, reason: 'no-tasks' };

        const emptySlots: string[] = [];
        const futureDays = settings.activeDays.filter(d => d >= currentDayIdx).sort();

        for (const day of futureDays) {
            for (let hour = settings.startHour; hour < settings.endHour; hour++) {
                if (day === currentDayIdx && hour <= currentHour) continue;

                const key = `${day}-${hour}`;
                if (!newActivities[key]) {
                    emptySlots.push(key);
                }
            }
        }

        if (emptySlots.length < tasksToMove.length) return { success: false, reason: 'no-space' };

        tasksToMove.forEach((taskObj, idx) => {
            const slotKey = emptySlots[idx];
            newActivities[slotKey] = JSON.stringify({
                text: taskObj.text,
                color: taskObj.color,
                completed: [false]
            });
        });

        setActivities(newActivities);
        await DB.put('weeks', { id: weekId, data: newActivities });

        return { success: true };
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
        copyPreviousWeek,
        smartReschedule,
        updateSettings,
        changeWeek
    };
};