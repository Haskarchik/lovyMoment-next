'use client';

/**
 * "Copy current URL to clipboard" button. Uses the modern Clipboard API and
 * a small in-component notification (no global state needed).
 *
 * The legacy SPA reached for `document.getElementById('notification')` and
 * mutated classes imperatively. Here the toast is a sibling element that
 * fades out via timeout.
 */
import { useState } from 'react';

import { SvgSelectors } from './SvgSelectors';
import header from '@/styles/header.module.css';
import notification from '@/styles/notification.module.css';

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // ignore — older browsers may block clipboard, fail silently.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <>
      <button
        type="button"
        className={header.header_link}
        onClick={copy}
        aria-label="Скопіювати посилання на сторінку"
        // The legacy CSS targeted `<a class="header_link">` and assumed no
        // default user-agent styling. Reset borders/font so a `<button>` looks
        // identical to that anchor.
        style={{ border: 0, font: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <SvgSelectors id="link" />
      </button>
      <div
        className={`${notification.notification} ${copied ? notification.notification_active : ''}`}
        role="status"
        aria-live="polite"
      >
        Посилання скопійовано
      </div>
    </>
  );
}
