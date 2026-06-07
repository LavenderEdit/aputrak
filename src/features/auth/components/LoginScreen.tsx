"use client";

import { useState } from "react";
import { ArrowRight, CalendarCheck, Languages } from "lucide-react";
import type { Language } from "@/shared/lib/i18n";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
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
  const [error, setError] = useState("");

  const copy = getAuthCopy(lang);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setError(copy.validationError);
      return;
    }

    onSave(cleanName);
  };

  const languageButtonClass = (active: boolean) =>
    active
      ? "bg-black text-white"
      : "bg-white text-black hover:bg-slate-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9e9e9] px-4 py-8">
      <section className="w-full max-w-md border-[3px] border-black bg-white shadow-[8px_8px_0_#000]">
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center border-[3px] border-black bg-white">
              <CalendarCheck size={24} strokeWidth={3} />
            </div>

            <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-black">
              {copy.appName}
            </h1>

            <h2 className="mt-5 text-2xl font-black text-black">
              {copy.welcome}
            </h2>

            <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {copy.welcomeSub}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-black">
                {copy.name}
              </label>

              <Input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                type="text"
                placeholder={copy.enterName}
                error={Boolean(error)}
                autoFocus
              />

              {error && (
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-black">
                <Languages size={14} />
                {copy.language}
              </div>

              <div className="grid grid-cols-2 border-2 border-black">
                <button
                  type="button"
                  onClick={() => onSelectLanguage("es")}
                  className={`h-11 text-xs font-black uppercase tracking-[0.16em] transition ${languageButtonClass(
                    lang === "es",
                  )}`}
                >
                  {copy.spanish}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectLanguage("en")}
                  className={`h-11 border-l-2 border-black text-xs font-black uppercase tracking-[0.16em] transition ${languageButtonClass(
                    lang === "en",
                  )}`}
                >
                  {copy.english}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              {copy.getStarted}
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs font-bold text-slate-500">
            <span className="h-2 w-2 rounded-full bg-black" />
            {copy.worksOffline}
          </div>
        </div>
      </section>
    </main>
  );
}