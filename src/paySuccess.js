import { onAuthStateChanged } from 'firebase/auth';
import { initFirebase } from './firebase/init.js';
import { formatSarFromHalalas, getPlan } from './shared/paymentPlans.js';
import { markPaymentLinkPaid } from './shared/paymentLinks.js';
import { recordMoyasarPayment } from './shared/payments.js';

function boot() {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('id') || params.get('payment_id') || params.get('paymentId');
    const planId = params.get('plan') || sessionStorage.getItem('raddad_pay_plan') || '';
    const linkId = params.get('link') || sessionStorage.getItem('raddad_pay_link_id') || '';
    const linkTitle = sessionStorage.getItem('raddad_pay_link_title') || '';
    const amountHalalas = Number(sessionStorage.getItem('raddad_pay_amount') || 0);
    const plan = planId === 'payment_link' ? null : getPlan(planId);

    const statusEl = document.getElementById('pay-success-status');
    const detailEl = document.getElementById('pay-success-detail');

    if (!paymentId) {
        if (statusEl) {
            statusEl.textContent = 'لم نستلم رقم عملية من بوابة الدفع. إن تم الخصم تواصل معنا فوراً.';
            statusEl.className = 'status-banner status-banner--warn';
        }
        return;
    }

    if (statusEl) {
        statusEl.textContent = 'تم استلام تأكيد الدفع من البوابة — شكراً لك.';
        statusEl.className = 'status-banner status-banner--ok';
    }
    if (detailEl) {
        const serviceLine =
            planId === 'payment_link' && linkTitle
                ? `<p><strong>الخدمة:</strong> ${linkTitle}</p>`
                : plan
                  ? `<p><strong>الخدمة:</strong> ${plan.title}</p>`
                  : '';
        detailEl.innerHTML = `
            <p><strong>رقم العملية:</strong> ${paymentId}</p>
            ${serviceLine}
            ${amountHalalas ? `<p><strong>المبلغ:</strong> ${formatSarFromHalalas(amountHalalas)}</p>` : ''}
            <p class="muted">شكراً — سنتواصل معك عند الحاجة.</p>`;
    }

    const firebase = initFirebase();
    if (!firebase) return;

    const { auth, db } = firebase;

    if (linkId && paymentId) {
        void markPaymentLinkPaid(db, linkId, paymentId).catch((error) => {
            console.warn('markPaymentLinkPaid', error);
        });
    }

    onAuthStateChanged(auth, async (user) => {
        if (!user || !paymentId || !planId || !amountHalalas) return;
        const storageKey = `raddad_recorded_${paymentId}`;
        if (sessionStorage.getItem(storageKey)) return;
        try {
            await recordMoyasarPayment(db, user, {
                moyasarPaymentId: paymentId,
                planId,
                amountHalalas,
            });
            sessionStorage.setItem(storageKey, '1');
        } catch (error) {
            console.warn('recordMoyasarPayment', error);
        }
    });
}

boot();
