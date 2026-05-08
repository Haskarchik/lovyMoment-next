/**
 * Edge middleware:
 *
 *   1. Force the bare-domain (non-www) version. SEO auditors flag duplicate
 *      content when both `www.` and the apex serve the same site. We always
 *      redirect www traffic to the apex with a permanent 301.
 *
 *   2. Legacy CRA URLs (PascalCase) → new ChPU lower-case URLs. Google has
 *      old paths like `/AboutUs`, `/Atractions`, `/Page/:id` indexed and we
 *      want to preserve link equity. Each old path is permanently redirected
 *      (301) to its new equivalent. Product pages (`/Page/<numericId>`) are
 *      handled by `app/Page/[id]/route.ts` because they need a DB lookup to
 *      resolve `id` → `<category>/<slug>`.
 *
 *   3. Locale routing pass-through. Default locale (`uk`) is unprefixed, so
 *      `/atractions` stays canonical. Non-default locales (`/en`) are passed
 *      through to be matched by their dedicated route trees under `app/en/`.
 *
 * The `www` redirect can also be handled at the hosting layer (see
 * `netlify.toml`). Doing it here too keeps the behaviour identical when
 * developing locally or hosting elsewhere.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

export const config = {
  matcher: [
    // Skip Next internals, API routes, and any file with an extension.
    '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'
  ]
};

/**
 * Legacy CRA paths (PascalCase, mixed case) → new lower-case slugs. Mapping
 * is exact-match; trailing slashes and query strings are preserved by the
 * caller so `/AboutUs?utm_source=fb` redirects cleanly.
 */
const LEGACY_REDIRECTS: Record<string, string> = {
  '/AboutUs': '/about-us',
  '/Atractions': '/atractions',
  '/Corporate': '/corporate',
  '/Promotion': '/promotion',
  '/Child-party': '/child-party',
  '/Animators': '/animators',
  '/Trampoline': '/trampoline',
  '/Other': '/other',
  '/MegaGame': '/megagame',
  '/Food': '/food',
  '/Admin': '/admin'
};

export function middleware(request: NextRequest) {
  // 1. www → apex redirect.
  const host = request.headers.get('host') ?? '';
  if (host.toLowerCase().startsWith('www.')) {
    const url = new URL(request.url);
    url.host = host.slice(4);
    return NextResponse.redirect(url, 308);
  }

  const { pathname, search } = request.nextUrl;

  // 2. Legacy CRA path redirects (exact match, case-sensitive).
  const legacyTarget = LEGACY_REDIRECTS[pathname];
  if (legacyTarget) {
    const url = request.nextUrl.clone();
    url.pathname = legacyTarget;
    url.search = search;
    return NextResponse.redirect(url, 301);
  }

  // 3. Locale routing.
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}
