import { PAYMENT_PLANS } from './paymentPlans.js';

const DEFAULT_BUSINESS = {
    legalNameAr: 'رداد محمد مناطح الماجدي',
    tradeNameEn: 'Raddad · raddad.sa',
    activityAr: 'تطوير برامج تطبيقات الجوال',
    email: 'raddad@raddad.sa',
    phoneDisplay: '0533160799',
    freelanceCode: 'FL-629703910',
    siteUrl: 'https://raddad.sa',
};

function business() {
    return window.siteBusiness || DEFAULT_BUSINESS;
}

const INTENTS = [
    {
        id: 'greeting',
        patterns: [/السلام|مرحب|اهلا|أهلا|هلا|صباح|مساء/i],
        reply: () => ({
            text: `أهلاً بك في ${business().tradeNameEn}. أنا مساعد المنصة — أساعدك في الخدمات، الأسعار، الدفع، ومنتجاتنا (مناسبات بني غانم وإيصالك). ما الذي تبحث عنه؟`,
            links: [
                { href: '/pricing.html', label: 'الأسعار' },
                { href: '/pay.html', label: 'الدفع' },
                { href: '/request.html', label: 'طلب فكرة' },
            ],
        }),
    },
    {
        id: 'beni',
        patterns: [/بني غانم|مناسبات|دعوة|زواج|عرس|invitation/i],
        reply: () => {
            const plan = PAYMENT_PLANS.beni_ghanem_invite;
            return {
                text: `خدمة **${plan.title}**: ${plan.description} السعر الإرشادي ${plan.label}. يمكنك الدفع مباشرة أو التواصل لتأكيد التفاصيل قبل التنفيذ.`,
                links: [
                    { href: '/pay.html?plan=beni_ghanem_invite', label: 'ادفع الآن' },
                    { href: '/work.html', label: 'عن التطبيق' },
                ],
            };
        },
    },
    {
        id: 'eysalk',
        patterns: [/إيصالك|ايصالك|eysalk|فواتير|فاتورة/i],
        reply: () => {
            const plan = PAYMENT_PLANS.eysalk_monthly;
            return {
                text: `**${plan.title}**: ${plan.description} الاشتراك الإرشادي ${plan.label}.`,
                links: [
                    { href: '/pay.html?plan=eysalk_monthly', label: 'دفع الاشتراك' },
                    { href: 'https://www.eysalk.com', label: 'eysalk.com', external: true },
                ],
            };
        },
    },
    {
        id: 'pricing',
        patterns: [/سعر|أسعار|كم يكلف|تكلفة|باقة|عرض سعر/i],
        reply: () => ({
            text:
                'الأسعار على الموقع إرشادية: استشارة من 500 ر.س، صيانة من 1,500 ر.س/شهر، ومقدّم مشروع حسب العقد. المشاريع الكبيرة تبدأ غالباً من 15,000 ر.س. السعر النهائي يُثبت في عرض سعر مكتوب قبل الدفع.',
            links: [
                { href: '/pricing.html', label: 'صفحة الأسعار' },
                { href: '/request.html', label: 'طلب عرض سعر' },
            ],
        }),
    },
    {
        id: 'pay',
        patterns: [/دفع|ميسر|مدى|فيزا|بطاقة|pay|payment/i],
        reply: () => ({
            text:
                'الدفع عبر صفحة **الدفع الآمن** على المنصة (بوابة ميسر عند التفعيل). اختر نوع الخدمة: استشارة، اشتراك، مقدّم مشروع، أو منتجاتنا.',
            links: [{ href: '/pay.html', label: 'الدفع الآمن' }],
        }),
    },
    {
        id: 'services',
        patterns: [/خدم|تطوير|تطبيق|جوال|منصة|firebase|استشارة/i],
        reply: () => ({
            text: `نشاطنا: ${business().activityAr}. نقدّم تطوير تطبيقات، منصات ويب، UI/UX، Firebase، ونشر المتاجر.`,
            links: [
                { href: '/services.html', label: 'الخدمات' },
                { href: '/process.html', label: 'آلية العمل' },
            ],
        }),
    },
    {
        id: 'freelance',
        patterns: [/عمل حر|وثيقة|FL-|توثيق/i],
        reply: () => ({
            text: `مقدّم الخدمة: ${business().legalNameAr}. وثيقة عمل حر سارية — رمز التوثيق ${business().freelanceCode}.`,
            links: [{ href: '/about.html', label: 'عن المنصة' }],
        }),
    },
    {
        id: 'contact',
        patterns: [/تواصل|جوال|هاتف|ايميل|إيميل|بريد|واتس|رقم/i],
        reply: () => ({
            text: `للتواصل: ${business().phoneDisplay} · ${business().email}`,
            links: [
                { href: '/contact.html', label: 'صفحة التواصل' },
                { href: `mailto:${business().email}`, label: 'إرسال بريد' },
            ],
        }),
    },
    {
        id: 'account',
        patterns: [/تسجيل|دخول|حساب|عميل|تذكرة|متابعة/i],
        reply: () => ({
            text: 'بعد إنشاء حساب يمكنك متابعة المشروع والتذاكر من بوابة العميل.',
            links: [
                { href: '/login.html', label: 'تسجيل الدخول' },
                { href: '/client.html', label: 'بوابة العميل' },
            ],
        }),
    },
    {
        id: 'legal',
        patterns: [/شروط|خصوصية|استرجاع|إلغاء|سياسة/i],
        reply: () => ({
            text: 'سياسات المنصة منشورة للشفافية والامتثال (بما فيها التجارة الإلكترونية).',
            links: [
                { href: '/terms.html', label: 'الشروط' },
                { href: '/privacy.html', label: 'الخصوصية' },
                { href: '/refund.html', label: 'الاسترجاع' },
            ],
        }),
    },
];

function scoreIntent(text, intent) {
    return intent.patterns.some((re) => re.test(text)) ? 1 : 0;
}

export function replyToMessage(rawText) {
    const text = String(rawText || '').trim();
    if (!text) {
        return {
            text: 'اكتب سؤالك بجملة قصيرة، مثل: «كم سعر الاستشارة؟» أو «دفع دعوة زواج بني غانم».',
            links: [],
        };
    }

    let best = null;
    let bestScore = 0;
    for (const intent of INTENTS) {
        const s = scoreIntent(text, intent);
        if (s > bestScore) {
            bestScore = s;
            best = intent;
        }
    }

    if (best) return best.reply(text);

    return {
        text:
            'لم أتأكد من سؤالك. جرّب السؤال بطريقة أخرى، أو تواصل مباشرة — أستطيع مساعدتك في الأسعار، الدفع، مناسبات بني غانم، إيصالك، أو طلب مشروع جديد.',
        links: [
            { href: '/contact.html', label: 'تواصل' },
            { href: '/request.html', label: 'طلب فكرة' },
        ],
    };
}

export function welcomeMessage() {
    return replyToMessage('مرحبا');
}
