/** مبالغ SAR بالهللة (1 ر.س = 100). مبالغ KWD بالفلس (1 د.ك = 1000). */
export const PAYMENT_PLAN_ALIASES = {
    beni_ghanem_invite: 'beni_ghanem_basic',
};

export const PAYMENT_PLANS = {
    consultation: {
        id: 'consultation',
        title: 'استشارة تقنية',
        choiceLabel: 'استشارة تقنية',
        description: 'جلسة مراجعة فكرة وتقدير أولي (مدة محددة في عرض السعر).',
        currency: 'SAR',
        amountHalalas: 50000,
        label: '500 ر.س',
        group: 'dev',
    },
    beni_ghanem_basic: {
        id: 'beni_ghanem_basic',
        title: 'مناسبة أساسية — مناسبات بني غانم',
        choiceLabel: 'مناسبة أساسية — بني غانم',
        description:
            'باقة المناسبة الأساسية داخل تطبيق مناسبات بني غانم (تفعيل الخدمة وفق مواصفات التطبيق).',
        currency: 'KWD',
        amountMinor: 30000,
        label: '30 د.ك',
        group: 'beni_ghanem',
        source: 'beni_ghanem',
    },
    beni_ghanem_vip: {
        id: 'beni_ghanem_vip',
        title: 'خدمة VIP — مناسبات بني غانم',
        choiceLabel: 'VIP — بني غانم',
        description: 'باقة VIP داخل تطبيق مناسبات بني غانم (ميزات موسّعة وفق مواصفات التطبيق).',
        currency: 'KWD',
        amountMinor: 50000,
        label: '50 د.ك',
        group: 'beni_ghanem',
        source: 'beni_ghanem',
    },
    eysalk_monthly: {
        id: 'eysalk_monthly',
        title: 'اشتراك شهري — منصة إيصالك',
        choiceLabel: 'إيصالك — اشتراك شهري',
        description:
            'اشتراك شهري لمنصة إيصالك: أرشفة واسترجاع الفواتير الورقية برقم الجوال لمتجرك أو نشاطك.',
        currency: 'SAR',
        amountHalalas: 29900,
        label: '299 ر.س / شهر',
        group: 'products',
    },
    quuq_ai_monthly: {
        id: 'quuq_ai_monthly',
        title: 'اشتراك شهري — quuq.ai للأعمال',
        choiceLabel: 'quuq.ai — اشتراك شهري',
        description:
            'اشتراك شهري لمنصة quuq.ai: بورصة تداول الطلبات بين السائقين عبر SDK داخل تطبيق شركتك (299 ر.س/شهر + رسوم منصة لكل عملية).',
        currency: 'SAR',
        amountHalalas: 29900,
        label: '299 ر.س / شهر',
        group: 'products',
    },
    maintenance: {
        id: 'maintenance',
        title: 'اشتراك صيانة شهري',
        choiceLabel: 'صيانة شهرية',
        description: 'دفعة شهرية للصيانة والدعم وفق العقد.',
        currency: 'SAR',
        amountHalalas: 150000,
        label: '1,500 ر.س / شهر',
        group: 'dev',
    },
    deposit: {
        id: 'deposit',
        title: 'مقدّم مشروع',
        choiceLabel: 'مقدّم مشروع',
        description: 'دفعة مقدّم بعد الموافقة على عرض السعر المكتوب.',
        currency: 'SAR',
        amountHalalas: null,
        label: 'حسب عرض السعر',
        customAmount: true,
        minHalalas: 500000,
        maxHalalas: 50000000,
        group: 'dev',
    },
};

/** ترتيب العرض في صفحة الدفع */
export const PAYMENT_PLAN_GROUPS = [
    {
        legend: 'مناسبات بني غانم — الدينار الكويتي 🇰🇼',
        planIds: ['beni_ghanem_basic', 'beni_ghanem_vip'],
    },
    {
        legend: 'منتجات أخرى — ر.س',
        planIds: ['eysalk_monthly', 'quuq_ai_monthly'],
    },
    {
        legend: 'خدمات',
        planIds: ['consultation', 'maintenance', 'deposit'],
    },
];

export function getPlan(planId) {
    const resolved = PAYMENT_PLAN_ALIASES[planId] || planId;
    return PAYMENT_PLANS[resolved] || null;
}

export function getPlanCurrency(plan) {
    return plan?.currency === 'KWD' ? 'KWD' : 'SAR';
}

export function resolvePlanChargeMinor(plan, customInput) {
    if (!plan) return null;
    if (plan.currency === 'KWD') {
        return plan.amountMinor;
    }
    if (plan.customAmount) {
        const sar = Number(String(customInput || '').replace(/,/g, '').trim());
        if (!Number.isFinite(sar) || sar <= 0) {
            throw new Error('أدخل مبلغ المقدّم بالريال.');
        }
        const halalas = Math.round(sar * 100);
        if (halalas < plan.minHalalas || halalas > plan.maxHalalas) {
            throw new Error(
                `المبلغ يجب أن يكون بين ${formatSarFromHalalas(plan.minHalalas)} و ${formatSarFromHalalas(plan.maxHalalas)}.`
            );
        }
        return halalas;
    }
    return plan.amountHalalas;
}

export function formatSarFromHalalas(halalas) {
    const n = Number(halalas);
    if (!Number.isFinite(n)) return '—';
    return (n / 100).toLocaleString('ar-SA', { maximumFractionDigits: 2 }) + ' ر.س';
}

export function formatKwdFromFils(fils) {
    const n = Number(fils);
    if (!Number.isFinite(n)) return '—';
    return (n / 1000).toLocaleString('ar-KW', { maximumFractionDigits: 3 }) + ' د.ك';
}

export function formatChargeAmount(minor, currency = 'SAR') {
    return currency === 'KWD' ? formatKwdFromFils(minor) : formatSarFromHalalas(minor);
}

export function formatPaymentRecordAmount(payment) {
    const currency = payment?.chargeCurrency === 'KWD' ? 'KWD' : 'SAR';
    return formatChargeAmount(payment?.amountHalalas, currency);
}

export function moyasarNetworksForCurrency(currency) {
    return currency === 'KWD' ? ['visa', 'mastercard'] : ['mada', 'visa', 'mastercard'];
}

export function moyasarApplePayCountry(currency) {
    return currency === 'KWD' ? 'KW' : 'SA';
}
