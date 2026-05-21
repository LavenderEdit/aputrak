"use client";

import { useState } from "react";
import { ArrowRight, CalendarCheck, Globe2 } from "lucide-react";

interface LoginScreenProps {
  onSave: (name: string) => void;
}

export function LoginScreen({ onSave }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [lang, setLang] = useState<"en" | "es">("es");

  const copy = {
    en: {
      appName: "Aputrak",
      welcomeSub: "Your offline-first schedule & activity planner",
      name: "Name",
      enterName: "Enter your name",
      language: "Language",
      getStarted: "Get Started",
      worksOffline: "Works offline — no internet required",
      validationError: "Please enter your name.",
    },
    es: {
      appName: "Aputrak",
      welcomeSub: "Tu planificador de horarios y actividades offline",
      name: "Nombre",
      enterName: "Ingresa tu nombre",
      language: "Idioma",
      getStarted: "Comenzar",
      worksOffline: "Funciona sin internet — no requiere conexión",
      validationError: "Ingresa tu nombre.",
    },
  }[lang];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) return;

    onSave(cleanName);
  };

  const languageButtonClass = (active: boolean) =>
    [
      "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
      active
        ? "border-primary bg-indigo-50 text-primary"
        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
    ].join(" ");

  return (
    <main className="login-bg flex items-center justify-center p-4">
      <div className="orb" />
      <div className="orb" />
      <div className="orb" />

      <section className="fade-in relative z-10 w-full max-w-md rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-primary">
            <CalendarCheck size={30} />
          </div>

          <h1 className="font-display text-[2rem] font-extrabold tracking-[-0.02em] text-slate-950">
            {copy.appName}
          </h1>

          <p className="mt-2 text-sm text-slate-500">{copy.welcomeSub}</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {copy.name}
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              placeholder={copy.enterName}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-indigo-100"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {copy.language}
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={languageButtonClass(lang === "en")}
              >
                <Globe2 size={16} />
                English
              </button>

              <button
                type="button"
                onClick={() => setLang("es")}
                className={languageButtonClass(lang === "es")}
              >
                <Globe2 size={16} />
                Español
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-primary-dark"
          >
            {copy.getStarted}
            <ArrowRight size={16} className="ml-2" />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <span className="pulse h-2 w-2 rounded-full bg-success" />
          {copy.worksOffline}
        </div>
      </section>
    </main>
  );
}