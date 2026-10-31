/**
 * تهيئة ميسر — سكربت كلاسيكي (بدون ES modules) وفق توثيق mيسr.
 * https://docs.moyasar.com/guides/card-payments/basic-integration
 */
(function () {
    var PLANS = {
        beni_ghanem_basic: { title: 'مناسبة أساسية — بني غانم', currency: 'KWD', minor: 30000 },
        beni_ghanem_vip: { title: 'VIP — بني غانم', currency: 'KWD', minor: 50000 },
        beni_ghanem_invite: { title: 'مناسبة أساسية — بني غانم', currency: 'KWD', minor: 30000 },
        eysalk_monthly: { title: 'اشتراك إيصالك', currency: 'SAR', minor: 29900 },
        quuq_ai_monthly: { title: 'اشتراك quuq.ai للأعمال', currency: 'SAR', minor: 29900 },
        consultation: { title: 'استشارة تقنية', currency: 'SAR', minor: 50000 },
        maintenance: { title: 'اشتراك صيانة', currency: 'SAR', minor: 150000 },
        deposit: {
            title: 'مقدّم مشروع',
            currency: 'SAR',
            custom: true,
            minMinor: 500000,
            maxMinor: 50000000,
        },
    };

    function showError(message) {
        var el = document.getElementById('checkout-error');
        if (!el) return;
        el.textContent = message;
        el.hidden = false;
    }

    function formatAmount(minor, currency) {
        if (currency === 'KWD') {
            return (minor / 1000).toLocaleString('ar-KW', { maximumFractionDigits: 3 }) + ' د.ك';
        }
        return (minor / 100).toLocaleString('ar-SA', { maximumFractionDigits: 2 }) + ' ر.س';
    }

    function resolveCharge(planId, amountParam) {
        var plan = PLANS[planId];
        if (!plan) return null;
        if (!plan.custom) {
            return { amount: plan.minor, currency: plan.currency || 'SAR' };
        }
        var sar = Number(String(amountParam || '').replace(/,/g, '').trim());
        if (!Number.isFinite(sar) || sar <= 0) return null;
        var minor = Math.round(sar * 100);
        if (minor < plan.minMinor || minor > plan.maxMinor) return null;
        return { amount: minor, currency: 'SAR' };
    }

    function sanitizeSource(raw) {
        var s = String(raw || '').trim().toLowerCase();
        if (!/^[a-z][a-z0-9_]{0,31}$/.test(s)) return '';
        return s;
    }

    function buildInit(cfg, planId, charge, channel, source) {
        var callback =
            cfg.siteUrl + (cfg.callbackPath || '/pay-success.html') + '?plan=' + encodeURIComponent(planId);
        var currency = charge.currency;
        var init = {
            element: '.mysr-form',
            amount: charge.amount,
            currency: currency,
            language: 'ar',
            description: 'raddad.sa order',
            publishable_api_key: String(cfg.moyasarPublishableKey || '').trim(),
            callback_url: callback,
            fixed_width: false,
            metadata: {
                plan_id: planId,
                site: 'raddad.sa',
                source: source || 'raddad_sa',
                charge_currency: currency,
            },
        };

        if (channel === 'applepay') {
            init.methods = ['applepay'];
            init.apple_pay = {
                country: currency === 'KWD' ? 'KW' : 'SA',
                label: 'Raddad',
                validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
            };
        } else {
            init.methods = ['creditcard'];
            init.supported_networks =
                currency === 'KWD' ? ['visa', 'mastercard'] : ['visa', 'mastercard', 'mada'];
        }

        return init;
    }

    function cardFormMounted() {
        return Boolean(
            document.getElementById('mysr-cc-number') ||
                document.querySelector('.mysr-form .mysr-form-cardInfo') ||
                document.querySelector('.mysr-form .mysr-form-inputGroup')
        );
    }

    function mountMoyasar(init) {
        var wrap = document.querySelector('.moyasar-wrap');
        if (!wrap) {
            showError('حاوية الدفع غير موجودة.');
            return;
        }
        wrap.innerHTML = '<div class="mysr-form"></div>';
        window.Moyasar.init(init);
    }

    function boot() {
        var cfg = window.paymentConfig || {};
        if (!cfg.paymentsEnabled || !cfg.moyasarPublishableKey) {
            showError('بوابة الدفع غير مفعّلة على الموقع.');
            return;
        }
        if (!window.Moyasar) {
            showError('تعذر تحميل مكتبة ميسر.');
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var planId = params.get('plan') || 'beni_ghanem_basic';
        var plan = PLANS[planId];
        if (!plan) {
            showError('نوع الدفعة غير معروف.');
            return;
        }

        var charge = resolveCharge(planId, params.get('amount'));
        if (charge == null) {
            showError('المبلغ غير صالح. ارجع واختر الخدمة من جديد.');
            return;
        }

        var channel = params.get('channel') === 'applepay' ? 'applepay' : 'card';
        if (charge.currency === 'KWD' && channel === 'applepay') {
            showError('الدفع بالدينار الكويتي عبر بطاقة Visa أو Mastercard فقط.');
            return;
        }

        var summary = document.getElementById('checkout-summary');
        if (summary) {
            summary.textContent =
                plan.title + ' — ' + formatAmount(charge.amount, charge.currency) + ' (يُخصم بالعملة المعروضة)';
        }

        if (cfg.moyasarTestMode) {
            var testBanner = document.getElementById('pay-test-banner');
            if (testBanner) testBanner.hidden = false;
        }

        var source = sanitizeSource(params.get('source'));

        sessionStorage.setItem('raddad_pay_plan', planId);
        sessionStorage.setItem('raddad_pay_amount', String(charge.amount));
        sessionStorage.setItem('raddad_pay_currency', charge.currency);
        if (source) sessionStorage.setItem('raddad_pay_source', source);

        var init = buildInit(cfg, planId, charge, channel, source);

        try {
            mountMoyasar(init);
        } catch (err) {
            showError(err && err.message ? err.message : 'تعذر تفعيل نموذج الدفع.');
            return;
        }

        if (channel !== 'card') return;

        window.setTimeout(function () {
            if (cardFormMounted()) return;
            var fallback = document.getElementById('checkout-fallback');
            if (fallback) fallback.hidden = false;
        }, 8000);
    }

    window.addEventListener('load', boot, { once: true });
})();
