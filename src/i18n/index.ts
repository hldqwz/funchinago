// src/i18n/index.ts — i18n helper (English only)
import en from "./en.json";

type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationMap = { [key: string]: TranslationValue };

export function useTranslations() {
  const dict = en;

  return function t(key: string, params?: Record<string, string | number>): string {
    const parts = key.split(".");
    let value: TranslationValue = dict;

    for (const part of parts) {
      if (typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return key;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
    }

    return value;
  };
}
