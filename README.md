# Lovy Moment — Next.js

Server-rendered, SEO-optimised rewrite of the legacy CRA project (`lovyMoment-master`).

The original SPA loaded all data through Firebase realtime listeners (`onValue`) on the
client and tried to patch `<head>` with `useEffect`. That gave a great DX but a poor SEO
result: empty initial HTML, generic meta tags, no per-product canonical/OG tags, and no
sitemap that listed individual products.

This app fixes that by:

- using **Next.js App Router** (server components by default);
- replacing realtime listeners with one-shot `get(ref())` calls (`lib/firebase.ts`);
- pre-rendering every category and product page at build with **ISR**
  (`revalidate = 600`);
- exporting a typed `Metadata` object from every route (`generateMetadata`);
- shipping `Product`/`Service`/`ItemList`/`FAQPage`/`LocalBusiness` JSON-LD;
- generating `sitemap.xml` and `robots.txt` automatically;
- using `next/image` everywhere with descriptive `alt` text built from the product name
  (no more `"Картинка Розваги"`);
- supporting locale prefixes (`/en`, `/pl`) via a thin middleware + dictionary scaffold,
  with the default locale (`uk`) staying canonical at `/`.

## Quick start

```bash
# 1. install
npm install

# 2. configure
cp .env.example .env.local
#    (Firebase keys are baked into .env.example as fallbacks too)

# 3. dev
npm run dev    # http://localhost:3000

# 4. build & run
npm run build
npm start
```

## URL map

| Old (CRA SPA)        | New (Next.js, default locale)        |
|----------------------|--------------------------------------|
| `/`                  | `/`                                  |
| `/Atractions`        | `/atractions`                        |
| `/MegaGame`          | `/megagame`                          |
| `/Animators`         | `/animators`                         |
| `/Food`              | `/food`                              |
| `/Other`             | `/other`                             |
| `/Child-party`       | `/child-party`                       |
| `/Corporate`         | `/corporate`                         |
| `/Promotion`         | `/promotion`                         |
| `/Trampoline`        | `/trampoline`                        |
| `/AboutUs`           | `/about-us`                          |
| `/Page/Batyt`        | `/atractions/batut-batyt`            |

The legacy URLs are kept alive via `301` redirects (`next.config.mjs`) so every link
already shared on the web continues to work.

Locale-prefixed copies: `/en/...`, `/pl/...` (placeholder dictionaries — drop real
translations into `i18n/dictionaries.ts`).

## Project structure

```
app/
  layout.tsx              ← root layout, global JSON-LD, Metadata defaults
  page.tsx                ← home page (uk)
  not-found.tsx
  sitemap.ts
  robots.ts
  about-us/page.tsx
  [category]/page.tsx               ← /atractions, /food, …
  [category]/[slug]/page.tsx        ← /atractions/batut-batyt
  en/page.tsx                       ← /en (architecture stub)
  pl/page.tsx                       ← /pl (architecture stub)

components/
  Header.tsx              ← server, hero variant for home
  SubHeader.tsx           ← server, compact variant for inner pages
  CopyLinkButton.tsx      ← 'use client' — clipboard + toast
  Footer.tsx              ← server
  Caller.tsx              ← server (mobile floating call button)
  SeactionBlock.tsx       ← home category cards
  ProductGrid.tsx         ← <Image /> + Link list of products
  AllEntertiments.tsx     ← home "all" section wrapper
  ProductGallery.tsx      ← 'use client' — Swiper + ReactPlayer + modal
  SvgSelectors.tsx        ← inline SVG icons w/ aria-labels

lib/
  firebase.ts             ← `get()`-based RTDB access (no listeners!)
  slug.ts                 ← Cyrillic → ASCII slugs
  seo.ts                  ← single source of truth for titles/descriptions

i18n/
  config.ts               ← locales, defaultLocale, localePath helper
  dictionaries.ts         ← server-only string dictionaries (uk + stubs)

types/
  index.ts                ← Product type + CATEGORY_TAG_MAP

middleware.ts             ← passes locale-prefixed paths through unchanged

styles/                   ← copied as-is from the legacy CRA project
public/                   ← logos, icons, category cards, About-Us photos
```

## How data flows

1. Server entry (`page.tsx`) calls `getAllProducts()` / `getProductsByCategory()` /
   `getProductById()`.
2. Each helper does a single `get(ref(db, …))` call. Next's fetch cache + `revalidate`
   directive turn that into 10-minute ISR.
3. `normalise()` in `lib/firebase.ts` converts the raw RTDB row into a typed
   `Product` and computes a stable `slug` + primary `category`.
4. Routes pre-render every product at build time via `generateStaticParams`. Anything
   added afterwards is served with `dynamicParams = true` and revalidated on demand.

## SEO checklist

- [x] All HTML rendered on the server, no client-only `<head>` mutations
- [x] Per-page `generateMetadata` (title, description, canonical, OG, Twitter, alternates)
- [x] `LocalBusiness` + `FAQPage` JSON-LD in root layout
- [x] `Product` + `Service` JSON-LD on every product page
- [x] `ItemList` JSON-LD on every category page
- [x] `sitemap.xml` lists every locale × product combination
- [x] `robots.txt` allows everything except `/admin`
- [x] All `<img>` swapped for `next/image` with descriptive, product-specific `alt`
- [x] hreflang alternates wired up via `Metadata.alternates.languages`
- [x] Static generation + ISR (`revalidate = 600`) for snappy TTFB

## Multilingual data schema

Localised product fields use a `<field>_<locale>` suffix in Firebase RTDB.
Existing entries that have only Ukrainian copy continue to work — the resolver
falls back to the default-locale field, then to any available translation.

Example row (mixed UK + EN):

```json
{
  "id": "Minion-7",
  "name": "Надувна гірка \"Мега Посіпаки\"",
  "name_en": "Mega Minions inflatable slide",

  "descriptions":    "Розміри: 16м × 8м × 12м, до 13 дітей одночасно",
  "descriptions_en": "Dimensions: 16m × 8m × 12m, up to 13 kids at once",

  "varning":    "На місце монтажу доставка автомобілем.",
  "varning_en": "We deliver to your location by car.",

  "price": "13800 грн / 6 год",
  "img":   "https://firebasestorage.googleapis.com/...",
  "albom": ["https://...", "https://..."],
  "tags":  ["Atractions", "Festival", "Child-party", "Corporate"]
}
```

Fields that are language-agnostic stay flat: `id`, `img`, `albom`, `price`,
`tags`, `video`. Only text content (`name`, `descriptions`, `varning`,
`complactation[]`) gets the suffix.

To translate a product into a new language, just add the suffixed fields —
no migration of existing rows is needed. The resolver lives in
`lib/i18n-utils.ts` and is exercised by every Firebase fetch.

## Adding a new locale

1. Add the locale code to `i18n/config.ts > locales` and `localeOgTags`.
2. Translate UI strings in `i18n/dictionaries.ts`.
3. Add SEO copy to `lib/seo.ts > getCategorySeo` and `getHomeSeo`.
4. Mirror the route tree under `app/<lang>/` (you can copy `app/en/page.tsx`,
   `app/en/[category]/page.tsx`, `app/en/[category]/[slug]/page.tsx`,
   `app/en/about-us/page.tsx`).
5. Add the locale to `LOCALES_FOR_PRODUCT_ROUTES` in `app/sitemap.ts` so
   sitemap entries are emitted.

## Locale URL map

| UK (default)               | EN                         |
|----------------------------|----------------------------|
| `/`                        | `/en`                      |
| `/about-us`                | `/en/about-us`             |
| `/atractions`              | `/en/atractions`           |
| `/atractions/<slug>`       | `/en/atractions/<slug>`    |
| `/sitemap.xml`, `/robots.txt` are shared and list every locale's URLs.   |


## Notes on the migration

- Realtime listeners are gone. The DB is read-only here; the admin tool that writes
  to RTDB still lives in the legacy app.
- The single `Page/<id>` route became `/<category>/<slug>` so URLs read like
  `/atractions/batut-batyt` instead of `/Page/Batyt`.
- The legacy `Image` component (`<img src={PUBLIC_URL + link} alt="Картинка Розваги"/>`)
  was replaced with `next/image` instances that build a unique `alt` from the product
  name.
- `useEffect`-driven `document.title` swaps from `App.js` and `AboutUs.jsx` were removed
  entirely; metadata now comes from the route's `generateMetadata`.
