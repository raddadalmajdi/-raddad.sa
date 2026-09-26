function parseAdminEmails(raw) {
    if (!raw) return ['raddad@raddad.sa'];
    return raw
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
}

function fromViteEnv() {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

    if (!apiKey || !projectId || apiKey === 'YOUR_API_KEY') {
        return null;
    }

    return {
        apiKey,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        adminEmails: parseAdminEmails(import.meta.env.VITE_FIREBASE_ADMIN_EMAILS),
    };
}

function fromWindowConfig() {
    const config = window.firebaseConfig;
    if (!config?.apiKey || config.apiKey === 'YOUR_API_KEY' || !config.projectId) {
        return null;
    }

    return {
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
        adminEmails: Array.isArray(config.adminEmails)
            ? config.adminEmails.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
            : parseAdminEmails(config.adminEmails),
    };
}

export function readFirebaseConfig() {
    return fromViteEnv() || fromWindowConfig();
}

export function isFirebaseConfigured() {
    return Boolean(readFirebaseConfig());
}
