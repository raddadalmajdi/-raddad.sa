import {
    formatSarFromHalalas,
    getPlan,
    PAYMENT_PLAN_GROUPS,
    PAYMENT_PLANS,
} from './shared/paymentPlans.js';
import { showFormMessage } from './shared/ui.js';

function planOptionHtml(plan, checkedId) {
    return `
        <label class="pay-plan-option">
            <input type="radio" name="plan" value="${plan.id}" ${plan.id === checkedId ? 'checked' : ''}>
            <span class="pay-plan-option__body">
                <strong>${plan.title}</strong>
                <span class="muted">${plan.label}</span>
                <span class="pay-plan-option__desc">${plan.description}</span>
            </span>
        </label>`;
}

function renderPlanOptions(container, checkedId = 'beni_ghanem_invite') {
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

function boot() {
    const config = window.paymentConfig || {};
    const form = document.getElementById('pay-form');
    const planPicker = document.getElementById('pay-plan-picker');
    const customField = document.getElementById('pay-custom-amount-field');
    const customInput = document.getElementById('pay-custom-amount');
    const summary = document.getElementById('pay-summary');
    const inactiveNotice = document.getElementById('pay-inactive-notice');

    if (!form || !planPicker) return;

    const params = new URLSearchParams(window.location.search);
    const initialPlan = params.get('plan');
    const defaultPlan =
        initialPlan && getPlan(initialPlan) ? initialPlan : 'beni_ghanem_invite';

    renderPlanOptions(planPicker, defaultPlan);

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
            const checkoutParams = new URLSearchParams({
                plan: plan.id,
                channel,
            });
            if (plan.customAmount) {
                const sar = Number(String(customInput?.value || '').replace(/,/g, '').trim());
                if (!Number.isFinite(sar) || sar <= 0) {
                    throw new Error('أدخل مبلغ المقدّم بالريال.');
                }
                resolveAmountHalalas(plan, customInput?.value);
                checkoutParams.set('amount', String(sar));
            }
            window.location.href = `/pay-checkout.html?${checkoutParams.toString()}`;
        } catch (error) {
            showFormMessage(form, error.message || 'تعذر متابعة الدفع.', 'error');
        }
    });
}

boot();
