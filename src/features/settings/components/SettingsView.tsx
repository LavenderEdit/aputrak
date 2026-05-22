"use client";

import { useState } from "react";
import {
    Bell,
    CalendarClock,
    Clock3,
    Database,
    Globe2,
    UserRound,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { DAYS_OF_WEEK, DEFAULT_SETTINGS } from "@/shared/lib/constants";
import { Utils } from "@/shared/lib/utils";
import type { ScheduleSettings } from "@/features/schedule/types/schedule.types";

interface SettingsViewProps {
    lang: string;
    username: string;
    settings: ScheduleSettings;
    updateSettings: (settings: ScheduleSettings) => Promise<void> | void;
    getDayName: (index: number) => string;
    onUpdateUsername: (username: string) => Promise<void> | void;
    onToggleLanguage: () => void;
}

export function SettingsView({
    lang,
    username,
    settings,
    updateSettings,
    getDayName,
    onUpdateUsername,
    onToggleLanguage,
}: SettingsViewProps) {
    const [usernameDraft, setUsernameDraft] = useState(username);

    const copy = {
        title: lang === "es" ? "Ajustes" : "Settings",
        subtitle:
            lang === "es"
                ? "Personaliza tu perfil, idioma, semana y horario activo."
                : "Customize your profile, language, week, and active hours.",
        profile: lang === "es" ? "Perfil" : "Profile",
        username: lang === "es" ? "Nombre de usuario" : "Username",
        saveUsername: lang === "es" ? "Guardar nombre" : "Save name",
        schedule: lang === "es" ? "Horario" : "Schedule",
        activeDays: lang === "es" ? "Días activos" : "Active days",
        startHour: lang === "es" ? "Hora de inicio" : "Start hour",
        endHour: lang === "es" ? "Hora de fin" : "End hour",
        preferences: lang === "es" ? "Preferencias" : "Preferences",
        language: lang === "es" ? "Idioma" : "Language",
        currentLanguage: lang === "es" ? "Idioma actual" : "Current language",
        changeLanguage: lang === "es" ? "Cambiar a inglés" : "Switch to Spanish",
        notifications: lang === "es" ? "Recordatorios" : "Reminders",
        notificationsDesc:
            lang === "es"
                ? "Próximamente: notificaciones antes de cada actividad."
                : "Coming soon: notifications before each activity.",
        storage: lang === "es" ? "Datos locales" : "Local data",
        storageDesc:
            lang === "es"
                ? "Tus datos se guardan en este navegador usando almacenamiento local."
                : "Your data is stored in this browser using local storage.",
        resetDefaults:
            lang === "es" ? "Restaurar horario base" : "Restore default schedule",
    };

    const toggleDay = (index: number) => {
        let nextDays = [...settings.activeDays];

        if (nextDays.includes(index)) {
            if (nextDays.length === 1) return;
            nextDays = nextDays.filter((day) => day !== index);
        } else {
            nextDays.push(index);
            nextDays.sort((a, b) => a - b);
        }

        updateSettings({
            ...settings,
            activeDays: nextDays,
        });
    };

    const handleHourChange = (type: "start" | "end", value: string) => {
        let nextStart = type === "start" ? Number(value) : settings.startHour;
        let nextEnd = type === "end" ? Number(value) : settings.endHour;

        if (nextStart >= nextEnd) {
            if (type === "start") {
                nextStart = Math.max(0, nextEnd - 1);
            } else {
                nextEnd = Math.min(24, nextStart + 1);
            }
        }

        updateSettings({
            ...settings,
            startHour: nextStart,
            endHour: nextEnd,
        });
    };

    const handleUsernameSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const cleanUsername = usernameDraft.trim();

        if (!cleanUsername) return;

        await onUpdateUsername(cleanUsername);
        setUsernameDraft(cleanUsername);
    };

    return (
        <div className="mx-auto max-w-3xl p-4 fade-in sm:p-6 lg:p-8">
            <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-slate-950">
                    {copy.title}
                </h2>

                <p className="mt-1 text-sm text-muted">{copy.subtitle}</p>
            </div>

            <div className="space-y-5">
                <section className="rounded-xl border border-sborder bg-white p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                            <UserRound size={20} />
                        </div>

                        <div>
                            <h3 className="font-display text-base font-bold text-slate-950">
                                {copy.profile}
                            </h3>

                            <p className="text-xs text-muted">{username}</p>
                        </div>
                    </div>

                    <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-medium text-slate-800">
                                {copy.username}
                            </label>

                            <input
                                value={usernameDraft}
                                onChange={(event) => setUsernameDraft(event.target.value)}
                                className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                                required
                            />
                        </div>

                        <div className="flex items-end">
                            <Button type="submit" className="w-full sm:w-auto">
                                {copy.saveUsername}
                            </Button>
                        </div>
                    </form>
                </section>

                <section className="rounded-xl border border-sborder bg-white p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                            <CalendarClock size={20} />
                        </div>

                        <div>
                            <h3 className="font-display text-base font-bold text-slate-950">
                                {copy.schedule}
                            </h3>

                            <p className="text-xs text-muted">
                                {settings.activeDays.length} {copy.activeDays.toLowerCase()}
                            </p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-slate-800">
                            {copy.activeDays}
                        </label>

                        <div className="flex flex-wrap gap-2">
                            {DAYS_OF_WEEK.map((_, index) => {
                                const active = settings.activeDays.includes(index);

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => toggleDay(index)}
                                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${active
                                            ? "border-primary bg-indigo-50 text-primary"
                                            : "border-sborder bg-white text-muted hover:bg-hover"
                                            }`}
                                    >
                                        {getDayName(index).slice(0, 3)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                                <Clock3 size={15} />
                                {copy.startHour}
                            </label>

                            <select
                                value={settings.startHour}
                                onChange={(event) =>
                                    handleHourChange("start", event.target.value)
                                }
                                className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                            >
                                {Array.from({ length: 24 }, (_, index) => (
                                    <option key={index} value={index}>
                                        {Utils.formatTime(index)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                                <Clock3 size={15} />
                                {copy.endHour}
                            </label>

                            <select
                                value={settings.endHour}
                                onChange={(event) =>
                                    handleHourChange("end", event.target.value)
                                }
                                className="w-full rounded-xl border border-sborder bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                            >
                                {Array.from({ length: 25 }, (_, index) => (
                                    <option key={index} value={index}>
                                        {Utils.formatTime(index)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-sborder bg-white p-5">
                    <h3 className="font-display mb-4 text-base font-bold text-slate-950">
                        {copy.preferences}
                    </h3>

                    <div className="space-y-3">
                        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <Globe2 size={18} className="text-primary" />

                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {copy.language}
                                    </p>
                                    <p className="text-xs text-muted">
                                        {copy.currentLanguage}: {lang.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <Button variant="secondary" onClick={onToggleLanguage}>
                                {copy.changeLanguage}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                            <div className="flex items-center gap-3">
                                <Bell size={18} className="text-accent" />

                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {copy.notifications}
                                    </p>
                                    <p className="text-xs text-muted">{copy.notificationsDesc}</p>
                                </div>
                            </div>

                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                Soon
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                            <div className="flex items-center gap-3">
                                <Database size={18} className="text-secondary" />

                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {copy.storage}
                                    </p>
                                    <p className="text-xs text-muted">{copy.storageDesc}</p>
                                </div>
                            </div>

                            <span className="status-dot bg-success" />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-sborder bg-white p-5">
                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => updateSettings(DEFAULT_SETTINGS)}
                    >
                        {copy.resetDefaults}
                    </Button>
                </section>
            </div>
        </div>
    );
}