import {
    formatChargeAmount,
    getPlan,
    getPlanCurrency,
    PAYMENT_PLAN_GROUPS,
    PAYMENT_PLANS,
    resolvePlanChargeMinor,
} from './shared/paymentPlans.js';
import { showFormMessage } from './shared/ui.js';

function planOptionHtml(plan, checkedId) {
    const name = plan.choiceLabel || plan.title;
    const flag = plan.currency === 'KWD' ? '🇰🇼' : '🇸🇦';
    return `
        <label class="pay-plan-option pay-plan-option--compact${plan.currency === 'KWD' ? ' pay-plan-option--kwd' : ''}">
            <input type="radio" name="plan" value="${plan.id}" ${plan.id === checkedId ? 'checked' : ''}>
            <span class="pay-plan-option__row">
                <span class="pay-plan-option__name">${name}</span>
                <span class="pay-plan-option__price">${plan.label} <span class="pay-currency-flag" aria-hidden="true">${flag}</span></span>
            </span>
        </label>`;
}

function renderPlanOptions(container, checkedId = 'beni_ghanem_basic') {
    const blocks = PAYMENT_PLAN_GROUPS.map((group) => {
        const options = group.planIds
            .map((id) => PAYMENT_PLANS[id])
            .filter(Boolean)
            .map((plan) => planOptionHtml(plan, checkedId))
            .join('');
        return `<fieldset class="pay-plan-group"><legend>${group.legend}</legend>${options}</fieldset>`;
    });
    container.innerHTML = blocks.join('');
}

function getSelectedPlanId(form) {
    const selected = form.querySelector('input[name="plan"]:checked');
    return selected ? selected.value : 'consultation';
}

function getSelectedPayChannel(form) {
    const selected = form.querySelector('input[name="pay_channel"]:checked');
    return selected?.value === 'applepay' ? 'applepay' : 'card';
}

function sanitizePaySource(raw) {
    const s = String(raw || '').trim().toLowerCase();
    if (!/^[a-z][a-z0-9_]{0,31}$/.test(s)) return '';
    return s;
}

function boot() {
    const config = window.paymentConfig || {};
    const form = document.getElementById('pay-form');
    const planPicker = document.getElementById('pay-plan-picker');
    const customField = document.getElementById('pay-custom-amount-field');
    const customInput = document.getElementById('pay-custom-amount');
    const summary = document.getElementById('pay-summary');
    const inactiveNotice = document.getElementById('pay-inactive-notice');
    const applePayLabel = form?.querySelector('input[name="pay_channel"][value="applepay"]')?.closest('label');

    if (!form || !planPicker) return;

    const params = new URLSearchParams(window.location.search);
    const initialPlan = params.get('plan');
    const initialSource = sanitizePaySource(params.get('source'));
    const defaultPlan =
        initialPlan && getPlan(initialPlan) ? getPlan(initialPlan).id : 'beni_ghanem_basic';

    renderPlanOptions(planPicker, defaultPlan);

    function syncCustomField() {
        const plan = getPlan(getSelectedPlanId(form));
        const show = Boolean(plan?.customAmount);
        if (customField) customField.hidden = !show;
        const isKwd = plan?.currency === 'KWD';
        if (applePayLabel) {
            applePayLabel.hidden = isKwd;
            if (isKwd) {
                form.querySelector('input[name="pay_channel"][value="card"]')?.click();
            }
        }
        if (summary && plan) {
            if (plan.customAmount) {
                summary.textContent = 'المبلغ حسب عرض السعر أدناه.';
            } else {
                const minor = resolvePlanChargeMinor(plan);
                summary.textContent = `${plan.label} — يُخصم ${formatChargeAmount(minor, getPlanCurrency(plan))} من بطاقتك.`;
            }
        }
    }

    planPicker.addEventListener('change', syncCustomField);
    syncCustomField();

    if (!config.paymentsEnabled) {
        if (inactiveNotice) inactiveNotice.hidden = false;
        form.querySelector('button[type="submit"]')?.setAttribute('disabled', 'disabled');
        return;
    }

    if (inactiveNotice) inactiveNotice.hidden = true;
    form.querySelector('button[type="submit"]')?.removeAttribute('disabled');

    if (config.moyasarTestMode) {
        const testBanner = document.getElementById('pay-test-banner');
        if (testBanner) testBanner.hidden = false;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const plan = getPlan(getSelectedPlanId(form));
        if (!plan) {
            showFormMessage(form, 'اختر نوع الدفعة.', 'error');
            return;
        }
        try {
            const channel = getSelectedPayChannel(form);
            if (plan.currency === 'KWD' && channel === 'applepay') {
                throw new Error('خدمات بني غانم بالدينار — استخدم بطاقة Visa أو Mastercard.');
            }
            const checkoutParams = new URLSearchParams({
                plan: plan.id,
                channel,
            });
            const source = initialSource || plan.source || '';
            if (source) checkoutParams.set('source', source);
            if (plan.customAmount) {
                const sar = Number(String(customInput?.value || '').replace(/,/g, '').trim());
                if (!Number.isFinite(sar) || sar <= 0) {
                    throw new Error('أدخل مبلغ المقدّم بالريال.');
                }
                resolvePlanChargeMinor(plan, customInput?.value);
                checkoutParams.set('amount', String(sar));
            }
            window.location.href = `/pay-checkout.html?${checkoutParams.toString()}`;
        } catch (error) {
            showFormMessage(form, error.message || 'تعذر متابعة الدفع.', 'error');
        }
    });
}

boot();
