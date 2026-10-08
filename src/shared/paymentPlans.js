/** مبالغ بالهللة (1 ر.س = 100 هللة) */
export const PAYMENT_PLANS = {
    consultation: {
        id: 'consultation',
        title: 'استشارة تقنية',
        description: 'جلسة مراجعة فكرة وتقدير أولي (مدة محددة في عرض السعر).',
        amountHalalas: 50000,
        label: '500 ر.س',
        group: 'dev',
    },
    beni_ghanem_invite: {
        id: 'beni_ghanem_invite',
        title: 'دعوة زواج — تطبيق مناسبات بني غانم',
        description:
            'خدمة إضافة وتنسيق صورة دعوة الزواج داخل تطبيق مناسبات بني غانم (تصميم/رفع وفق المواصفات المتفق عليها).',
        amountHalalas: 19900,
        label: '199 ر.س',
        group: 'products',
    },
    eysalk_monthly: {
        id: 'eysalk_monthly',
        title: 'اشتراك شهري — منصة إيصالك',
        description:
            'اشتراك شهري لمنصة إيصالك: أرشفة واسترجاع الفواتير الورقية برقم الجوال لمتجرك أو نشاطك.',
        amountHalalas: 29900,
        label: '299 ر.س / شهر',
        group: 'products',
    },
    maintenance: {
        id: 'maintenance',
        title: 'اشتراك صيانة شهري',
        description: 'دفعة شهرية للصيانة والدعم وفق العقد.',
        amountHalalas: 150000,
        label: '1,500 ر.س / شهر',
        group: 'dev',
    },
    deposit: {
        id: 'deposit',
        title: 'مقدّم مشروع',
        description: 'دفعة مقدّم بعد الموافقة على عرض السعر المكتوب.',
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
        legend: 'منتجاتنا — خدمات داخل التطبيق والمنصة',
        planIds: ['beni_ghanem_invite', 'eysalk_monthly'],
    },
    {
        legend: 'تطوير واستشارات',
        planIds: ['consultation', 'maintenance', 'deposit'],
    },
];

export function getPlan(planId) {
    return PAYMENT_PLANS[planId] || null;
}

export function formatSarFromHalalas(halalas) {
    const n = Number(halalas);
    if (!Number.isFinite(n)) return '—';
    return (n / 100).toLocaleString('ar-SA', { maximumFractionDigits: 2 }) + ' ر.س';
}
