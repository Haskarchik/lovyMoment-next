'use client';

/**
 * Live preview panel for the admin form. Two parts stacked:
 *
 *   1. <HomeCardPreview/> — how the product looks as a tile on the home /
 *      category grid (cover photo + name + price + "Деталі" badge).
 *   2. <ProductViewBody/> — the full product detail page.
 *
 * A locale chip toggles UK / EN previews on the fly.
 */
import { useState } from 'react';

import { ProductViewBody } from '../ProductViewBody';
import { HomeCardPreview } from './HomeCardPreview';
import type { Locale, Product } from '@/types';
import styles from '@/styles/admin.module.css';

interface Props {
  product: Product;
  onLocaleChange?: (locale: Locale) => void;
}

export function ProductPreview({ product, onLocaleChange }: Props) {
  const [locale, setLocale] = useState<Locale>('uk');

  function pick(l: Locale) {
    setLocale(l);
    onLocaleChange?.(l);
  }

  return (
    <div className={styles.previewCard}>
      <div className={styles.previewLabel}>
        Live preview · {locale === 'uk' ? 'українська' : 'english'}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          type="button"
          className={`${styles.tagOption} ${locale === 'uk' ? styles.tagOptionActive : ''}`}
          onClick={() => pick('uk')}
        >
          🇺🇦 UK
        </button>
        <button
          type="button"
          className={`${styles.tagOption} ${locale === 'en' ? styles.tagOptionActive : ''}`}
          onClick={() => pick('en')}
        >
          🇬🇧 EN
        </button>
      </div>

      {/* Card preview — matches the home/category grid */}
      <div className={styles.previewLabel} style={{ marginTop: 4 }}>
        Як виглядатиме картка на головному екрані
      </div>
      <div
        className={styles.previewFrame}
        style={{ display: 'flex', justifyContent: 'center', padding: 20 }}
      >
        <HomeCardPreview product={product} locale={locale} />
      </div>

      {/* Full detail page preview */}
      <div className={styles.previewLabel} style={{ marginTop: 24 }}>
        Як виглядатиме сторінка товару
      </div>
      <div className={styles.previewFrame}>
        <ProductViewBody product={product} locale={locale} />
      </div>
    </div>
  );
}
