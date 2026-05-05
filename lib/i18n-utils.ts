/**
 * Helpers that resolve the multilingual DB schema down to plain strings
 * for a given locale. See `types/index.ts` for the schema spec.
 *
 * Resolution rules:
 *   1. Try the requested locale's suffixed field (`name_en`).
 *   2. Fall back to the default locale's plain field (`name`).
 *   3. Fall back to the first non-empty translation we can find.
 *   4. Otherwise return undefined / empty.
 *
 * Empty strings (including whitespace-only) are treated as "missing" so an
 * empty `name_en: ""` won't replace a usable Ukrainian fallback.
 */
import type { Locale, RawProduct } from '@/types';
import { DEFAULT_LOCALE, LOCALES } from '@/types';

function nonEmpty(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? value : undefined;
}

/**
 * Pick the localised string for `field` from `row` for the given locale.
 *
 *   pickLocale(row, 'name', 'en')
 *     → row.name_en ?? row.name ?? row.name_pl ?? ''
 */
export function pickLocale<K extends keyof RawProduct>(
  row: RawProduct,
  field: K,
  locale: Locale
): string {
  // 1. Requested locale, suffixed
  if (locale !== DEFAULT_LOCALE) {
    const suffixed = (row as any)[`${String(field)}_${locale}`];
    const value = nonEmpty(suffixed);
    if (value !== undefined) return value;
  }
  // 2. Default locale (the unsuffixed field)
  const base = nonEmpty(row[field] as unknown);
  if (base !== undefined) return base;
  // 3. Try any other locale's translation
  for (const other of LOCALES) {
    if (other === DEFAULT_LOCALE || other === locale) continue;
    const v = nonEmpty((row as any)[`${String(field)}_${other}`]);
    if (v !== undefined) return v;
  }
  return '';
}

/** Pick a localised array field. Empty array becomes the fallback. */
export function pickLocaleArray<K extends keyof RawProduct>(
  row: RawProduct,
  field: K,
  locale: Locale
): string[] {
  const tryRead = (key: string): string[] | undefined => {
    const v = (row as any)[key];
    if (Array.isArray(v) && v.some((x) => typeof x === 'string' && x.trim().length)) {
      return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
    }
    return undefined;
  };
  if (locale !== DEFAULT_LOCALE) {
    const v = tryRead(`${String(field)}_${locale}`);
    if (v) return v;
  }
  const base = tryRead(String(field));
  if (base) return base;
  for (const other of LOCALES) {
    if (other === DEFAULT_LOCALE || other === locale) continue;
    const v = tryRead(`${String(field)}_${other}`);
    if (v) return v;
  }
  return [];
}
