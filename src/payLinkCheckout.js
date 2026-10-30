import { initFirebase } from './firebase/init.js';
import { fetchPaymentLinkPublic } from './shared/paymentLinks.js';
import { formatSarFromHalalas } from './shared/paymentPlans.js';

const MOYASAR_JS = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';

function showError(message) {
    const el = document.getElementById('checkout-error');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
}

function cardFormMounted() {
    return Boolean(
        document.getElementById('mysr-cc-number') ||
            document.querySelector('.mysr-form .mysr-form-cardInfo') ||
            document.querySelector('.mysr-form .mysr-form-inputGroup')
    );
}

function mountMoyasar(init) {
    const wrap = document.querySelector('.moyasar-wrap');
    if (!wrap) {
        showError('حاوية الدفع غير موجودة.');
        return;
    }
    wrap.innerHTML = '<div class="mysr-form"></div>';
    window.Moyasar.init(init);
}

function loadMoyasarScript() {
    return new Promise((resolve, reject) => {
        if (window.Moyasar) {
            resolve();
            return;
        }
        if (document.querySelector(`script[src="${MOYASAR_JS}"]`)) {
            const wait = setInterval(() => {
                if (window.Moyasar) {
                    clearInterval(wait);
                    resolve();
                }
            }, 100);
            setTimeout(() => {
                clearInterval(wait);
                reject(new Error('timeout'));
            }, 15000);
            return;
        }
        const s = document.createElement('script');
        s.src = MOYASAR_JS;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('moyasar'));
        document.body.appendChild(s);
    });
}

async function boot() {
    const cfg = window.paymentConfig || {};
    if (!cfg.paymentsEnabled || !cfg.moyasarPublishableKey) {
        showError('بوابة الدفع غير مفعّلة.');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const linkId = params.get('link');
    if (!linkId) {
        showError('رابط الدفع غير صالح.');
        return;
    }

    const firebase = initFirebase();
    if (!firebase) {
        showError('تعذر الاتصال.');
        return;
    }

    let link;
    try {
        link = await fetchPaymentLinkPublic(firebase.db, linkId);
    } catch (err) {
        console.error(err);
        showError('تعذر تحميل طلب الدفع.');
        return;
    }

    if (!link) {
        showError('الرابط غير متاح (مدفوع أو ملغى).');
        return;
    }

    const channel = params.get('channel') === 'applepay' ? 'applepay' : 'card';
    const summary = document.getElementById('checkout-summary');
    if (summary) {
        summary.textContent = `${link.serviceTitle} — ${formatSarFromHalalas(link.amountHalalas)}`;
    }

    if (cfg.moyasarTestMode) {
        const testBanner = document.getElementById('pay-test-banner');
        if (testBanner) testBanner.hidden = false;
    }

    const planId = 'payment_link';
    sessionStorage.setItem('raddad_pay_plan', planId);
    sessionStorage.setItem('raddad_pay_amount', String(link.amountHalalas));
    sessionStorage.setItem('raddad_pay_link_id', link.id);
    sessionStorage.setItem('raddad_pay_link_title', link.serviceTitle);

    const callback =
        `${cfg.siteUrl}${cfg.callbackPath || '/pay-success.html'}?plan=${encodeURIComponent(planId)}&link=${encodeURIComponent(link.id)}`;

    try {
        await loadMoyasarScript();
    } catch {
        showError('تعذر تحميل مكتبة ميسر.');
        return;
    }

    const init = {
        element: '.mysr-form',
        amount: link.amountHalalas,
        currency: 'SAR',
        language: 'ar',
        description: link.serviceTitle.slice(0, 120),
        publishable_api_key: String(cfg.moyasarPublishableKey).trim(),
        callback_url: callback,
        fixed_width: false,
        methods: channel === 'applepay' ? ['applepay'] : ['creditcard'],
        supported_networks: ['visa', 'mastercard', 'mada'],
        metadata: {
            plan_id: planId,
            payment_link_id: link.id,
            site: 'raddad.sa',
        },
    };

    if (channel === 'applepay') {
        init.apple_pay = {
            country: 'SA',
            label: 'Raddad',
            validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
        };
        delete init.supported_networks;
    }

    try {
        mountMoyasar(init);
    } catch (err) {
        showError(err?.message || 'تعذر تفعيل الدفع.');
        return;
    }

    if (channel === 'card') {
        window.setTimeout(() => {
            if (cardFormMounted()) return;
            const fallback = document.getElementById('checkout-fallback');
            if (fallback) fallback.hidden = false;
        }, 8000);
    }
}

window.addEventListener('load', () => void boot(), { once: true });
