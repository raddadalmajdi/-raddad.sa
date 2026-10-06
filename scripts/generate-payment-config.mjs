import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import { existsSync } from 'node:fs';

const root = process.cwd();
const envPath = resolve(root, '.env');
if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const publishableKey = (process.env.VITE_MOYASAR_PUBLISHABLE_KEY || '').trim();
const siteUrl = (process.env.VITE_SITE_URL || 'https://raddad.sa').replace(/\/$/, '');

const paymentConfig = {
    siteUrl,
    moyasarPublishableKey: publishableKey,
    paymentsEnabled: publishableKey.startsWith('pk_'),
    callbackPath: '/pay-success.html',
};

const output = `// Generated — add VITE_MOYASAR_PUBLISHABLE_KEY to .env then npm run build
window.paymentConfig = ${JSON.stringify(paymentConfig, null, 4)};
`;

writeFileSync(resolve(root, 'js/payment-config.js'), output, 'utf8');
console.log(
    paymentConfig.paymentsEnabled
        ? 'Moyasar publishable key configured (payments enabled in UI).'
        : 'Payment config: Moyasar key not set (pay page shows activation notice).'
);
