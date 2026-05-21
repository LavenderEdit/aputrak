import type { translations } from "@/shared/lib/i18n";

export type TranslationKey = keyof typeof translations.es;

export type TranslateFn = (key: TranslationKey) => string;