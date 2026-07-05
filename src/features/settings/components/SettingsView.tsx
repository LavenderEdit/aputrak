"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Bell,
    CalendarClock,
    Clock3,
    Database,
    Globe2,
    LogOut,
    Moon,
    Sun,
    UserRound,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { DAYS_OF_WEEK, DEFAULT_SETTINGS } from "@/shared/lib/constants";
import { Utils } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/cn";
import { sanitizeImageUrl } from "@/shared/lib/sanitize";
import { useTheme } from "@/shared/components/providers/ThemeProvider";
import type { ScheduleSettings } from "@/features/schedule/types/schedule.types";
import { getSettingsCopy } from "../constants/settings.constants";

interface SettingsViewProps {
    lang: string;
    username: string;
    avatarUrl?: string;
    settings: ScheduleSettings;
    updateSettings: (settings: ScheduleSettings) => Promise<void> | void;
    getDayName: (index: number) => string;
    onUpdateUsername: (username: string) => Promise<void> | void;
    onUpdateAvatar: (avatarUrl: string) => Promise<void> | void;
    onLogout: () => void;
    onToggleLanguage: () => void;
}

const START_HOURS = Array.from({ length: 24 }, (_, index) => index);
const END_HOURS = Array.from({ length: 25 }, (_, index) => index);

function SectionIcon({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/70">
            {children}
        </div>
    );
}

function HourPicker({
    label,
    value,
    hours,
    onChange,
}: {
    label: string;
    value: number;
    hours: number[];
    onChange: (hour: number) => void;
}) {
    return (
        <div className="border-[3px] border-black dark:border-white/10 bg-white dark:bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-black dark:text-white">
                    <Clock3 size={16} strokeWidth={3} />
                    {label}
                </label>

                <span className="border-2 border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] px-3 py-1 text-xs font-black text-black dark:text-white">
                    {Utils.formatTime(value)}
                </span>
            </div>

            <div className="bg-[#F5F0E6] dark:bg-[#0a1628] p-2">
                <div className="grid max-h-52 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-6 lg:max-h-44 xl:grid-cols-5">
                    {hours.map((hour) => {
                        const active = value === hour;

                        return (
                            <button
                                key={hour}
                                type="button"
                                onClick={() => onChange(hour)}
                                className={cn(
                                    "border-2 border-black dark:border-white/10 px-2 py-2 text-xs font-black transition",
                                    active
                                        ? "bg-black text-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_rgba(0,0,0,0.5)]"
                                        : "bg-white dark:bg-white/5 text-black dark:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000] dark:hover:shadow-[3px_3px_0_rgba(0,0,0,0.5)]",
                                )}
                            >
                                {Utils.formatTime(hour)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function SettingsView({
    lang,
    username,
    avatarUrl,
    settings,
    updateSettings,
    getDayName,
    onUpdateUsername,
    onUpdateAvatar,
    onLogout,
    onToggleLanguage,
}: SettingsViewProps) {
    const [usernameDraft, setUsernameDraft] = useState(username);
    const [avatarDraft, setAvatarDraft] = useState(avatarUrl || "");
    const copy = getSettingsCopy(lang);
    const { theme, toggleTheme } = useTheme();

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

    const handleHourChange = (type: "start" | "end", value: number) => {
        let nextStart = type === "start" ? value : settings.startHour;
        let nextEnd = type === "end" ? value : settings.endHour;

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
        <div className="mx-auto max-w-4xl p-4 pb-8 fade-in sm:p-6 lg:p-8">
            <div className="mb-6 border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-white/50">
                    Aputrak
                </p>

                <h2 className="font-display text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                    {copy.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-slate-600 dark:text-white/60">
                    {copy.subtitle}
                </p>
            </div>

            <div className="space-y-5">
                <section className="border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                    <div className="mb-5 flex items-center gap-3 pb-4">
                        {avatarUrl ? (
                            <Image
                                src={sanitizeImageUrl(avatarUrl) || avatarUrl}
                                alt={username}
                                width={40}
                                height={40}
                                className="h-10 w-10 shrink-0 rounded-xl object-cover border-2 border-black dark:border-white/10"
                                unoptimized
                            />
                        ) : (
                            <SectionIcon>
                                <UserRound size={20} strokeWidth={3} />
                            </SectionIcon>
                        )}

                        <div className="min-w-0">
                            <h3 className="font-display text-base font-black uppercase tracking-[0.08em] text-black dark:text-white">
                                {copy.profile}
                            </h3>

                            <p className="truncate text-xs font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-white/50">
                                {username}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleUsernameSubmit}
                        className="grid gap-3 sm:grid-cols-[1fr_auto]"
                    >
                        <div>
                            <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black dark:text-white">
                                {copy.username}
                            </label>

                            <Input
                                value={usernameDraft}
                                onChange={(event) =>
                                    setUsernameDraft(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="flex items-end">
                            <Button type="submit" className="w-full sm:w-auto">
                                {copy.saveUsername}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-4">
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black dark:text-white">
                            {lang === "es" ? "URL del Avatar" : "Avatar URL"}
                        </label>

                        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                            <Input
                                value={avatarDraft}
                                onChange={(event) =>
                                    setAvatarDraft(event.target.value)
                                }
                                placeholder="https://..."
                            />

                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full sm:w-auto"
                                    onClick={() => onUpdateAvatar(avatarDraft)}
                                >
                                    {lang === "es" ? "Guardar Avatar" : "Save Avatar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                    <div className="mb-5 flex items-center gap-3 pb-4">
                        <SectionIcon>
                            <CalendarClock size={20} strokeWidth={3} />
                        </SectionIcon>

                        <div className="min-w-0">
                            <h3 className="font-display text-base font-black uppercase tracking-[0.08em] text-black dark:text-white">
                                {copy.schedule}
                            </h3>

                            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-white/50">
                                {settings.activeDays.length}{" "}
                                {copy.activeDays.toLowerCase()}
                            </p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black dark:text-white">
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
                                        className={cn(
                                            "border-2 border-black dark:border-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition",
                                            active
                                                ? "bg-black text-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_rgba(0,0,0,0.5)]"
                                                : "bg-white dark:bg-white/5 text-black dark:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000] dark:hover:shadow-[3px_3px_0_rgba(0,0,0,0.5)]",
                                        )}
                                    >
                                        {getDayName(index).slice(0, 3)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <HourPicker
                            label={copy.startHour}
                            value={settings.startHour}
                            hours={START_HOURS}
                            onChange={(hour) => handleHourChange("start", hour)}
                        />

                        <HourPicker
                            label={copy.endHour}
                            value={settings.endHour}
                            hours={END_HOURS}
                            onChange={(hour) => handleHourChange("end", hour)}
                        />
                    </div>
                </section>

                <section className="border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                    <h3 className="font-display mb-4 text-base font-black uppercase tracking-[0.08em] text-black dark:text-white">
                        {copy.preferences}
                    </h3>

                    <div className="space-y-3">
                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <Globe2 size={20} strokeWidth={2} className="text-slate-600 dark:text-white/60" />

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.06em] text-slate-800 dark:text-white">
                                        {copy.language}
                                    </p>
                                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-white/50">
                                        {copy.currentLanguage}: {lang.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <Button variant="secondary" onClick={onToggleLanguage}>
                                {copy.changeLanguage}
                            </Button>
                        </div>

                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <Bell size={20} strokeWidth={2} className="text-slate-600 dark:text-white/60" />

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.06em] text-slate-800 dark:text-white">
                                        {copy.notifications}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500 dark:text-white/50">
                                        {copy.notificationsDesc}
                                    </p>
                                </div>
                            </div>

                            <span className="w-fit rounded-lg border border-amber-200 dark:border-amber-800/30 bg-[#FFF3C4] dark:bg-amber-900/30 px-2.5 py-1 text-xs font-black uppercase tracking-[0.08em] text-amber-800 dark:text-amber-300 shadow-sm">
                                {copy.soon}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Database size={20} strokeWidth={2} className="text-slate-600 dark:text-white/60" />

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.06em] text-slate-800 dark:text-white">
                                        {copy.storage}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500 dark:text-white/50">
                                        {copy.storageDesc}
                                    </p>
                                </div>
                            </div>

                            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 shadow-sm" />
                        </div>
                    </div>
                </section>

                <section className="border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => updateSettings(DEFAULT_SETTINGS)}
                    >
                        {copy.resetDefaults}
                    </Button>
                </section>

                <section className="border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                    <div className="mb-5 flex items-center gap-3 pb-4">
                        <SectionIcon>
                            {theme === 'dark' ? <Sun size={20} strokeWidth={3} /> : <Moon size={20} strokeWidth={3} />}
                        </SectionIcon>

                        <div className="min-w-0">
                            <h3 className="font-display text-base font-black uppercase tracking-[0.08em] text-black dark:text-white">
                                {lang === "es" ? "Apariencia" : "Appearance"}
                            </h3>

                            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-white/50">
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-black dark:text-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#F5F0E6] dark:hover:bg-white/10 hover:shadow-[3px_3px_0_#000] dark:hover:shadow-[3px_3px_0_rgba(0,0,0,0.5)]"
                    >
                        {theme === 'dark' ? <Sun size={16} strokeWidth={3} /> : <Moon size={16} strokeWidth={3} />}
                        {theme === 'dark' ? (lang === "es" ? "Modo Claro" : "Light Mode") : (lang === "es" ? "Modo Oscuro" : "Dark Mode")}
                    </button>
                </section>

                <section className="border-[3px] border-black dark:border-white/10 bg-[#FFFCF4] dark:bg-[#111827] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-red-600 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-[3px_3px_0_#dc2626]"
                    >
                        <LogOut size={16} strokeWidth={3} />
                        {lang === "es" ? "Cerrar Sesion" : "Log Out"}
                    </button>
                </section>
            </div>
        </div>
    );
}