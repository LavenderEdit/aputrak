"use client";

import { useState } from "react";
import { ArrowRight, CalendarCheck, Languages } from "lucide-react";
import Link from "next/link";
import type { Language } from "@/shared/lib/i18n";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { getAuthCopy } from "../constants/auth.constants";


interface LoginScreenProps {
  lang: Language;
  onSelectLanguage: (lang: Language) => void;
  onLogin: (data: any) => Promise<void>;
  onRegister: (data: any) => Promise<void>;
  onSaveUsername: (username: string) => Promise<void>;
}

export function LoginScreen({
  lang,
  onSelectLanguage,
  onLogin,
  onRegister,
  onSaveUsername,
}: LoginScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"guest" | "login" | "register">("login");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const copy = getAuthCopy(lang);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      if (mode === "guest") {
        const cleanName = name.trim();
        if (!cleanName) {
          setError(copy.validationError);
          return;
        }
        await onSaveUsername(cleanName);
      } else if (mode === "login") {
        if (!email.trim() || !password.trim()) {
          setError(copy.validationError);
          return;
        }
        await onLogin({ email, password });
      } else if (mode === "register") {
        if (!email.trim() || !password.trim() || !name.trim()) {
          setError(copy.validationError);
          return;
        }
        if (password.length < 8) {
          setError("Password must be at least 8 characters");
          return;
        }
        if (!/[A-Z]/.test(password)) {
          setError("Password must contain at least one uppercase letter");
          return;
        }
        if (!/[0-9]/.test(password)) {
          setError("Password must contain at least one number");
          return;
        }
        await onRegister({ email, password, username: name });
      }
    } catch (err) {
      console.error(err);
      setError(copy.authError);
    } finally {
      setIsLoading(false);
    }
  };

  const languageButtonClass = (active: boolean) =>
    active
      ? "bg-black text-white"
      : "bg-white text-black hover:bg-slate-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/15";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9e9e9] px-4 py-8">
      <section className="w-full max-w-md border-[3px] border-black bg-white shadow-[8px_8px_0_#000] dark:border-white/10 dark:bg-white/5 dark:shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center border-[3px] border-black bg-white dark:border-white/10 dark:bg-white/5">
              <CalendarCheck size={24} strokeWidth={3} />
            </div>

            <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-black dark:text-white">
              {copy.appName}
            </h1>

            <h2 className="mt-5 text-2xl font-black text-black dark:text-white">
              {copy.welcome}
            </h2>

            <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-white/50">
              {copy.welcomeSub}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {(mode === "guest" || mode === "register") && (
              <div>
                <label htmlFor="login-username" className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-black dark:text-white">
                  {copy.name}
                </label>

                <Input
                  id="login-username"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError("");
                  }}
                  type="text"
                  placeholder={copy.enterName}
                  error={Boolean(error)}
                  autoFocus={mode === "guest"}
                />
              </div>
            )}

            {(mode === "login" || mode === "register") && (
              <>
                <div>
                  <label htmlFor="login-email" className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-black dark:text-white">
                    {copy.email}
                  </label>
                  <Input
                    id="login-email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError("");
                    }}
                    type="email"
                    placeholder={copy.enterEmail}
                    error={Boolean(error)}
                    autoFocus={mode === "login"}
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-black dark:text-white">
                    {copy.password}
                  </label>
                  <Input
                    id="login-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (error) setError("");
                    }}
                    type="password"
                    placeholder={copy.enterPassword}
                    error={Boolean(error)}
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600">
                {error}
              </p>
            )}

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-black dark:text-white">
                <Languages size={14} />
                {copy.language}
              </div>

              <div className="grid grid-cols-2 border-2 border-black dark:border-white/10">
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
                  className={`h-11 border-l-2 border-black dark:border-white/10 text-xs font-black uppercase tracking-[0.16em] transition ${languageButtonClass(
                    lang === "en",
                  )}`}
                >
                  {copy.english}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "..." : (mode === "login" ? copy.login : mode === "register" ? copy.register : copy.getStarted)}
                {!isLoading && <ArrowRight size={18} className="ml-2" />}
              </Button>

              <div className="flex flex-col gap-2 text-center text-xs font-bold tracking-[0.1em]">
                {mode === "login" && (
                  <button type="button" onClick={() => setMode("register")} className="text-slate-500 hover:text-black dark:text-white/50 dark:hover:text-white">
                    {copy.switchToRegister}
                  </button>
                )}
                {mode === "register" && (
                  <button type="button" onClick={() => setMode("login")} className="text-slate-500 hover:text-black dark:text-white/50 dark:hover:text-white">
                    {copy.switchToLogin}
                  </button>
                )}
                {mode !== "guest" && (
                  <button type="button" onClick={() => setMode("guest")} className="text-slate-500 hover:text-black dark:text-white/50 dark:hover:text-white">
                    {copy.getStarted}
                  </button>
                )}
                {mode === "guest" && (
                  <button type="button" onClick={() => setMode("login")} className="text-slate-500 hover:text-black dark:text-white/50 dark:hover:text-white">
                    {copy.switchToLogin}
                  </button>
                )}
              </div>
              
              {mode === "register" && (
                <div className="text-[10px] text-center font-bold text-slate-500 dark:text-white/50 tracking-widest uppercase mt-2">
                  {copy.byRegistering}{" "}
                  <Link href="/terms" className="underline hover:text-black dark:hover:text-white" target="_blank">
                    {copy.terms}
                  </Link>{" "}
                  {copy.and}{" "}
                  <Link href="/privacy" className="underline hover:text-black dark:hover:text-white" target="_blank">
                    {copy.privacy}
                  </Link>
                </div>
              )}
            </div>
          </form>

          <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs font-bold text-slate-500 dark:text-white/50">
            <span className="h-2 w-2 rounded-full bg-black" />
            {copy.worksOffline}
          </div>
        </div>
      </section>
    </main>
  );
}