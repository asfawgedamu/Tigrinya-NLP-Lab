import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, User,
} from 'firebase/auth';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { auth, db, describeFirebaseError } from '../lib/firebase';

interface AdminState {
  user: User | null;
  /** True only when the signed-in Google account is accepted by the Firestore admin rule. */
  isAdmin: boolean;
  checking: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AdminContext = createContext<AdminState | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) { setIsAdmin(false); setChecking(false); return; }
      setChecking(true);
      try {
        // Reports are readable only by the admin account, so a successful read proves admin rights.
        await getDocs(query(collection(db, 'feedbackSubmissions'), limit(1)));
        setIsAdmin(true);
      } catch {
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    });
  }, []);

  const signIn = useCallback(async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      const code = (e as { code?: string })?.code ?? '';
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        await signInWithRedirect(auth, provider); // phones and in-app browsers often block popups
        return;
      }
      setError(describeFirebaseError(e));
    }
  }, []);

  const logOut = useCallback(async () => { await signOut(auth); }, []);

  const value = useMemo(
    () => ({ user, isAdmin, checking, error, signIn, logOut }),
    [user, isAdmin, checking, error, signIn, logOut],
  );
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export function useAdmin(): AdminState {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}
