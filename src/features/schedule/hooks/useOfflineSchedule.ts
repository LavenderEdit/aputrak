"use client";

import { useEffect, useState } from "react";
import { DB } from "@/shared/lib/db";
import { Utils } from "@/shared/lib/utils";
import { DEFAULT_SETTINGS } from "@/shared/lib/constants";

export interface ScheduleTask {
    id: string;
    day: number;
    startMinute: number;
    endMinute: number;
    text: string;
    color: string;
    completed: boolean[];
}

export const useOfflineSchedule = () => {
    const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
    const weekId = Utils.getWeekStartIdentifier(currentWeekDate);

    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [tasks, setTasks] = useState<ScheduleTask[]>([]);
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
            let loadedData = weekData ? weekData.data : [];

            if (loadedData && !Array.isArray(loadedData) && Object.keys(loadedData).length > 0) {
                const migratedTasks: ScheduleTask[] = [];
                for (const [key, value] of Object.entries(loadedData)) {
                    const [dayStr, hourStr] = key.split('-');
                    const day = parseInt(dayStr);
                    const hour = parseInt(hourStr);
                    let text = value as string;
                    let color = 'indigo';
                    let completed: boolean[] = [];

                    if (typeof value === 'string' && value.startsWith('{')) {
                        try {
                            const parsed = JSON.parse(value);
                            text = parsed.text; color = parsed.color || 'indigo'; completed = parsed.completed || [];
                        } catch (e) { }
                    }
                    migratedTasks.push({ id: `task_${day}_${hour}_${Date.now()}`, day, startMinute: hour * 60, endMinute: (hour + 1) * 60, text, color, completed });
                }
                loadedData = migratedTasks;
                await DB.put('weeks', { id: weekId, data: loadedData });
            } else if (!Array.isArray(loadedData)) {
                loadedData = [];
            }

            setTasks(loadedData);
            setLoadingData(false);
        };
        loadWeek();
    }, [weekId]);

    const saveTask = async (task: ScheduleTask) => {
        const newTasks = [...tasks];
        const existingIdx = newTasks.findIndex(t => t.id === task.id);

        if (existingIdx >= 0) newTasks[existingIdx] = task;
        else newTasks.push(task);

        setTasks(newTasks);
        await DB.put('weeks', { id: weekId, data: newTasks });
    };

    const deleteTask = async (taskId: string) => {
        const newTasks = tasks.filter(t => t.id !== taskId);
        setTasks(newTasks);
        await DB.put('weeks', { id: weekId, data: newTasks });
    };

    const toggleTaskComplete = async (taskId: string, index: number) => {
        const newTasks = [...tasks];
        const task = newTasks.find(t => t.id === taskId);
        if (task) {
            task.completed[index] = !task.completed[index];
            setTasks(newTasks);
            await DB.put('weeks', { id: weekId, data: newTasks });
        }
    };

    const moveTask = async (taskId: string, targetDay: number, targetHour: number) => {
        const newTasks = [...tasks];
        const taskIdx = newTasks.findIndex(t => t.id === taskId);
        if (taskIdx === -1) return;

        const duration = newTasks[taskIdx].endMinute - newTasks[taskIdx].startMinute;
        newTasks[taskIdx].day = targetDay;
        newTasks[taskIdx].startMinute = targetHour * 60;
        newTasks[taskIdx].endMinute = (targetHour * 60) + duration;

        setTasks(newTasks);
        await DB.put('weeks', { id: weekId, data: newTasks });
    };

    const copyPreviousWeek = async () => {
        try {
            const prevDate = new Date(currentWeekDate);
            prevDate.setDate(prevDate.getDate() - 7);
            const prevWeekId = Utils.getWeekStartIdentifier(prevDate);
            const prevWeekData = await DB.get('weeks', prevWeekId);

            if (prevWeekData && prevWeekData.data && Array.isArray(prevWeekData.data) && prevWeekData.data.length > 0) {
                const clonedTasks = prevWeekData.data.map((t: ScheduleTask) => ({
                    ...t, id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, completed: t.completed.map(() => false)
                }));
                setTasks(clonedTasks);
                await DB.put('weeks', { id: weekId, data: clonedTasks });
                return true;
            }
            return false;
        } catch (error) { return false; }
    };

    const smartReschedule = async () => {
        const now = new Date();
        const jsDay = now.getDay();
        const currentDayIdx = jsDay === 0 ? 6 : jsDay - 1;
        const currentHour = now.getHours();

        const newTasks = [...tasks];
        const tasksToMove: ScheduleTask[] = [];

        for (let i = newTasks.length - 1; i >= 0; i--) {
            const t = newTasks[i];
            if (!settings.activeDays.includes(t.day)) continue;

            const taskHour = Math.floor(t.startMinute / 60);
            const isPast = t.day < currentDayIdx || (t.day === currentDayIdx && taskHour < currentHour);

            if (isPast) {
                const lines = t.text.split('\n').filter(line => line.trim() !== '');
                let someIncomplete = false;
                const remainingLines: string[] = [];
                const remainingCompleted: boolean[] = [];

                lines.forEach((line, idx) => {
                    if (t.completed[idx]) {
                        remainingLines.push(line);
                        remainingCompleted.push(true);
                    } else {
                        someIncomplete = true;
                        tasksToMove.push({
                            id: `task_resched_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                            day: -1, startMinute: -1, endMinute: -1,
                            text: line, color: t.color, completed: [false]
                        });
                    }
                });

                if (someIncomplete) {
                    if (remainingLines.length === 0) newTasks.splice(i, 1);
                    else { newTasks[i].text = remainingLines.join('\n'); newTasks[i].completed = remainingCompleted; }
                }
            }
        }

        if (tasksToMove.length === 0) return { success: false, reason: 'no-tasks' };

        const futureDays = settings.activeDays.filter(d => d >= currentDayIdx).sort();
        const emptySlots: { day: number, startMinute: number, endMinute: number }[] = [];

        for (const day of futureDays) {
            for (let hour = settings.startHour; hour < settings.endHour; hour++) {
                if (day === currentDayIdx && hour <= currentHour) continue;
                const isOccupied = newTasks.some(t => t.day === day && t.startMinute < (hour + 1) * 60 && t.endMinute > hour * 60);
                if (!isOccupied) emptySlots.push({ day, startMinute: hour * 60, endMinute: (hour + 1) * 60 });
            }
        }

        if (emptySlots.length < tasksToMove.length) return { success: false, reason: 'no-space' };

        tasksToMove.forEach((t, idx) => {
            t.day = emptySlots[idx].day; t.startMinute = emptySlots[idx].startMinute; t.endMinute = emptySlots[idx].endMinute;
            newTasks.push(t);
        });

        setTasks(newTasks);
        await DB.put('weeks', { id: weekId, data: newTasks });
        return { success: true };
    };

    const updateSettings = async (newSettings: any) => {
        setSettings(newSettings); await DB.put('settings', { id: 'global', ...newSettings });
    };

    const changeWeek = (direction: number) => {
        const newDate = new Date(currentWeekDate); newDate.setDate(newDate.getDate() + (direction * 7)); setCurrentWeekDate(newDate);
    };

    return {
        weekId, settings, tasks, loadingData,
        saveTask, deleteTask, toggleTaskComplete, moveTask,
        copyPreviousWeek, smartReschedule, updateSettings, changeWeek
    };
};