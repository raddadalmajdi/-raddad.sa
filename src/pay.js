import { initFirebase } from './firebase/init.js';
import { formatSarFromHalalas, getPlan, PAYMENT_PLANS } from './shared/paymentPlans.js';
import { showFormMessage } from './shared/ui.js';

const MOYASAR_JS = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
const MOYASAR_CSS = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.css';

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

function renderPlanOptions(container) {
    container.innerHTML = Object.values(PAYMENT_PLANS)
        .map(
            (plan) => `
        <label class="pay-plan-option">
            <input type="radio" name="plan" value="${plan.id}" ${plan.id === 'consultation' ? 'checked' : ''}>
            <span class="pay-plan-option__body">
                <strong>${plan.title}</strong>
                <span class="muted">${plan.label}</span>
            </span>
        </label>`
        )
        .join('');
}

function getSelectedPlanId(form) {
    const selected = form.querySelector('input[name="plan"]:checked');
    return selected ? selected.value : 'consultation';
}

function resolveAmountHalalas(plan, customInput) {
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

async function mountMoyasarForm({ plan, amountHalalas, config }) {
    const mount = document.getElementById('moyasar-form');
    if (!mount) return;

    mount.innerHTML = '';
    loadStylesheet(MOYASAR_CSS);
    await loadScript(MOYASAR_JS);

    if (!window.Moyasar) {
        throw new Error('بوابة الدفع غير جاهزة.');
    }

    const callbackUrl = `${config.siteUrl}${config.callbackPath}?plan=${encodeURIComponent(plan.id)}`;
    sessionStorage.setItem('raddad_pay_plan', plan.id);
    sessionStorage.setItem('raddad_pay_amount', String(amountHalalas));

    window.Moyasar.init({
        element: '#moyasar-form',
        amount: amountHalalas,
        currency: 'SAR',
        description: `raddad.sa — ${plan.title}`,
        publishable_api_key: config.moyasarPublishableKey,
        callback_url: callbackUrl,
        methods: ['creditcard', 'mada', 'applepay'],
        metadata: {
            plan_id: plan.id,
            site: 'raddad.sa',
        },
    });
}

function boot() {
    const config = window.paymentConfig || {};
    const form = document.getElementById('pay-form');
    const planPicker = document.getElementById('pay-plan-picker');
    const customField = document.getElementById('pay-custom-amount-field');
    const customInput = document.getElementById('pay-custom-amount');
    const summary = document.getElementById('pay-summary');
    const gatewayBox = document.getElementById('pay-gateway');
    const inactiveNotice = document.getElementById('pay-inactive-notice');

    if (!form || !planPicker) return;

    const params = new URLSearchParams(window.location.search);
    const initialPlan = params.get('plan');
    if (initialPlan && getPlan(initialPlan)) {
        const radio = form.querySelector(`input[name="plan"][value="${initialPlan}"]`);
        if (radio) radio.checked = true;
    }

    renderPlanOptions(planPicker);

    function syncCustomField() {
        const plan = getPlan(getSelectedPlanId(form));
        const show = Boolean(plan?.customAmount);
        if (customField) customField.hidden = !show;
        if (summary && plan) {
            summary.textContent = plan.customAmount
                ? 'أدخل مبلغ المقدّم المتفق عليه في عرض السعر.'
                : `المبلغ: ${plan.label}`;
        }
    }

    planPicker.addEventListener('change', syncCustomField);
    syncCustomField();

    if (!config.paymentsEnabled) {
        if (inactiveNotice) inactiveNotice.hidden = false;
        if (gatewayBox) gatewayBox.hidden = true;
        return;
    }

    if (inactiveNotice) inactiveNotice.hidden = true;
    if (gatewayBox) gatewayBox.hidden = false;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const plan = getPlan(getSelectedPlanId(form));
        if (!plan) {
            showFormMessage(form, 'اختر نوع الدفعة.', 'error');
            return;
        }
        try {
            const amountHalalas = resolveAmountHalalas(plan, customInput?.value);
            if (summary) {
                summary.textContent = `المبلغ المطلوب: ${formatSarFromHalalas(amountHalalas)}`;
            }
            await mountMoyasarForm({ plan, amountHalalas, config });
            showFormMessage(form, 'أكمل الدفع في النموذج الآمن أدناه.', 'success');
        } catch (error) {
            showFormMessage(form, error.message || 'تعذر تجهيز الدفع.', 'error');
        }
    });
}

boot();
