import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** بيانات عامة للموقع (لا أسرار) — تُعرض للعملاء وميسر */
const business = {
    legalNameAr: 'رداد محمد مناطح الماجدي',
    tradeNameEn: 'Raddad · raddad.sa',
    activityAr: 'تطوير برامج تطبيقات الجوال',
    email: 'raddad@raddad.sa',
    phoneDisplay: '0533160799',
    phoneE164: '+966533160799',
    addressAr:
        'حي الورود، شارع الإمام أحمد بن حنبل، حفر الباطن، المملكة العربية السعودية',
    postalCode: '39821',
    freelanceCode: 'FL-629703910',
    siteUrl: 'https://raddad.sa',
};

const output = `// Generated — public business contact (safe for git)
window.siteBusiness = ${JSON.stringify(business, null, 4)};
`;

writeFileSync(resolve(process.cwd(), 'js/site-business.js'), output, 'utf8');
console.log('site-business.js generated.');
