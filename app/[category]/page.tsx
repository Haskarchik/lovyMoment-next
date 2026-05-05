/**
 * UK category landing page, e.g. `/atractions`, `/animators`, `/food`.
 *
 * Implementation notes:
 *  - We rely on a static set of category slugs (CATEGORY_TAG_MAP). Anything
 *    else (including product slugs) is delegated to the dynamic product
 *    route `/[category]/[slug]/page.tsx`.
 *  - Pages are statically generated at build (`generateStaticParams`) and
 *    re-validated every 10 minutes (`revalidate = 600`) via ISR.
 *  - The English mirror lives at `app/en/[category]/page.tsx` and reuses the
 *    same data + metadata helpers with locale='en'.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SubHeader } from '@/components/SubHeader';
import { ProductGrid } from '@/components/ProductGrid';
import { Footer } from '@/components/Footer';
import { Caller } from '@/components/Caller';
import { getProductsByCategory } from '@/lib/firebase';
import { getCategorySeo, SITE_URL } from '@/lib/seo';
import { categoryMetadata, breadcrumbLd } from '@/lib/page-helpers';
import { getDictionary } from '@/i18n/dictionaries';
import { CATEGORY_SLUGS } from '@/types';
import allEntirementsStyle from '@/styles/allEntertiments.module.css';

const LOCALE = 'uk' as const;

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

interface Params {
  params: { category: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return categoryMetadata(params.category, LOCALE);
}

export default async function CategoryPage({ params }: Params) {
  const { category } = params;
  if (!CATEGORY_SLUGS.includes(category)) notFound();

  const dict = getDictionary(LOCALE);
  const products = await getProductsByCategory(category, LOCALE);
  const heading = dict.categories[category] ?? category;
  const seo = getCategorySeo(category, LOCALE);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: seo?.title ?? heading,
    numberOfItems: products.length,
    itemListElement: products.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/${category}/${p.slug}`,
      name: p.name
    }))
  };

  const breadLd = breadcrumbLd([
    { name: 'Lovy Moment', url: SITE_URL },
    { name: heading, url: `${SITE_URL}/${category}` }
  ]);

  return (
    <>
      <SubHeader locale={LOCALE} />
      <main className={allEntirementsStyle.container}>
        <div className={allEntirementsStyle.entertiment_label}>
          <h1>{heading}</h1>
          <div className={allEntirementsStyle.counter}>{products.length}</div>
        </div>
        <ProductGrid locale={LOCALE} products={products} />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadLd) }} />
      <Caller />
      <Footer locale={LOCALE} />
    </>
  );
}
