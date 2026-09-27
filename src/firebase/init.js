import { initializeApp, getApps } from 'firebase/app';
import {
    browserLocalPersistence,
    browserSessionPersistence,
    connectAuthEmulator,
    getAuth,
    inMemoryPersistence,
    setPersistence,
} from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, initializeFirestore } from 'firebase/firestore';
import { isFirebaseConfigured, readFirebaseConfig } from './config.js';

let cached = null;

/** Safari وكل متصفحات iOS تستخدم WebKit — غالباً تحتاج long polling لـ Firestore */
export function needsFirestoreLongPolling() {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) return true;
    return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|EdgiOS|OPR|FxiOS/i.test(ua);
}

export async function prepareAuthPersistence(auth) {
    const chain = [browserLocalPersistence, browserSessionPersistence, inMemoryPersistence];
    for (const persistence of chain) {
        try {
            await setPersistence(auth, persistence);
            return persistence;
        } catch {
            // Safari خاصةً في التصفح الخاص أو عند تعطيل التخزين
        }
    }
    return null;
}

function createFirestore(app) {
    const options = needsFirestoreLongPolling()
        ? {
              experimentalAutoDetectLongPolling: true,
              experimentalForceLongPolling: true,
          }
        : {
              experimentalAutoDetectLongPolling: true,
          };
    return initializeFirestore(app, options);
}

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
    const db = existingApp ? getFirestore(app) : createFirestore(app);

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
