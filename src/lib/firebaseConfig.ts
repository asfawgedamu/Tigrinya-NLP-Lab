// Public Firebase web config. These values identify the project and are safe to ship;
// access is enforced by firestore.rules and App Check, not by hiding these keys.
export const firebaseConfig = {
  projectId: 'tera-web-lbcxw',
  appId: '1:748684043090:web:ab2380fe5d103d1ba6d08b',
  apiKey: 'AIzaSyA4T3ijVHto3EYQo9UlPmfFBrmr-TZpIjE',
  authDomain: 'tera-web-lbcxw.firebaseapp.com',
  storageBucket: 'tera-web-lbcxw.firebasestorage.app',
  messagingSenderId: '748684043090',
};

// The named Firestore database that already holds your data. Keep this ID so existing
// comments stay visible. (It was created from AI Studio; the name is cosmetic.)
export const FIRESTORE_DATABASE_ID = 'ai-studio-tigrinyanlplab-2e2c6ee5-6cba-4d2f-a87d-6c8d527403d0';

// reCAPTCHA v3 site key for Firebase App Check (public value). Leave empty until you have
// registered the app in Firebase Console → App Check; see README → Security setup.
export const APP_CHECK_SITE_KEY = '';
