import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, FIRESTORE_DATABASE_ID } from './firebaseConfig';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, FIRESTORE_DATABASE_ID);

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
    return 'The database refused this request (permission denied). Make sure the latest firestore.rules are published.';
  }
  if (code.includes('unavailable') || code.includes('network')) {
    return 'Cannot reach the database. Check your internet connection and try again.';
  }
  if (code.includes('not-found')) {
    return 'The item no longer exists.';
  }
  if (code.includes('popup-closed')) {
    return 'Sign-in was cancelled.';
  }
  if (code.includes('unauthorized-domain')) {
    return 'This site address is not in Firebase Authentication → Settings → Authorized domains.';
  }
  if (code.includes('operation-not-allowed')) {
    return 'Google sign-in is not enabled in Firebase Authentication → Sign-in method.';
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
