/**
 * Locale-aware middleware. Default locale (`uk`) stays unprefixed so we don't
 * break the existing canonical URLs. Other locales (`/en`, `/pl`) are passed
 * through and matched by the optional `[locale]` segment in the app router.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

export const config = {
  matcher: [
    // Skip Next internals, API routes, and any file with an extension.
    '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'
  ]
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already starts with a non-default locale — let it through.
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return NextResponse.next();
    }
  }

  // Default locale: no rewrite needed, the [...slug] route handles it.
  return NextResponse.next();
}
