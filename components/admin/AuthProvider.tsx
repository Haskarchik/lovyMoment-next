'use client';

/**
 * React context for admin authentication + per-user permissions.
 *
 * On every Firebase auth state change the provider:
 *   1. Stores the current user.
 *   2. Allows root admins immediately (env list) with FULL_PERMISSIONS.
 *   3. Otherwise reads `/admins/<emailEscaped>` from RTDB and unpacks the
 *      stored permission object.
 *
 * Components consume the result via `useAuth()` and the convenience
 * helper `can(capability)`.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User
} from 'firebase/auth';

import { clientAuth, googleProvider } from '@/lib/firebase-client';
import {
  isRootAdmin,
  FULL_PERMISSIONS,
  NO_PERMISSIONS,
  type AdminPermissions,
  type Capability
} from '@/lib/admin-config';
import { getStoredAdminPermissions } from '@/lib/admin-users';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /** True if the user is on the whitelist (root or stored), regardless of
   *  individual permission flags. Lets read-only admins enter the panel. */
  isAdmin: boolean;
  isRoot: boolean;
  /** True if the user is on the whitelist but every permission flag is false. */
  isReadOnly: boolean;
  permissions: AdminPermissions;
  /** Convenience helper: `can('canDelete') ? <DeleteBtn /> : null`. */
  can: (capability: Capability) => boolean;
  signIn: () => Promise<User>;
  signOutUser: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isRoot, setIsRoot] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [permissions, setPermissions] = useState<AdminPermissions>(NO_PERMISSIONS);
  const [loading, setLoading] = useState(true);

  async function evaluate(u: User | null) {
    if (!u || !u.email) {
      setIsRoot(false);
      setIsWhitelisted(false);
      setPermissions(NO_PERMISSIONS);
      return;
    }
    if (isRootAdmin(u.email)) {
      setIsRoot(true);
      setIsWhitelisted(true);
      setPermissions({ ...FULL_PERMISSIONS });
      return;
    }
    setIsRoot(false);
    const stored = await getStoredAdminPermissions(u.email);
    if (stored) {
      // Entry exists in /admins — user is allowed in (even if all flags off).
      setIsWhitelisted(true);
      setPermissions(stored);
    } else {
      setIsWhitelisted(false);
      setPermissions(NO_PERMISSIONS);
    }
  }

  useEffect(() => {
    const auth = clientAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(true);
      await evaluate(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = useCallback(async (): Promise<User> => {
    const result = await signInWithPopup(clientAuth(), googleProvider);
    return result.user;
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(clientAuth());
  }, []);

  const refreshAdminStatus = useCallback(async () => {
    await evaluate(clientAuth().currentUser);
  }, []);

  // Whitelisted = on the list (root or stored). Even an admin with every
  // permission set to false still gets in — they just see everything in
  // read-only mode. Granular controls hide individual write UI separately.
  const isAdmin = isRoot || isWhitelisted;
  const isReadOnly = isWhitelisted && !isRoot && !Object.values(permissions).some(Boolean);

  const can = useCallback(
    (capability: Capability) => isRoot || !!permissions[capability],
    [isRoot, permissions]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin,
      isRoot,
      isReadOnly,
      permissions,
      can,
      signIn,
      signOutUser,
      refreshAdminStatus
    }),
    [
      user,
      loading,
      isAdmin,
      isRoot,
      isReadOnly,
      permissions,
      can,
      signIn,
      signOutUser,
      refreshAdminStatus
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
