import { bg } from './bg';
import { en } from './en';

export const languages = { bg: 'Български', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'bg';

const dictionaries = { bg, en } as const;

export type Dictionary = typeof bg;

export function useTranslations(lang: Lang): Dictionary {
  return dictionaries[lang];
}

/** Prefix a root-relative path with the language segment (`/en` for English). */
export function localizePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

/** The same page in the other language, for the header language switcher. */
export function alternatePath(lang: Lang, path: string): string {
  return localizePath(lang === 'bg' ? 'en' : 'bg', path);
}
