/**
 * Server-rendered product detail body. Shared between the UK route
 * (`app/[category]/[slug]/page.tsx`) and the EN mirror
 * (`app/en/[category]/[slug]/page.tsx`). Pass `locale` and a fully
 * resolved `Product` (already in the right language) and the component
 * renders the gallery, description, tags, complactation, warnings and
 * quantity badges, plus inline JSON-LD (Product, Service, Breadcrumb).
 */
import { SubHeader } from './SubHeader';
import { Footer } from './Footer';
import { Caller } from './Caller';
import { ProductGallery } from './ProductGallery';
import { breadcrumbLd } from '@/lib/page-helpers';
import { SITE_URL, getTagLabel, getCategorySeo } from '@/lib/seo';
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
  const seo = getCategorySeo(category, locale);
  const productUrl = `${SITE_URL}${localePath(locale, `/${category}/${product.slug}`)}`;
  const categoryUrl = `${SITE_URL}${localePath(locale, `/${category}`)}`;

  // Schema.org Product + Service hybrid: most listings are services, but
  // Product gives Google the richest result UI.
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.descriptions || '').trim() || `${product.name} — Lovy Moment`,
    image: product.img ? [product.img, ...(product.albom ?? [])] : undefined,
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

  // Quantity widgets: legacy DB stores them as object map or array.
  const quantityEntries = Array.isArray(product.quantityvar)
    ? product.quantityvar
    : Object.values(product.quantityvar ?? {});

  return (
    <>
      <SubHeader locale={locale} />
      <main className="main">
        <div className="container">
          <div className="contant">
            <ProductGallery
              productName={product.name}
              album={[product.img, ...(product.albom ?? [])].filter(Boolean) as string[]}
              video={product.video}
            />

            <div className="page-text-part">
              <h1 className="label">{product.name}</h1>

              {product.price && (
                <div className="min-order">
                  {dict.productPage.minOrder} <span> {product.price}</span>
                </div>
              )}

              {Array.isArray(product.tags) && product.tags.length > 0 && (
                <div id="tegs" className="tegs">
                  {product.tags.map((tag) => (
                    <div key={tag} className={`tag ${tagClass(tag)}`}>
                      {getTagLabel(tag, locale)}
                    </div>
                  ))}
                </div>
              )}

              {product.descriptions?.trim() && (
                <div className="description">
                  <div className="decription-title">{dict.productPage.description}</div>
                  <div className="text">{product.descriptions}</div>
                </div>
              )}

              {Array.isArray(product.complactation) &&
                product.complactation.filter((x) => x && x.trim()).length > 0 && (
                  <div className="complactation">
                    <p>{dict.productPage.complactation}</p>
                    <ul className="complact-list">
                      {product.complactation
                        .filter((x) => x && x.trim())
                        .map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                    </ul>
                  </div>
                )}

              {product.varning && product.varning.trim() && (
                <div className="important">
                  <div className="important-label">{dict.productPage.important}</div>
                  <div className="important-text">{product.varning}</div>
                </div>
              )}

              {quantityEntries.length > 0 && (
                <div className="quantity">
                  {quantityEntries.map((q, idx) => (
                    <div key={idx} className="quantity-card">
                      <div className="number orange">{q.for}</div>
                      <p>
                        {dict.productPage.quantityPrefix}
                        {q.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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

/** Map Firebase tag to one of the legacy CSS modifier classes. */
function tagClass(tag: string): string {
  switch (tag) {
    case 'Corporate':
      return 'corporatePage';
    case 'Festival':
      return 'festivalPage';
    case 'Promotion':
      return 'promotionPage';
    case 'Trampoline':
      return 'TrampolinePage';
    case 'Child-party':
      return 'child-partyPage';
    case 'Food':
      return 'foodPage';
    case 'Carousel':
      return 'CarouselPage';
    case 'MegaGame':
      return 'MegaGamePage';
    default:
      return '';
  }
}
