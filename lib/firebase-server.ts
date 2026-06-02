import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const APP_NAME = 'server-app';

function getServerApp() {
  try { return getApp(APP_NAME); } catch { return initializeApp(firebaseConfig, APP_NAME); }
}

let _db: ReturnType<typeof getFirestore> | null = null;

export function getServerDb() {
  if (_db) return _db;
  const app = getServerApp();
  try {
    _db = initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch {
    _db = getFirestore(app);
  }
  return _db;
}
