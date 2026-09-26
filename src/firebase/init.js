import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export function getFirebaseConfig() {
    const config = window.firebaseConfig;
    if (!config || !config.apiKey || config.apiKey === 'YOUR_API_KEY') {
        return null;
    }
    return config;
}

export function initFirebase() {
    const config = getFirebaseConfig();
    if (!config) {
        return null;
    }

    const app = getApps().length ? getApps()[0] : initializeApp(config);
    return {
        app,
        auth: getAuth(app),
        db: getFirestore(app),
    };
}

export function isAdminEmail(email) {
    const defaults = ['raddad@raddad.sa'];
    const list = window.firebaseConfig?.adminEmails || defaults;
    return list.map((item) => item.toLowerCase()).includes(String(email || '').toLowerCase());
}
