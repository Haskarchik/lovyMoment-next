/**
 * Locale configuration. The default locale is rendered without a prefix
 * (so `/atractions` stays canonical), while non-default locales use `/en/*`.
 * This is the recommended Next.js pattern for sub-path i18n.
 *
 * To add a new locale: append it to `locales`, add an entry to
 * `localeOgTags`, translate `i18n/dictionaries.ts`, mirror the route tree
 * under `app/<locale>/`, and update `LOCALES_FOR_PRODUCT_ROUTES` in
 * `app/sitemap.ts`.
 */
import type { Locale } from '@/types';

export const locales: Locale[] = ['uk', 'en'];
export const defaultLocale: Locale = 'uk';

export const localeNames: Record<Locale, string> = {
  uk: 'Українська',
  en: 'English'
};

export const localeOgTags: Record<Locale, string> = {
  uk: 'uk_UA',
  en: 'en_US'
};

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

/**
 * Build a path with optional locale prefix. The default locale is unprefixed.
 *   localePath('en', '/atractions') === '/en/atractions'
 *   localePath('uk', '/atractions') === '/atractions'
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean === '/' ? '' : clean}`;
}
