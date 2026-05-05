/**
 * Pure presentational body of the product detail page — gallery + text part,
 * without the SubHeader, Footer or Caller chrome.
 *
 * Shared by:
 *   - `components/ProductDetail.tsx` (public route, wraps with full chrome)
 *   - `components/admin/ProductPreview.tsx` (live preview inside admin form)
 *
 * Takes a fully resolved `Product` and a `locale`. No data fetching here —
 * pure props in, JSX out.
 */
import { ProductGallery } from './ProductGallery';
import { getDictionary } from '@/i18n/dictionaries';
import { getTagLabel } from '@/lib/seo';
import type { Locale, Product } from '@/types';

interface Props {
  product: Product;
  locale: Locale;
}

export function ProductViewBody({ product, locale }: Props) {
  const dict = getDictionary(locale);

  const quantityEntries = Array.isArray(product.quantityvar)
    ? product.quantityvar
    : Object.values(product.quantityvar ?? {});

  // Carousel shows the album only — the main `img` is the cover used on
  // grid cards (homepage / category list) and intentionally not duplicated
  // here. If the album is empty, fall back to the cover so we don't render
  // an empty gallery.
  const albumOnly = (product.albom ?? []).filter(Boolean) as string[];
  const galleryAlbum = albumOnly.length > 0 ? albumOnly : product.img ? [product.img] : [];

  return (
    <div className="contant">
      <ProductGallery
        productName={product.name || 'Розвага'}
        album={galleryAlbum}
        video={product.video}
      />

      <div className="page-text-part">
        <h1 className="label">{product.name || '—'}</h1>

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
