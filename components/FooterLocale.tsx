'use client';

/**
 * Single language-toggle pill rendered inside the footer's social grid.
 * Visually different from the filled social pills:
 *   - transparent background + white border (outlined style)
 *   - small caption ("змінити мову" / "switch language") beneath the name
 *   - arrow → on the right hints at navigation
 *
 * Result: the pill blends into the 2×3 grid for layout symmetry but reads
 * as an *action*, not just another contact link.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { locales, defaultLocale, isLocale } from '@/i18n/config';
import type { Locale } from '@/types';

const TARGET_NAME: Record<Locale, string> = {
  uk: 'English',
  en: 'Українська'
};

const SWITCH_CAPTION: Record<Locale, string> = {
  uk: 'switch language',
  en: 'змінити мову'
};

function GlobeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 14, flex: 'none' }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: 'auto', flex: 'none' }}
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Props {
  active: Locale;
}

export function FooterLocale({ active }: Props) {
  const pathname = usePathname() ?? '/';

  // Strip leading "/<locale>" so we can re-prefix for the target locale.
  let basePath = pathname;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    basePath = '/' + segments.slice(1).join('/') || '/';
  }

  const target = locales.find((l) => l !== active) ?? defaultLocale;
  const href =
    target === defaultLocale
      ? basePath || '/'
      : `/${target}${basePath === '/' || basePath === '' ? '' : basePath}`;

  return (
    <li className="footer-locale-pill">
      <Link
        href={href}
        hrefLang={target}
        aria-label={`Switch language to ${TARGET_NAME[active]}`}
      >
        <GlobeIcon />
        <span className="footer-locale-stack">
          <span className="footer-locale-name">{TARGET_NAME[active]}</span>
          <span className="footer-locale-sub">{SWITCH_CAPTION[active]}</span>
        </span>
        <ArrowRight />
      </Link>
    </li>
  );
}
