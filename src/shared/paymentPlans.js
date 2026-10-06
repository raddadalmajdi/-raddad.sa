/** مبالغ بالهللة (1 ر.س = 100 هللة) */
export const PAYMENT_PLANS = {
    consultation: {
        id: 'consultation',
        title: 'استشارة تقنية',
        description: 'جلسة مراجعة فكرة وتقدير أولي (مدة محددة في عرض السعر).',
        amountHalalas: 50000,
        label: '500 ر.س',
    },
    maintenance: {
        id: 'maintenance',
        title: 'اشتراك صيانة شهري',
        description: 'دفعة شهرية للصيانة والدعم وفق العقد.',
        amountHalalas: 150000,
        label: '1,500 ر.س / شهر',
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
    },
};

export function getPlan(planId) {
    return PAYMENT_PLANS[planId] || null;
}

export function formatSarFromHalalas(halalas) {
    const n = Number(halalas);
    if (!Number.isFinite(n)) return '—';
    return (n / 100).toLocaleString('ar-SA', { maximumFractionDigits: 2 }) + ' ر.س';
}
