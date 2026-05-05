'use client';

/**
 * Top-bar shell for every admin page. Renders the brand, the current user
 * (with avatar) and a sign-out button. If the current admin has zero
 * permissions, a "view-only" banner is shown beneath the top-bar so they
 * understand why nothing is editable.
 */
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import styles from '@/styles/admin.module.css';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, signOutUser, isReadOnly } = useAuth();

  const initials =
    user?.displayName
      ?.split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <Link href="/admin" className={styles.brand}>
          <span style={{ fontSize: 22 }}>⚙️</span>
          Lovy Moment Admin
        </Link>
        <div className={styles.userPill}>
          <span className={styles.avatar}>{initials}</span>
          <span>{user?.email}</span>
          <button className={styles.btnGhost} onClick={() => signOutUser()} style={{ padding: '6px 12px' }}>
            Вийти
          </button>
        </div>
      </div>

      {isReadOnly && (
        <div className={styles.readOnlyBanner}>
          👀 <strong>Режим перегляду</strong> · ваш акаунт не має жодного активного права. Ви бачите всі сторінки, але не можете їх редагувати.
        </div>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
