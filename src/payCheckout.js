import { formatSarFromHalalas, getPlan } from './shared/paymentPlans.js';

const MOYASAR_JS = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
const MOYASAR_CSS = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.css';

function showError(message) {
    const box = document.getElementById('checkout-error');
    if (box) {
        box.textContent = message;
        box.hidden = false;
    }
}

function loadStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('تعذر تحميل بوابة الدفع.'));
        document.body.appendChild(script);
    });
}

function resolveAmountHalalas(plan, amountParam) {
    if (!plan.customAmount) {
        return plan.amountHalalas;
    }
    const sar = Number(String(amountParam || '').replace(/,/g, '').trim());
    if (!Number.isFinite(sar) || sar <= 0) {
        throw new Error('مبلغ المقدّم غير صالح.');
    }
    const halalas = Math.round(sar * 100);
    if (halalas < plan.minHalalas || halalas > plan.maxHalalas) {
        throw new Error(
            `المبلغ يجب أن يكون بين ${formatSarFromHalalas(plan.minHalalas)} و ${formatSarFromHalalas(plan.maxHalalas)}.`
        );
    }
    return halalas;
}

async function boot() {
    const config = window.paymentConfig || {};
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('plan');
    const channel = params.get('channel') === 'applepay' ? 'applepay' : 'card';
    const plan = planId ? getPlan(planId) : null;
    const summary = document.getElementById('checkout-summary');
    const fallback = document.getElementById('checkout-fallback');

    if (!config.paymentsEnabled) {
        showError('بوابة الدفع غير مفعّلة بعد. تواصل معنا على raddad@raddad.sa');
        return;
    }
    if (!plan) {
        showError('نوع الدفعة غير معروف. ارجع واختر الخدمة من جديد.');
        return;
    }

    let amountHalalas;
    try {
        amountHalalas = resolveAmountHalalas(plan, params.get('amount'));
    } catch (error) {
        showError(error.message || 'تعذر حساب المبلغ.');
        return;
    }

    if (summary) {
        summary.textContent = `${plan.title} — ${formatSarFromHalalas(amountHalalas)}`;
    }

    loadStylesheet(MOYASAR_CSS);
    try {
        await loadScript(MOYASAR_JS);
    } catch (error) {
        showError(error.message);
        return;
    }

    if (!window.Moyasar) {
        showError('بوابة الدفع غير جاهزة. حدّث الصفحة أو جرّب لاحقاً.');
        return;
    }

    const callbackUrl = `${config.siteUrl}${config.callbackPath}?plan=${encodeURIComponent(plan.id)}`;
    sessionStorage.setItem('raddad_pay_plan', plan.id);
    sessionStorage.setItem('raddad_pay_amount', String(amountHalalas));

    const init = {
        element: '.mysr-form',
        amount: amountHalalas,
        currency: 'SAR',
        language: 'ar',
        description: `raddad.sa — ${plan.title}`,
        publishable_api_key: config.moyasarPublishableKey,
        callback_url: callbackUrl,
        fixed_width: false,
        metadata: {
            plan_id: plan.id,
            site: 'raddad.sa',
        },
        on_failure: (error) => {
            showError(typeof error === 'string' ? error : 'تعذر إتمام الدفع.');
        },
    };

    if (channel === 'applepay') {
        init.methods = ['applepay'];
        init.apple_pay = {
            country: 'SA',
            label: 'Raddad · raddad.sa',
            validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
        };
    } else {
        init.methods = ['creditcard'];
        init.supported_networks = ['mada', 'visa', 'mastercard'];
    }

    window.Moyasar.init(init);

    if (channel === 'card' && fallback) {
        window.setTimeout(() => {
            const hasField = document.querySelector(
                '.mysr-form input, .mysr-form .mysr-form-cardInfo, .mysr-form .mysr-form-inputGroup'
            );
            if (!hasField) {
                fallback.hidden = false;
            }
        }, 5000);
    }
}

if (document.readyState === 'complete') {
    boot();
} else {
    window.addEventListener('load', () => boot(), { once: true });
}
