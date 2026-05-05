/**
 * Auto-generated sitemap. Includes:
 *   - the homepage and the about page
 *   - every category page
 *   - every product page (one-shot Firebase fetch)
 *   - the locale-prefixed mirrors for /en and /pl
 *
 * `defaultLocale` (uk) is unprefixed; other locales get a `/<locale>` prefix.
 *
 * EN routes mirror every UK route.
 *
 * Next.js serves this at `/sitemap.xml`.
 */
import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';
import { CATEGORY_SLUGS } from '@/types';
import { getAllProducts } from '@/lib/firebase';
import { locales, defaultLocale } from '@/i18n/config';
import type { Locale } from '@/types';

/** Locales that have a complete route tree (homepage, about, categories, products). */
const LOCALES_FOR_PRODUCT_ROUTES: Locale[] = ['uk', 'en'];

const STATIC_PATHS: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about-us', priority: 0.8, changeFrequency: 'monthly' }
];

function urlFor(locale: Locale, path: string): string {
  if (locale === defaultLocale) return `${SITE_URL}${path === '/' ? '' : path}` || `${SITE_URL}/`;
  return `${SITE_URL}/${locale}${path === '/' ? '' : path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts().catch(() => []);
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage exists in every registered locale.
  for (const locale of locales) {
    entries.push({
      url: urlFor(locale, '/'),
      lastModified: now,
      priority: 1.0,
      changeFrequency: 'weekly'
    });
  }

  // About + categories + products exist in the locales that have a full
  // route tree under `app/<locale>/...`.
  for (const locale of LOCALES_FOR_PRODUCT_ROUTES) {
    for (const s of STATIC_PATHS) {
      if (s.path === '/') continue; // already pushed above
      entries.push({
        url: urlFor(locale, s.path),
        lastModified: now,
        priority: s.priority,
        changeFrequency: s.changeFrequency
      });
    }
    for (const cat of CATEGORY_SLUGS) {
      entries.push({
        url: urlFor(locale, `/${cat}`),
        lastModified: now,
        priority: 0.9,
        changeFrequency: 'weekly'
      });
    }
    for (const p of products) {
      if (!p.slug || !p.category) continue;
      entries.push({
        url: urlFor(locale, `/${p.category}/${p.slug}`),
        lastModified: now,
        priority: 0.7,
        changeFrequency: 'weekly'
      });
    }
  }

  return entries;
}
