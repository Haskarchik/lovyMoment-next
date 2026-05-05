/**
 * Centralised SEO copy for every locale. Each locale has its own home and
 * category SEO blocks. `getCategorySeo(category, locale)` is the single
 * lookup used by every page's `generateMetadata`.
 */
import type { Locale } from '@/types';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lovymoment.com';

export const SITE_NAME = 'Lovy Moment';

export interface PageSeo {
  title: string;
  description: string;
  keywords: string;
}

const CATEGORY_SEO_UK: Record<string, PageSeo> = {
  atractions: {
    title: 'Атракціони у Львові — Надувні гірки, батути | Lovy Moment',
    description:
      'Оренда атракціонів у Львові: надувні гірки, батутні комплекси, лабіринти. Безпечні та якісні атракціони для дитячих свят та корпоративів від Lovy Moment.',
    keywords:
      'атракціони львів, надувні гірки львів, батути оренда, лабіринти для дітей, атракціони на свято, надувні комплекси'
  },
  megagame: {
    title: 'Ігри та активності у Львові — Квести, воркшопи | Lovy Moment',
    description:
      'Організація ігор та активностей у Львові: інтерактивні квести, творчі воркшопи, командні ігри. Розваги для будь-якого віку від Lovy Moment.',
    keywords:
      'ігри львів, квести для дітей, воркшопи львів, активності на свято, командні ігри, розваги для дітей'
  },
  animators: {
    title: 'Аніматори у Львові — Персонажі, майстер-класи | Lovy Moment',
    description:
      'Професійні аніматори у Львові з улюбленими персонажами. Індивідуальні сценарії, майстер-класи, живе спілкування з дітьми від Lovy Moment.',
    keywords:
      'аніматори львів, персонажі на свято, майстер класи для дітей, аніматори на день народження, дитячі свята львів'
  },
  food: {
    title: 'Кейтеринг у Львові — Солодка вата, попкорн | Lovy Moment',
    description:
      'Кейтеринг для свят у Львові: солодка вата, попкорн, напої. Смачні та якісні ласощі для дитячих та дорослих свят від Lovy Moment.',
    keywords:
      'кейтеринг львів, солодка вата, попкорн на свято, напої для свята, їжа на день народження'
  },
  'child-party': {
    title: 'Дитячі свята у Львові — Організація дня народження | Lovy Moment',
    description:
      'Організація дитячих свят у Львові: дні народження, тематичні вечірки. Атракціони, аніматори, ігри — все для незабутнього свята від Lovy Moment.',
    keywords:
      'дитячі свята львів, день народження дитини, організація дитячого свята, тематичні вечірки для дітей'
  },
  corporate: {
    title: 'Корпоративні заходи у Львові — Тімбілдинги | Lovy Moment',
    description:
      'Організація корпоративних заходів у Львові: тімбілдинги, корпоративи, ділові заходи. Професійна організація від Lovy Moment.',
    keywords:
      'корпоративи львів, тімбілдинг, корпоративні заходи, ділові заходи львів, організація корпоративів'
  },
  promotion: {
    title: 'Промоакції у Львові — Активності для бренду | Lovy Moment',
    description:
      'Організація промоакцій у Львові: атракціони, розваги, активності для просування бренду. Lovy Moment — професійна організація.',
    keywords:
      'промоакції львів, активності для бренду, BTL у Львові, реклама на заходах'
  },
  trampoline: {
    title: 'Надувні гірки та батути у Львові | Lovy Moment',
    description:
      'Оренда надувних гірок та батутних комплексів у Львові. Безпечно, весело та яскраво для дитячих свят від Lovy Moment.',
    keywords:
      'надувні гірки львів, батути оренда, надувні атракціони, гірки для дітей'
  },
  other: {
    title: 'Інше обладнання для свят у Львові | Lovy Moment',
    description:
      'Додаткове обладнання для свят у Львові: звукове обладнання, декорації, технічне забезпечення заходів від Lovy Moment.',
    keywords:
      'обладнання для свят львів, звукове обладнання, декорації на свято, технічне забезпечення'
  },
  'about-us': {
    title:
      'Про нас — Lovy Moment | Команда професіоналів організації свят у Львові',
    description:
      'Lovy Moment — команда з 10+ років досвіду організації свят у Львові. 1000+ задоволених клієнтів. Атракціони, аніматори, ігри, кейтеринг.',
    keywords:
      'про lovy moment, команда організації свят, досвід роботи львів, професіонали атракціонів, історія компанії'
  }
};

const CATEGORY_SEO_EN: Record<string, PageSeo> = {
  atractions: {
    title: 'Attractions in Lviv — Inflatable slides, trampolines | Lovy Moment',
    description:
      'Rent attractions in Lviv: inflatable slides, trampoline complexes, mazes. Safe and high-quality attractions for children\'s parties and corporate events from Lovy Moment.',
    keywords:
      'attractions Lviv, inflatable slides Lviv, trampolines rent, mazes for kids, party attractions, inflatable complexes'
  },
  megagame: {
    title: 'Games & Activities in Lviv — Quests, workshops | Lovy Moment',
    description:
      'Games and activities in Lviv: interactive quests, creative workshops, team games. Entertainment for any age from Lovy Moment.',
    keywords: 'games Lviv, quests for kids, workshops Lviv, party activities, team games, entertainment for kids'
  },
  animators: {
    title: 'Animators in Lviv — Characters & master-classes | Lovy Moment',
    description:
      'Professional animators in Lviv with favourite characters. Individual scripts, master-classes, live interaction with kids from Lovy Moment.',
    keywords: 'animators Lviv, party characters, master-classes for kids, birthday animators, kids parties Lviv'
  },
  food: {
    title: 'Catering in Lviv — Cotton candy, popcorn | Lovy Moment',
    description:
      'Party catering in Lviv: cotton candy, popcorn, drinks. Delicious and high-quality treats for kids\' and adults\' parties from Lovy Moment.',
    keywords: 'catering Lviv, cotton candy, popcorn party, party drinks, birthday food'
  },
  'child-party': {
    title: 'Kids parties in Lviv — Birthday organisation | Lovy Moment',
    description:
      'Kids parties in Lviv: birthdays, themed parties. Attractions, animators, games — everything for an unforgettable celebration from Lovy Moment.',
    keywords: 'kids parties Lviv, child birthday, kids party planning, themed parties for kids'
  },
  corporate: {
    title: 'Corporate events in Lviv — Team-building | Lovy Moment',
    description:
      'Corporate event planning in Lviv: team-building, corporate parties, business events. Professional organisation from Lovy Moment.',
    keywords: 'corporate Lviv, team-building, corporate events, business events Lviv'
  },
  promotion: {
    title: 'Promotional events in Lviv — Brand activations | Lovy Moment',
    description:
      'Promotional events in Lviv: attractions, entertainment and brand activations. Lovy Moment — professional event organisation.',
    keywords: 'promotional events Lviv, brand activations, BTL Lviv, event advertising'
  },
  trampoline: {
    title: 'Inflatable slides & trampolines in Lviv | Lovy Moment',
    description:
      'Rent inflatable slides and trampoline complexes in Lviv. Safe, fun and bright for kids\' parties from Lovy Moment.',
    keywords: 'inflatable slides Lviv, trampolines rent, inflatable attractions, slides for kids'
  },
  other: {
    title: 'Other event equipment in Lviv | Lovy Moment',
    description: 'Additional event equipment in Lviv: sound equipment, decorations, technical support from Lovy Moment.',
    keywords: 'event equipment Lviv, sound equipment, party decorations, technical support'
  },
  'about-us': {
    title: 'About us — Lovy Moment | Lviv event professionals',
    description:
      'Lovy Moment — 10+ years of organising parties in Lviv. 1000+ happy clients. Attractions, animators, games, catering.',
    keywords: 'about lovy moment, event team, lviv experience, attractions professionals, company story'
  }
};

const HOME_SEO_BY_LOCALE: Record<Locale, PageSeo> = {
  uk: {
    title:
      'Lovy Moment — Організація свят у Львові | Атракціони, Аніматори, Розваги',
    description:
      'Lovy Moment — організація яскравих свят у Львові та області. Атракціони, аніматори, ігри, кейтеринг. Понад 10 років досвіду, 1000+ задоволених клієнтів. ☎️ 097 937 16 91',
    keywords:
      'організація свят львів, атракціони львів, аніматори львів, дитячі свята, корпоративи, батути, надувні гірки, розваги для дітей, святкування дня народження, lovy moment'
  },
  en: {
    title: 'Lovy Moment — Event organisation in Lviv | Attractions, Animators, Entertainment',
    description:
      'Lovy Moment — bright party organisation in Lviv & region. Attractions, animators, games, catering. 10+ years of experience, 1000+ happy clients. ☎️ 097 937 16 91',
    keywords:
      'event organisation Lviv, attractions Lviv, animators Lviv, kids parties, corporate, trampolines, inflatable slides, entertainment for kids, birthday celebration, lovy moment'
  }
};

const CATEGORY_SEO_BY_LOCALE: Record<Locale, Record<string, PageSeo>> = {
  uk: CATEGORY_SEO_UK,
  en: CATEGORY_SEO_EN
};

export function getHomeSeo(locale: Locale): PageSeo {
  return HOME_SEO_BY_LOCALE[locale] ?? HOME_SEO_BY_LOCALE.uk;
}

export function getCategorySeo(category: string, locale: Locale): PageSeo | undefined {
  return CATEGORY_SEO_BY_LOCALE[locale]?.[category] ?? CATEGORY_SEO_BY_LOCALE.uk[category];
}

/** Backwards-compatible exports for code that hasn't migrated yet. */
export const CATEGORY_SEO = CATEGORY_SEO_UK;
export const HOME_SEO = HOME_SEO_BY_LOCALE.uk;
export const SITE_DEFAULT_DESCRIPTION = HOME_SEO_BY_LOCALE.uk.description;

/** Translate a Firebase tag value into a UI label. */
const TAG_LABELS_UK: Record<string, string> = {
  Corporate: 'Корпоратив',
  Festival: 'Фестиваль',
  Promotion: 'Промоакція',
  Trampoline: 'Надувні гірки та батути',
  'Child-party': 'Дитяче свято',
  Food: 'Кейтеринг',
  Carousel: 'Карусель',
  MegaGame: 'Мега ігри',
  Atractions: 'Атракціони',
  Animators: 'Аніматори',
  Other: 'Обладнання',
  'City-day': 'День міста'
};
const TAG_LABELS_EN: Record<string, string> = {
  Corporate: 'Corporate',
  Festival: 'Festival',
  Promotion: 'Promotion',
  Trampoline: 'Inflatable slides & trampolines',
  'Child-party': 'Kids party',
  Food: 'Catering',
  Carousel: 'Carousel',
  MegaGame: 'Mega games',
  Atractions: 'Attractions',
  Animators: 'Animators',
  Other: 'Equipment',
  'City-day': 'City day'
};
const TAG_LABELS_BY_LOCALE: Record<Locale, Record<string, string>> = {
  uk: TAG_LABELS_UK,
  en: TAG_LABELS_EN
};

export function getTagLabel(tag: string, locale: Locale): string {
  return TAG_LABELS_BY_LOCALE[locale]?.[tag] ?? TAG_LABELS_UK[tag] ?? tag;
}

/** Backwards-compatible export. */
export const TAG_LABELS = TAG_LABELS_UK;
