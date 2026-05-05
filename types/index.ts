/**
 * Shape of a single product/service entry in Firebase Realtime Database.
 *
 * Multilingual schema
 * -------------------
 * Localised fields use a `<field>_<locale>` suffix:
 *
 *   {
 *     "name":         "Надувна гірка \"Мега Посіпаки\"",  // default (uk)
 *     "name_en":      "Mega Minions inflatable slide",     // optional
 *     "name_pl":      "Dmuchana zjeżdżalnia Mega Minionki",
 *
 *     "descriptions":    "Розміри: 16м × 8м × 12м …",
 *     "descriptions_en": "Dimensions: 16m × 8m × 12m …",
 *
 *     "varning":    "На місце монтажу доставка автомобілем.",
 *     "varning_en": "Delivered to your location by car.",
 *
 *     "id": "Minion-7",
 *     "img": "https://…",
 *     "price": "13800 грн / 6 год",
 *     "tags": ["Atractions", "Festival", …],
 *     "albom": ["…"]
 *   }
 *
 *   - Legacy entries (no `_en` / `_pl` fields) automatically render as UK,
 *     so the existing 52-row DB export continues to work unchanged.
 *   - Adding a translation is a single-field DB update — no migration needed.
 *   - Shared fields (`img`, `albom`, `price`, `tags`, `id`) are
 *     locale-agnostic.
 */
export interface QuantityVar {
  for: number;
  name: string;
}

/** Raw row as it appears in Firebase RTDB. */
export interface RawProduct {
  id: string;
  name: string;
  name_en?: string;
  img?: string;
  price?: string;
  descriptions?: string;
  descriptions_en?: string;
  varning?: string;
  varning_en?: string;
  video?: string;
  albom?: string[];
  complactation?: string[];
  complactation_en?: string[];
  tags?: string[];
  quantityvar?: Record<string, QuantityVar> | QuantityVar[];
}

/**
 * Locale-resolved Product. Every text field is already the correct language —
 * components render this and never need to know about `_en` / `_pl` suffixes.
 */
export interface Product {
  id: string;
  /** Resolved name in the requested locale (with safe UK fallback). */
  name: string;
  img: string;
  price: string;
  descriptions?: string;
  varning?: string;
  video?: string;
  albom?: string[];
  complactation?: string[];
  tags?: string[];
  quantityvar?: Record<string, QuantityVar> | QuantityVar[];
  /** Derived URL slug for the resolved locale, e.g. "naduvna-hirka-batut". */
  slug?: string;
  /** Derived primary category for routing (lower-case ascii). */
  category?: string;
  /** Locale this Product was resolved into. */
  locale: Locale;
}

export type Locale = 'uk' | 'en';

export const LOCALES: Locale[] = ['uk', 'en'];
export const DEFAULT_LOCALE: Locale = 'uk';

/** Mapping between url slugs (kebab-case ascii) and Firebase tag values. */
export const CATEGORY_TAG_MAP: Record<string, string> = {
  atractions: 'Atractions',
  megagame: 'MegaGame',
  animators: 'Animators',
  food: 'Food',
  other: 'Other',
  'child-party': 'Child-party',
  corporate: 'Corporate',
  promotion: 'Promotion',
  trampoline: 'Trampoline'
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_TAG_MAP);
