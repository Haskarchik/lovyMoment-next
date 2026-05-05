/**
 * EN product detail page (`/en/atractions/<slug>`).
 * Mirrors `app/[category]/[slug]/page.tsx` with locale='en'.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductDetail } from '@/components/ProductDetail';
import { getAllProducts, getProductById } from '@/lib/firebase';
import { idFromSlug } from '@/lib/slug';
import { productMetadata } from '@/lib/page-helpers';
import { CATEGORY_SLUGS } from '@/types';

const LOCALE = 'en' as const;

export const revalidate = 600;
export const dynamicParams = true;

interface Params {
  params: { category: string; slug: string };
}

export async function generateStaticParams() {
  const products = await getAllProducts(LOCALE).catch(() => []);
  return products.map((p) => ({
    category: p.category ?? 'other',
    slug: p.slug ?? p.id.toLowerCase()
  }));
}

async function loadProduct(slug: string) {
  const id = idFromSlug(slug);
  const direct = await getProductById(id, LOCALE).catch(() => null);
  if (direct && direct.slug === slug) return direct;
  if (direct) return direct;
  const all = await getAllProducts(LOCALE);
  return all.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await loadProduct(params.slug);
  if (!product) return {};
  return productMetadata(params.category, product, LOCALE);
}

export default async function ProductPageEn({ params }: Params) {
  if (!CATEGORY_SLUGS.includes(params.category)) notFound();
  const product = await loadProduct(params.slug);
  if (!product) notFound();
  return <ProductDetail product={product} category={params.category} locale={LOCALE} />;
}
