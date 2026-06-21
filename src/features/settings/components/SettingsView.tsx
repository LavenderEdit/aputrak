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
import { Input } from "@/shared/components/ui/Input";
import { DAYS_OF_WEEK, DEFAULT_SETTINGS } from "@/shared/lib/constants";
import { Utils } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/cn";
import type { ScheduleSettings } from "@/features/schedule/types/schedule.types";
import { getSettingsCopy } from "../constants/settings.constants";

interface SettingsViewProps {
    lang: string;
    username: string;
    settings: ScheduleSettings;
    updateSettings: (settings: ScheduleSettings) => Promise<void> | void;
    getDayName: (index: number) => string;
    onUpdateUsername: (username: string) => Promise<void> | void;
    onToggleLanguage: () => void;
}

const START_HOURS = Array.from({ length: 24 }, (_, index) => index);
const END_HOURS = Array.from({ length: 25 }, (_, index) => index);

function SectionIcon({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
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
        <div className="border-[3px] border-black bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-black">
                    <Clock3 size={16} strokeWidth={3} />
                    {label}
                </label>

                <span className="border-2 border-black bg-[#FFFCF4] px-3 py-1 text-xs font-black text-black">
                    {Utils.formatTime(value)}
                </span>
            </div>

            <div className="bg-[#F5F0E6] p-2">
                <div className="grid max-h-52 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-6 lg:max-h-44 xl:grid-cols-5">
                    {hours.map((hour) => {
                        const active = value === hour;

                        return (
                            <button
                                key={hour}
                                type="button"
                                onClick={() => onChange(hour)}
                                className={cn(
                                    "border-2 border-black px-2 py-2 text-xs font-black transition",
                                    active
                                        ? "bg-black text-white shadow-[3px_3px_0_#000]"
                                        : "bg-white text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000]",
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
    settings,
    updateSettings,
    getDayName,
    onUpdateUsername,
    onToggleLanguage,
}: SettingsViewProps) {
    const [usernameDraft, setUsernameDraft] = useState(username);
    const copy = getSettingsCopy(lang);

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
            <div className="mb-6 border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000]">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Aputrak
                </p>

                <h2 className="font-display text-3xl font-black uppercase tracking-tight text-black">
                    {copy.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-slate-600">
                    {copy.subtitle}
                </p>
            </div>

            <div className="space-y-5">
                <section className="border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000]">
                    <div className="mb-5 flex items-center gap-3 border-b-2 border-black pb-4">
                        <SectionIcon>
                            <UserRound size={20} strokeWidth={3} />
                        </SectionIcon>

                        <div className="min-w-0">
                            <h3 className="font-display text-base font-black uppercase tracking-[0.08em] text-black">
                                {copy.profile}
                            </h3>

                            <p className="truncate text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                                {username}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleUsernameSubmit}
                        className="grid gap-3 sm:grid-cols-[1fr_auto]"
                    >
                        <div>
                            <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black">
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
                </section>

                <section className="border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000]">
                    <div className="mb-5 flex items-center gap-3 border-b-2 border-black pb-4">
                        <SectionIcon>
                            <CalendarClock size={20} strokeWidth={3} />
                        </SectionIcon>

                        <div className="min-w-0">
                            <h3 className="font-display text-base font-black uppercase tracking-[0.08em] text-black">
                                {copy.schedule}
                            </h3>

                            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                                {settings.activeDays.length}{" "}
                                {copy.activeDays.toLowerCase()}
                            </p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-black">
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
                                            "border-2 border-black px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition",
                                            active
                                                ? "bg-black text-white shadow-[3px_3px_0_#000]"
                                                : "bg-white text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000]",
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

                <section className="border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000]">
                    <h3 className="font-display mb-4 text-base font-black uppercase tracking-[0.08em] text-black">
                        {copy.preferences}
                    </h3>

                    <div className="space-y-3">
                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <Globe2 size={20} strokeWidth={2} className="text-slate-600" />

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.06em] text-slate-800">
                                        {copy.language}
                                    </p>
                                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                                        {copy.currentLanguage}: {lang.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <Button variant="secondary" onClick={onToggleLanguage}>
                                {copy.changeLanguage}
                            </Button>
                        </div>

                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <Bell size={20} strokeWidth={2} className="text-slate-600" />

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.06em] text-slate-800">
                                        {copy.notifications}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500">
                                        {copy.notificationsDesc}
                                    </p>
                                </div>
                            </div>

                            <span className="w-fit rounded-lg border border-amber-200 bg-[#FFF3C4] px-2.5 py-1 text-xs font-black uppercase tracking-[0.08em] text-amber-800 shadow-sm">
                                {copy.soon}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Database size={20} strokeWidth={2} className="text-slate-600" />

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.06em] text-slate-800">
                                        {copy.storage}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500">
                                        {copy.storageDesc}
                                    </p>
                                </div>
                            </div>

                            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 shadow-sm" />
                        </div>
                    </div>
                </section>

                <section className="border-[3px] border-black bg-[#FFFCF4] p-5 shadow-[6px_6px_0_#000]">
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