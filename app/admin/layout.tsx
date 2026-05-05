/**
 * Admin layout — wraps every `/admin/**` route with AuthProvider + AuthGate.
 * Pages above the gate (login screen) are visible without auth; everything
 * inside renders only for whitelisted Google accounts.
 *
 * `dynamic = 'force-dynamic'` disables static optimisation: we never want
 * admin pages cached or prerendered, since they depend on live user state.
 */
import type { Metadata } from 'next';

import { AuthProvider } from '@/components/admin/AuthProvider';
import { AuthGate } from '@/components/admin/AuthGate';
import { AdminShell } from '@/components/admin/AdminShell';
import '@/styles/admin.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Lovy Moment Admin',
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>
        <AdminShell>{children}</AdminShell>
      </AuthGate>
    </AuthProvider>
  );
}
