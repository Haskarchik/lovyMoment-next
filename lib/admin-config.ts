/**
 * Admin access config.
 *
 *   Root admins (`NEXT_PUBLIC_ROOT_ADMIN_EMAILS` in `.env`)
 *     - Always allowed in. Bootstraps the system on first login when RTDB
 *       has no `/admins` entries yet.
 *     - Cannot be removed via the UI — they're hardcoded for safety.
 *
 *   Stored admins (`/admins/<emailEscaped>: true` in RTDB)
 *     - Managed by any current admin (root or stored) via `/admin/admins`.
 *     - Granular and instantly revocable without redeploy.
 *
 * Email is escaped to a Firebase-safe key by replacing every `.` with `,`
 * (RTDB keys can't contain `.`).
 */

const RAW =
  process.env.NEXT_PUBLIC_ROOT_ADMIN_EMAILS ??
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ??
  'pavlo@clasify.com';

export const ROOT_ADMIN_EMAILS: string[] = RAW.split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isRootAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ROOT_ADMIN_EMAILS.includes(email.toLowerCase());
}

/** Convert "user@example.com" → "user@example,com" so it can be a RTDB key. */
export function emailToKey(email: string): string {
  return email.toLowerCase().replace(/\./g, ',');
}

/** Reverse `emailToKey` for display. */
export function keyToEmail(key: string): string {
  return key.replace(/,/g, '.');
}

/** Backwards-compatible export for any code that still imports the old name. */
export const ADMIN_EMAILS = ROOT_ADMIN_EMAILS;
export function isAdminEmail(email: string | null | undefined): boolean {
  return isRootAdmin(email);
}

/* ───────────── Permission flags ───────────── */

export interface AdminPermissions {
  /** Create / edit existing products. */
  canEdit: boolean;
  /** Delete products. */
  canDelete: boolean;
  /** Upload photos to Firebase Storage. */
  canUpload: boolean;
  /** Grant or revoke other admins' access. */
  canManageAdmins: boolean;
}

export type Capability = keyof AdminPermissions;

export const ADMIN_CAPABILITIES: Capability[] = [
  'canEdit',
  'canDelete',
  'canUpload',
  'canManageAdmins'
];

export const ADMIN_PERMISSION_LABELS: Record<Capability, string> = {
  canEdit: 'Редагувати товари',
  canDelete: 'Видаляти товари',
  canUpload: 'Завантажувати фото',
  canManageAdmins: 'Керувати адмінами'
};

export const ADMIN_PERMISSION_DESCRIPTIONS: Record<Capability, string> = {
  canEdit: 'Створювати нові та редагувати існуючі товари',
  canDelete: 'Назавжди видаляти товари з каталогу',
  canUpload: 'Завантажувати зображення у Firebase Storage',
  canManageAdmins: 'Давати або забирати доступ іншим адмінам'
};

/** Root admins always have every permission. */
export const FULL_PERMISSIONS: AdminPermissions = {
  canEdit: true,
  canDelete: true,
  canUpload: true,
  canManageAdmins: true
};

/** Sensible starting set for a freshly added admin: can edit & upload, but
 *  delete and admin management are explicit grants. */
export const DEFAULT_PERMISSIONS: AdminPermissions = {
  canEdit: true,
  canDelete: false,
  canUpload: true,
  canManageAdmins: false
};

export const NO_PERMISSIONS: AdminPermissions = {
  canEdit: false,
  canDelete: false,
  canUpload: false,
  canManageAdmins: false
};

/** Coerce any RTDB value (legacy `true`, partial object, …) into a full set. */
export function parsePermissions(value: unknown): AdminPermissions {
  if (value === true) return { ...FULL_PERMISSIONS };
  if (value && typeof value === 'object') {
    const v = value as Partial<AdminPermissions>;
    return {
      canEdit: !!v.canEdit,
      canDelete: !!v.canDelete,
      canUpload: !!v.canUpload,
      canManageAdmins: !!v.canManageAdmins
    };
  }
  return { ...NO_PERMISSIONS };
}
