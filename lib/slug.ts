/**
 * Utilities to convert Cyrillic product names into SEO-friendly ASCII slugs
 * and to keep a stable mapping back to the Firebase entity id.
 *
 * The new public URLs look like:
 *   /atractions/naduvni-hirky-batyt
 *   /food/solodka-vata
 *
 * The slug is derived from the product `name` (Ukrainian), transliterated and
 * suffixed with the original Firebase id to guarantee uniqueness.
 */

const CYR_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ie',
  ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'i', й: 'i', к: 'k', л: 'l',
  м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
  ю: 'iu', я: 'ia', "'": '', ʼ: '', ы: 'y', э: 'e', ё: 'e', ъ: ''
};

export function transliterate(input: string): string {
  if (!input) return '';
  let out = '';
  for (const raw of input.toLowerCase()) {
    out += CYR_MAP[raw] !== undefined ? CYR_MAP[raw] : raw;
  }
  return out;
}

export function slugify(input: string): string {
  const ascii = transliterate(input);
  return ascii
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Build a stable URL slug for a product. The Firebase id is appended (lowered)
 * so that two products with the same display name still get distinct URLs and
 * we can reverse-lookup quickly.
 */
export function productSlug(name: string, id: string): string {
  const base = slugify(name) || 'item';
  const safeId = slugify(id) || 'x';
  return base.endsWith(safeId) ? base : `${base}-${safeId}`;
}

/** Extract Firebase id from a slug produced by `productSlug`. */
export function idFromSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}
