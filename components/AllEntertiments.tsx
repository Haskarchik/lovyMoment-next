/**
 * Server-rendered "all entertainments" section for the homepage. The full
 * list comes from RTDB; we render every item up-front (SSR/ISR) so search
 * engines see all products without JavaScript.
 */
import allEntirementsStyle from '@/styles/allEntertiments.module.css';
import { ProductGrid } from './ProductGrid';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale, Product } from '@/types';

interface Props {
  locale: Locale;
  products: Product[];
}

export function AllEntertiments({ locale, products }: Props) {
  const dict = getDictionary(locale);
  const ariaLabel = `${dict.sections.allTitle} ${dict.sections.allTitleAccent}`;
  return (
    <section id="entertiment" className={allEntirementsStyle.container} aria-label={ariaLabel}>
      <div className={allEntirementsStyle.entertiment_label}>
        <h2>
          {dict.sections.allTitle} <span>{dict.sections.allTitleAccent}</span>
        </h2>
        <div className={allEntirementsStyle.counter}>{products.length}</div>
      </div>

      <ProductGrid locale={locale} products={products} />
    </section>
  );
}
