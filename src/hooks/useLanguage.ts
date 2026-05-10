"use client";
import { useState, useEffect, useCallback } from "react";
import { translations, Language } from "../lib/i18n";

export const useLanguage = () => {
    const [lang, setLang] = useState<Language>("es");

    useEffect(() => {
        const savedLang = localStorage.getItem("quipu_lang") as Language;
        if (savedLang && (savedLang === "es" || savedLang === "en")) {
            setLang(savedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === "es" ? "en" : "es";
        setLang(newLang);
        localStorage.setItem("quipu_lang", newLang);
    };

    const t = useCallback((key: keyof typeof translations.es): string => {
        return translations[lang][key] as string;
    }, [lang]);

    const getDayName = (index: number) => {
        const dayIndex = index === 6 ? 0 : index + 1;
        return translations[lang].days[dayIndex];
    };

    return { lang, toggleLanguage, t, getDayName };
};