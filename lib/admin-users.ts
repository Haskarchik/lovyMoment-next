'use client';

/**
 * Admin whitelist + per-user permissions stored in Firebase RTDB.
 *
 * Schema:
 *   /admins/<emailEscaped>: {
 *     canEdit: true,
 *     canDelete: false,
 *     canUpload: true,
 *     canManageAdmins: false
 *   }
 *
 * Backwards compatibility: legacy entries store `true` instead of an object.
 * `parsePermissions()` (in admin-config) treats `true` as full permissions
 * and missing fields as `false`.
 *
 * The auth flow only checks "does the entry exist?" — granular gating is
 * done client-side via the AuthProvider. RTDB security rules keep the
 * whitelist itself tamper-proof, so a malicious actor still can't bypass
 * permissions by editing local state.
 */
import { ref, get, set, remove } from 'firebase/database';

import { clientDb } from './firebase-client';
import {
  emailToKey,
  keyToEmail,
  parsePermissions,
  DEFAULT_PERMISSIONS,
  type AdminPermissions
} from './admin-config';

export interface StoredAdmin {
  email: string;
  permissions: AdminPermissions;
}

/** Quick "does an entry exist?" check used during sign-in. */
export async function isStoredAdmin(email: string): Promise<boolean> {
  if (!email) return false;
  try {
    const snap = await get(ref(clientDb(), `admins/${emailToKey(email)}`));
    return snap.exists();
  } catch {
    // Auth might not be propagated yet — rules return permission denied.
    return false;
  }
}

/** Resolve a single admin's permissions (or null if not in the list). */
export async function getStoredAdminPermissions(
  email: string
): Promise<AdminPermissions | null> {
  if (!email) return null;
  try {
    const snap = await get(ref(clientDb(), `admins/${emailToKey(email)}`));
    if (!snap.exists()) return null;
    return parsePermissions(snap.val());
  } catch {
    return null;
  }
}

/** List every admin entry along with parsed permissions. */
export async function fetchStoredAdmins(): Promise<StoredAdmin[]> {
  const snap = await get(ref(clientDb(), 'admins'));
  if (!snap.exists()) return [];
  const val = snap.val() as Record<string, unknown> | null;
  if (!val) return [];
  return Object.entries(val)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([key, v]) => ({
      email: keyToEmail(key),
      permissions: parsePermissions(v)
    }))
    .sort((a, b) => a.email.localeCompare(b.email));
}

/** Legacy helper — kept for the dashboard's stat counter. */
export async function fetchStoredAdminEmails(): Promise<string[]> {
  const list = await fetchStoredAdmins();
  return list.map((a) => a.email);
}

/** Add a new admin with the supplied permission set (defaults if omitted). */
export async function addStoredAdmin(
  email: string,
  permissions: AdminPermissions = DEFAULT_PERMISSIONS
): Promise<void> {
  const clean = email.trim().toLowerCase();
  if (!clean.includes('@')) throw new Error('Введіть коректну email-адресу');
  await set(ref(clientDb(), `admins/${emailToKey(clean)}`), { ...permissions });
}

/** Replace an existing admin's permission set. */
export async function updateStoredAdminPermissions(
  email: string,
  permissions: AdminPermissions
): Promise<void> {
  await set(ref(clientDb(), `admins/${emailToKey(email)}`), { ...permissions });
}

export async function removeStoredAdmin(email: string): Promise<void> {
  await remove(ref(clientDb(), `admins/${emailToKey(email)}`));
}
