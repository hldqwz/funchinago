// src/i18n/index.ts — 国际化助手
// 用法: const t = useTranslations(locale); t("home.hero_title");

import en from "./en.json";
import zh from "./zh.json";

type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationMap = { [key: string]: TranslationValue };

const translations: Record<string, TranslationMap> = { en, zh };

/**
 * 从路径中提取语言代码
 * "/" → "en", "/zh/" → "zh", "/zh/models/..." → "zh"
 */
export function detectLocale(pathname: string): "en" | "zh" {
  if (pathname.startsWith("/zh")) return "zh";
  return "en";
}

/**
 * 获取当前语言的翻译函数。
 * 支持嵌套 key: t("nav.rankings") → "排行榜"
 * 支持模板替换: t("detail.about_section", { name: "GPT-4" }) → "关于 GPT-4"
 */
export function useTranslations(locale: "en" | "zh") {
  const dict = translations[locale] || translations.en;

  return function t(key: string, params?: Record<string, string | number>): string {
    const parts = key.split(".");
    let value: TranslationValue = dict;

    for (const part of parts) {
      if (typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return key; // fallback: 返回 key 本身
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // 模板替换: {name} → 参数值
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
    }

    return value;
  };
}

/**
 * 获取语言切换目标 URL。
 * "/" → "/zh/", "/zh/" → "/", "/models/abc" → "/zh/models/abc"
 */
export function switchLocaleUrl(pathname: string, currentLocale: "en" | "zh"): string {
  if (currentLocale === "en") {
    // 英文切中文：加 /zh 前缀
    return `/zh${pathname === "/" ? "" : pathname}`;
  } else {
    // 中文切英文：去掉 /zh 前缀
    const stripped = pathname.replace(/^\/zh/, "") || "/";
    return stripped;
  }
}

/**
 * 获取当前语言的内容路径（不带语言前缀，供 data import 用）
 */
export function contentPath(locale: "en" | "zh"): string {
  return locale === "zh" ? "/zh" : "";
}
