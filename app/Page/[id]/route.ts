/**
 * Legacy CRA URL: `/Page/<id>` → new ChPU URL: `/<category>/<slug>`.
 *
 * The old React app used numeric Firebase ids in the URL. Google has those
 * URLs indexed, so we look the product up by id and 301-redirect to the new
 * SEO-friendly path. If the product no longer exists we fall back to the
 * homepage rather than 404 — keeps the link equity flowing.
 *
 * Returns 301 (permanent) so search engines update their index.
 */
import { NextResponse, type NextRequest } from 'next/server';

import { getProductById } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const url = request.nextUrl.clone();

  try {
    const product = await getProductById(id);
    if (product?.slug && product?.category) {
      url.pathname = `/${product.category}/${product.slug}`;
      return NextResponse.redirect(url, 301);
    }
  } catch {
    // Fall through to homepage redirect.
  }

  // Unknown id — redirect to homepage instead of returning 404, so any old
  // backlinks still land on a useful page.
  url.pathname = '/';
  return NextResponse.redirect(url, 301);
}
