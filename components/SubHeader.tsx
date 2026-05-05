/**
 * Compact header used on inner pages (categories, product). Includes a back
 * arrow and a "copy link" button — the latter is the only piece that needs
 * client interactivity, so it lives in `CopyLinkButton`.
 */
import Link from 'next/link';
import Image from 'next/image';

import { SvgSelectors } from './SvgSelectors';
import { CopyLinkButton } from './CopyLinkButton';
import { Header } from './Header';
import header from '@/styles/header.module.css';
import { localePath } from '@/i18n/config';
import type { Locale } from '@/types';

interface SubHeaderProps {
  locale: Locale;
}

export function SubHeader({ locale }: SubHeaderProps) {
  return (
    <>
      {/* Render the same nav line as the home Header, without the hero. */}
      <Header locale={locale} showHero={false} />

      <div className={header.header_buttons}>
        <div className={header.header_back}>
          <Link href={localePath(locale, '/')} aria-label="Повернутися на головну">
            <SvgSelectors id="arrow" />
          </Link>
        </div>
        <Link href={localePath(locale, '/')} aria-label="Lovy Moment">
          <Image
            className={header.buttons_img}
            src="/img/logo1.png"
            alt="Lovy Moment"
            width={140}
            height={48}
            style={{ height: 'auto', maxHeight: 50 }}
            unoptimized
          />
        </Link>
        <CopyLinkButton />
      </div>
    </>
  );
}
