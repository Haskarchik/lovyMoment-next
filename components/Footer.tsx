/**
 * Site footer with phone numbers and social links. Server component — no
 * interactivity needed.
 */
import Link from 'next/link';
import { SvgSelectors } from './SvgSelectors';
import { FooterLocale } from './FooterLocale';
import { localePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/types';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = getDictionary(locale);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-row">
          <div className="footer-info">
            <div className="footer-infp-label">
              {dict.footer.callUs} <span> {dict.footer.callUsHighlight} </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="tel:+380638604966" className="phone-number">+38 (063) 860 49 66</a>
              <a href="tel:+380979371691" className="phone-number">+38 (097) 937 16 91</a>
            </div>
            <div className="footer-info-text footer-text">
              {dict.footer.workingHours}
            </div>
          </div>

          <div className="footer-socials">
            <div className="footer-socials-text footer-text">{dict.footer.or}</div>
            <ul className="footer-socials-list">
              <li>
                <a href="https://wa.me/380979371691" rel="noopener noreferrer" target="_blank">
                  <SvgSelectors id="watsap" />WhatsApp
                </a>
              </li>
              <li>
                <a href="viber://add?number=380979371691">
                  <SvgSelectors id="viber" />Viber
                </a>
              </li>
              <li>
                <a href="https://t.me/pavluyk" rel="noopener noreferrer" target="_blank">
                  <SvgSelectors id="telegram" />Telegram
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/lovymomentlviv/" rel="noopener noreferrer" target="_blank">
                  <SvgSelectors id="instagram" />Instagram
                </a>
              </li>
              <li>
                <Link href={localePath(locale, '/about-us')}>
                  <SvgSelectors id="about" />{dict.nav.aboutUs}
                </Link>
              </li>
              <FooterLocale active={locale} />
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
