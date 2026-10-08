import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const apiKey = process.env.VITE_FIREBASE_API_KEY;
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const strict = process.env.CI === 'true' || process.env.REQUIRE_FIREBASE_CONFIG === 'true';

if (!apiKey || !projectId || apiKey === 'YOUR_API_KEY') {
    const message = 'Firebase .env is missing. Copy .env.example to .env and add your Firebase Web App keys.';
    if (strict) {
        console.error(message);
        process.exit(1);
    }
    console.warn(`[warn] ${message}`);
    process.exit(0);
}

const runtimePath = resolve(process.cwd(), 'js/firebase-config.js');
const runtime = readFileSync(runtimePath, 'utf8');
if (!runtime.includes(apiKey)) {
    console.warn('[warn] js/firebase-config.js may be stale. Run npm run build again.');
}

console.log(`Firebase config verified for project: ${projectId}`);

const moyasarKey = (process.env.VITE_MOYASAR_PUBLISHABLE_KEY || '').trim();
if (!moyasarKey.startsWith('pk_')) {
    console.warn(
        '[warn] VITE_MOYASAR_PUBLISHABLE_KEY not set — pay page shows activation notice until you add pk_test_ or pk_live_. See docs/MOYASAR-ACTIVATION.md'
    );
} else if (moyasarKey.startsWith('pk_test_')) {
    console.log('Moyasar: test publishable key configured.');
} else {
    console.log('Moyasar: live publishable key configured.');
}
