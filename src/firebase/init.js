import { initializeApp, getApps } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, initializeFirestore } from 'firebase/firestore';
import { isFirebaseConfigured, readFirebaseConfig } from './config.js';

let cached = null;

export function getFirebaseConfig() {
    return readFirebaseConfig();
}

export function initFirebase() {
    if (cached) {
        return cached;
    }

    const config = readFirebaseConfig();
    if (!config) {
        return null;
    }

    const existingApp = getApps()[0];
    const app = existingApp || initializeApp(config);
    const db = existingApp
        ? getFirestore(app)
        : initializeFirestore(app, {
              experimentalAutoDetectLongPolling: true,
              experimentalForceLongPolling: true,
          });

    const auth = getAuth(app);

    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true') {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
    }

    if (typeof window !== 'undefined') {
        window.firebaseConfig = {
            ...config,
            adminEmails: config.adminEmails,
        };
    }

    cached = { app, auth, db, config };
    return cached;
}

export function isAdminEmail(email) {
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized) return false;

    const fromWindow = window.firebaseConfig?.adminEmails;
    const list = Array.isArray(fromWindow) && fromWindow.length
        ? fromWindow.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
        : (readFirebaseConfig()?.adminEmails || ['raddad@raddad.sa']);

    return list.includes(normalized);
}

export { isFirebaseConfigured };
