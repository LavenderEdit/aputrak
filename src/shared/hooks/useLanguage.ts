"use client";

import { useCallback, useEffect, useState } from "react";
import { translations, Language } from "@/shared/lib/i18n";
import { SPANISH_SPEAKING_COUNTRIES } from "@/shared/lib/constants";

const LANGUAGE_STORAGE_KEY = "aputrak_lang";

function isValidLanguage(value: string | null): value is Language {
    return value === "es" || value === "en";
}

export const useLanguage = () => {
    const [lang, setLang] = useState<Language>("es");

    useEffect(() => {
        const initLanguage = async () => {
            const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);

            if (isValidLanguage(savedLang)) {
                setLang(savedLang);
                return;
            }

            try {
                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();
                const countryCode = data.country_code;

                if (countryCode && SPANISH_SPEAKING_COUNTRIES.includes(countryCode)) {
                    setLang("es");
                    return;
                }

                setLang("en");
            } catch {
                const browserLang = navigator.language.startsWith("es") ? "es" : "en";
                setLang(browserLang);
            }
        };

        initLanguage();
    }, []);

    const changeLanguage = useCallback((nextLang: Language) => {
        setLang(nextLang);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    }, []);

    const toggleLanguage = useCallback(() => {
        changeLanguage(lang === "es" ? "en" : "es");
    }, [changeLanguage, lang]);

    const t = useCallback(
        (key: keyof typeof translations.es): string => {
            return translations[lang][key] as string;
        },
        [lang],
    );

    const getDayName = (index: number) => {
        const dayIndex = index === 6 ? 0 : index + 1;
        return translations[lang].days[dayIndex];
    };

    return {
        lang,
        changeLanguage,
        toggleLanguage,
        t,
        getDayName,
    };
};