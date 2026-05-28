"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Language } from "@/shared/lib/i18n";
import { getAuthCopy } from "../constants/auth.constants";

interface LoginScreenProps {
  lang: Language;
  onSelectLanguage: (lang: Language) => void;
  onSave: (name: string) => void;
}

export function LoginScreen({
  lang,
  onSelectLanguage,
  onSave,
}: LoginScreenProps) {
  const [name, setName] = useState("");
  const copy = getAuthCopy(lang);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) return;

    onSave(cleanName);
  };

  const languageButtonClass = (active: boolean) =>
    [
      "flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition",
      active
        ? "border-primary bg-indigo-50 text-primary shadow-sm"
        : "border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-primary",
    ].join(" ");

  return (
    <main className="login-bg flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="orb" />
      <div className="orb" />
      <div className="orb" />

      <section className="fade-in relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-2xl backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <CalendarCheck size={28} />
            </div>

            <h1 className="mt-8 font-display text-5xl font-black tracking-[-0.04em]">
              {copy.appName}
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
              {copy.welcomeSub}
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <ShieldCheck size={20} />
              <span className="text-sm font-semibold">
                {copy.worksOffline}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <Sparkles size={20} />
              <span className="text-sm font-semibold">
                {lang === "es"
                  ? "Organiza tu semana en segundos"
                  : "Organize your week in seconds"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-primary lg:mx-0">
              <CalendarCheck size={30} />
            </div>

            <h2 className="font-display text-3xl font-black tracking-[-0.03em] text-slate-950">
              {lang === "es" ? "Bienvenido" : "Welcome"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {copy.welcomeSub}
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {copy.name}
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                placeholder={copy.enterName}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-indigo-100"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {copy.language}
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectLanguage("es")}
                  className={languageButtonClass(lang === "es")}
                >
                  <Globe2 size={16} />
                  {copy.spanish}
                  {lang === "es" && <Check size={15} />}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectLanguage("en")}
                  className={languageButtonClass(lang === "en")}
                >
                  <Globe2 size={16} />
                  {copy.english}
                  {lang === "en" && <Check size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-primary-dark"
            >
              {copy.getStarted}
              <ArrowRight size={16} className="ml-2" />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 lg:justify-start">
            <span className="pulse h-2 w-2 rounded-full bg-success" />
            {copy.worksOffline}
          </div>
        </div>
      </section>
    </main>
  );
}