/**
 * تهيئة ميسر — سكربت كلاسيكي (بدون ES modules) وفق توثيق mيسر.
 * https://docs.moyasar.com/guides/card-payments/basic-integration
 */
(function () {
    var PLANS = {
        beni_ghanem_invite: { title: 'دعوة زواج — بني غانم', halalas: 19900 },
        eysalk_monthly: { title: 'اشتراك إيصالك', halalas: 29900 },
        consultation: { title: 'استشارة تقنية', halalas: 50000 },
        maintenance: { title: 'اشتراك صيانة', halalas: 150000 },
        deposit: {
            title: 'مقدّم مشروع',
            custom: true,
            minHalalas: 500000,
            maxHalalas: 50000000,
        },
    };

    function showError(message) {
        var el = document.getElementById('checkout-error');
        if (!el) return;
        el.textContent = message;
        el.hidden = false;
    }

    function formatSar(halalas) {
        return (halalas / 100).toLocaleString('ar-SA', { maximumFractionDigits: 2 }) + ' ر.س';
    }

    function resolveAmount(planId, amountParam) {
        var plan = PLANS[planId];
        if (!plan) return null;
        if (!plan.custom) return plan.halalas;
        var sar = Number(String(amountParam || '').replace(/,/g, '').trim());
        if (!Number.isFinite(sar) || sar <= 0) return null;
        var halalas = Math.round(sar * 100);
        if (halalas < plan.minHalalas || halalas > plan.maxHalalas) return null;
        return halalas;
    }

    function buildInit(cfg, planId, amountHalalas, channel) {
        var callback =
            cfg.siteUrl + (cfg.callbackPath || '/pay-success.html') + '?plan=' + encodeURIComponent(planId);

        var init = {
            element: '.mysr-form',
            amount: amountHalalas,
            currency: 'SAR',
            language: 'ar',
            description: 'raddad.sa order',
            publishable_api_key: String(cfg.moyasarPublishableKey || '').trim(),
            callback_url: callback,
            fixed_width: false,
            metadata: {
                plan_id: planId,
                site: 'raddad.sa',
            },
        };

        if (channel === 'applepay') {
            init.methods = ['applepay'];
            init.apple_pay = {
                country: 'SA',
                label: 'Raddad',
                validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
            };
        } else {
            init.methods = ['creditcard'];
            init.supported_networks = ['visa', 'mastercard', 'mada'];
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
        var planId = params.get('plan') || 'beni_ghanem_invite';
        var plan = PLANS[planId];
        if (!plan) {
            showError('نوع الدفعة غير معروف.');
            return;
        }

        var amountHalalas = resolveAmount(planId, params.get('amount'));
        if (amountHalalas == null) {
            showError('المبلغ غير صالح. ارجع واختر الخدمة من جديد.');
            return;
        }

        var channel = params.get('channel') === 'applepay' ? 'applepay' : 'card';
        var summary = document.getElementById('checkout-summary');
        if (summary) {
            summary.textContent = plan.title + ' — ' + formatSar(amountHalalas);
        }

        if (cfg.moyasarTestMode) {
            var testBanner = document.getElementById('pay-test-banner');
            if (testBanner) testBanner.hidden = false;
        }

        sessionStorage.setItem('raddad_pay_plan', planId);
        sessionStorage.setItem('raddad_pay_amount', String(amountHalalas));

        var init = buildInit(cfg, planId, amountHalalas, channel);

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
