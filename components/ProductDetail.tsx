/**
 * Server-rendered product detail page chrome. Wraps `ProductViewBody` (the
 * pure gallery + text part) with the SubHeader, Caller, Footer and inline
 * JSON-LD (Product, Service, BreadcrumbList).
 *
 * Shared between the UK route (`app/[category]/[slug]/page.tsx`) and the EN
 * mirror (`app/en/[category]/[slug]/page.tsx`). Pass `locale` and a fully
 * resolved `Product` (already in the right language).
 */
import { SubHeader } from './SubHeader';
import { Footer } from './Footer';
import { Caller } from './Caller';
import { ProductViewBody } from './ProductViewBody';
import { breadcrumbLd } from '@/lib/page-helpers';
import { SITE_URL, getCategorySeo } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';
import { localePath } from '@/i18n/config';
import type { Locale, Product } from '@/types';

interface Props {
  product: Product;
  category: string;
  locale: Locale;
}

const AREA_SERVED: Record<Locale, string> = {
  uk: 'Львів',
  en: 'Lviv'
};

export function ProductDetail({ product, category, locale }: Props) {
  const dict = getDictionary(locale);
  const productUrl = `${SITE_URL}${localePath(locale, `/${category}/${product.slug}`)}`;
  const categoryUrl = `${SITE_URL}${localePath(locale, `/${category}`)}`;

  // De-duplicate: prefer cover + album, but skip the cover if it's already
  // the first entry of the album (admins sometimes do that).
  const ldImages = [product.img, ...(product.albom ?? [])].filter(Boolean);
  const uniqueLdImages = Array.from(new Set(ldImages)) as string[];

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.descriptions || '').trim() || `${product.name} — Lovy Moment`,
    image: uniqueLdImages.length > 0 ? uniqueLdImages : undefined,
    brand: { '@type': 'Brand', name: 'Lovy Moment' },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'UAH',
      price: (product.price.match(/\d+/g) ?? []).join('') || '0',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      seller: { '@type': 'Organization', name: 'Lovy Moment' }
    }
  };

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: product.name,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Lovy Moment',
      url: SITE_URL,
      telephone: '+380979371691'
    },
    areaServed: { '@type': 'City', name: AREA_SERVED[locale] },
    description: (product.descriptions || '').trim() || product.name
  };

  const breadLd = breadcrumbLd([
    { name: 'Lovy Moment', url: `${SITE_URL}${localePath(locale, '/')}` },
    { name: dict.categories[category] ?? category, url: categoryUrl },
    { name: product.name, url: productUrl }
  ]);

  return (
    <>
      <SubHeader locale={locale} />
      <main className="main">
        <div className="container">
          <ProductViewBody product={product} locale={locale} />
        </div>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadLd) }} />
      <Caller />
      <Footer locale={locale} />
    </>
  );
}
