"use client";

import { useCallback, useEffect, useState } from "react";
import { translations, Language } from "@/shared/lib/i18n";
import { SPANISH_SPEAKING_COUNTRIES } from "@/shared/lib/constants";

export const useLanguage = () => {
    const [lang, setLang] = useState<Language>("es");

    useEffect(() => {
        const initLanguage = async () => {
            const savedLang = localStorage.getItem("aputrak_lang") as Language;
            if (savedLang && (savedLang === "es" || savedLang === "en")) {
                setLang(savedLang);
                return;
            }

            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                const countryCode = data.country_code;

                if (countryCode && SPANISH_SPEAKING_COUNTRIES.includes(countryCode)) {
                    setLang('es');
                } else {
                    setLang('en');
                }
            } catch (error) {
                console.error('Error detectando la ubicación, usando idioma del navegador:', error);
                const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
                setLang(browserLang);
            }
        };

        initLanguage();
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === "es" ? "en" : "es";
        setLang(newLang);
        localStorage.setItem("aputrak_lang", newLang);
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