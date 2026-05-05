'use client';

/**
 * Preview of how the product looks as a card in the home grid (the
 * `<ProductGrid />` on `/`, `/atractions`, …). Uses the public-site CSS
 * module classes so the card matches pixel-for-pixel.
 *
 * Rendered above the full product-detail preview inside `<ProductPreview />`.
 */
import allEntirementsStyle from '@/styles/allEntertiments.module.css';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale, Product } from '@/types';

interface Props {
  product: Product;
  locale: Locale;
}

export function HomeCardPreview({ product, locale }: Props) {
  const dict = getDictionary(locale);
  const cover = product.img;

  return (
    <div className={allEntirementsStyle.entertiment_row} style={{ margin: 0 }}>
      <div className={allEntirementsStyle.entertiment_card} style={{ margin: 0 }}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={product.name} />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 24,
              background: 'repeating-linear-gradient(45deg, #eef2ff, #eef2ff 8px, #f8fafc 8px, #f8fafc 16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: 12,
              fontFamily: 'Rubik, sans-serif'
            }}
          >
            Немає головного фото
          </div>
        )}
        <div className={allEntirementsStyle.gradiant}>
          <span className={allEntirementsStyle.more_btn}>{dict.sections.details}</span>
          <div className={allEntirementsStyle.entertiment_card_label}>
            <p>{product.name || '—'}</p>
            <div className={allEntirementsStyle.price}>{product.price || ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
