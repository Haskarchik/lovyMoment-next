'use client';

/**
 * Client-side write helpers for the admin area.
 *
 * Storage layout (final):
 *   /            ← products live here at numeric keys (0, 1, 2, …)
 *   /admins      ← whitelist of editor emails (sibling of the products)
 *
 * Earlier iterations briefly stored products under `/products`; the writer
 * cleans that key up automatically so we converge on the layout above.
 */
import { ref, get, set } from 'firebase/database';

import { clientDb } from './firebase-client';
import type { RawProduct } from '@/types';

/** Keys at root that aren't product entries — preserved across writes. */
const META_KEYS = new Set(['admins']);

/**
 * Read every raw product from the DB. Looks both at the root (current
 * layout) and at the legacy `/products` path, then de-duplicates by id so
 * nothing is lost during the rare moment the DB has both.
 */
export async function adminListProducts(): Promise<RawProduct[]> {
  const collected: RawProduct[] = [];

  const rootSnap = await get(ref(clientDb()));
  if (rootSnap.exists()) {
    const val = rootSnap.val();
    if (Array.isArray(val)) {
      for (const v of val as RawProduct[]) if (v) collected.push(v);
    } else if (val && typeof val === 'object') {
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        if (META_KEYS.has(k)) continue;
        if (k === 'products') continue; // legacy bucket — handled below
        if (v && typeof v === 'object') collected.push(v as RawProduct);
      }
    }
  }

  // Pick up anything stranded under /products from a previous migration.
  const productsSnap = await get(ref(clientDb(), 'products'));
  if (productsSnap.exists()) {
    const val = productsSnap.val();
    if (Array.isArray(val)) {
      for (const v of val as RawProduct[]) if (v) collected.push(v);
    } else if (val && typeof val === 'object') {
      for (const v of Object.values(val as Record<string, RawProduct>)) {
        if (v) collected.push(v);
      }
    }
  }

  const seen = new Set<string>();
  return collected.filter((p) => {
    if (!p || !p.id) return false;
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

/**
 * Persist the full product list at the root, preserving non-product meta
 * keys (`admins`). Atomic: a single `set()` rewrites the whole root, so
 * there's no transient state with duplicated entries.
 *
 * Requires the RTDB security rules to allow root-level writes for admins.
 */
async function writeProducts(rows: RawProduct[]): Promise<void> {
  // Snapshot anything we need to keep around (admin whitelist, etc.).
  const preserved: Record<string, unknown> = {};
  const rootSnap = await get(ref(clientDb()));
  if (rootSnap.exists()) {
    const root = rootSnap.val();
    if (root && typeof root === 'object' && !Array.isArray(root)) {
      for (const [k, v] of Object.entries(root as Record<string, unknown>)) {
        if (META_KEYS.has(k)) preserved[k] = v;
      }
    }
  }

  // Build the new root: products at numeric keys + preserved meta keys.
  const next: Record<string, unknown> = { ...preserved };
  for (let i = 0; i < rows.length; i++) {
    next[String(i)] = rows[i];
  }

  await set(ref(clientDb()), next);
}

export async function adminCreateProduct(product: RawProduct): Promise<void> {
  const all = await adminListProducts();
  all.push(product);
  await writeProducts(all);
}

export async function adminUpdateProduct(product: RawProduct): Promise<void> {
  const all = await adminListProducts();
  const idx = all.findIndex((p) => p.id === product.id);
  if (idx === -1) {
    all.push(product);
  } else {
    all[idx] = product;
  }
  await writeProducts(all);
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const all = await adminListProducts();
  const filtered = all.filter((p) => p.id !== id);
  await writeProducts(filtered);
}

export async function adminGetProduct(id: string): Promise<RawProduct | null> {
  const all = await adminListProducts();
  return all.find((p) => p.id === id) ?? null;
}
