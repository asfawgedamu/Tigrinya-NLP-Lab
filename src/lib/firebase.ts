import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth, signInAnonymously, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { APP_CHECK_SITE_KEY, firebaseConfig, FIRESTORE_DATABASE_ID } from './firebaseConfig';

const app = initializeApp(firebaseConfig);

// App Check proves requests come from this website and not from a script. Enforce it in the console too.
if (APP_CHECK_SITE_KEY) {
  if (import.meta.env.DEV) {
    (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(APP_CHECK_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app, FIRESTORE_DATABASE_ID);

/**
 * Every visitor gets an anonymous Firebase identity the first time they post. It lets the rules
 * rate-limit each browser, allow one vote per browser, and let people delete their own posts.
 */
export async function ensureVisitor(): Promise<User> {
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}

/**
 * Firestore queues writes while offline and never rejects them, so a plain `await` can hang forever.
 * This turns that silence into an error the UI can show.
 */
export function confirmed<T>(write: Promise<T>, ms = 15000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('The server did not confirm in time. Check your connection and try again.')),
      ms,
    );
    write.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

/** Turn a Firebase error into one short sentence a visitor (or you) can act on. */
export function describeFirebaseError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  if (code.includes('permission-denied')) {
    return 'The database refused this. You may be posting too fast (wait 15 seconds), posting is paused, or the latest firestore.rules are not published yet.';
  }
  if (code.includes('unavailable') || code.includes('network')) return 'Cannot reach the database. Check your internet connection and try again.';
  if (code.includes('not-found')) return 'The item no longer exists.';
  if (code.includes('popup-closed')) return 'Sign-in was cancelled.';
  if (code.includes('unauthorized-domain')) return 'This site address is not in Firebase Authentication → Settings → Authorized domains.';
  if (code.includes('operation-not-allowed') || code.includes('admin-restricted-operation')) {
    return 'A sign-in method is not enabled in Firebase Authentication (Google for the owner, Anonymous for visitors).';
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

/** Remove control, zero-width and bidirectional-override characters that can disguise text, then trim. */
export function cleanText(input: string): string {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁠-⁯﻿]/g, '')
    .replace(/[ \t]{3,}/g, '  ')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}
