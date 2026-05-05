'use client';

/**
 * Gates everything inside `/admin` behind Google sign-in + email whitelist.
 * If the user isn't authenticated (or isn't on the whitelist), it shows the
 * `<SignInScreen />` instead of the children.
 */
import type { ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { SignInScreen } from './SignInScreen';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading || !user || !isAdmin) {
    return <SignInScreen />;
  }
  return <>{children}</>;
}
