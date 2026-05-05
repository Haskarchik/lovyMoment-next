'use client';

/**
 * Minimal desktop-header language switcher: two soft-white text links
 * separated by a thin divider. Active locale is bold + underlined.
 *
 * Hidden below 500px — the footer renders a richer pill UI for mobile.
 */
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import styles from '@/styles/localeSwitcher.module.css';
import { locales, defaultLocale, isLocale } from '@/i18n/config';
import type { Locale } from '@/types';

const LABELS: Record<Locale, string> = { uk: 'УКР', en: 'EN' };

interface Props {
  active: Locale;
}

export function LocaleSwitcher({ active }: Props) {
  const pathname = usePathname() ?? '/';

  // Drop a leading "/<locale>" if it matches one of our configured locales.
  let basePath = pathname;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    basePath = '/' + segments.slice(1).join('/') || '/';
  }

  function hrefFor(locale: Locale) {
    if (locale === defaultLocale) return basePath || '/';
    return `/${locale}${basePath === '/' || basePath === '' ? '' : basePath}`;
  }

  return (
    <div className={styles.wrap} role="group" aria-label="Мова сайту">
      {locales.map((l, i) => (
        <Fragment key={l}>
          <Link
            href={hrefFor(l)}
            hrefLang={l}
            aria-current={l === active ? 'page' : undefined}
            className={`${styles.link} ${l === active ? styles.active : ''}`}
          >
            {LABELS[l]}
          </Link>
          {i < locales.length - 1 && <span className={styles.divider}>|</span>}
        </Fragment>
      ))}
    </div>
  );
}
