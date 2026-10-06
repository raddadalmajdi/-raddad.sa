import { onAuthStateChanged } from 'firebase/auth';
import { initFirebase } from './firebase/init.js';
import { formatSarFromHalalas, getPlan } from './shared/paymentPlans.js';
import { recordMoyasarPayment } from './shared/payments.js';

function boot() {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('id') || params.get('payment_id') || params.get('paymentId');
    const planId = params.get('plan') || sessionStorage.getItem('raddad_pay_plan') || '';
    const amountHalalas = Number(sessionStorage.getItem('raddad_pay_amount') || 0);
    const plan = getPlan(planId);

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
        detailEl.innerHTML = `
            <p><strong>رقم العملية:</strong> ${paymentId}</p>
            ${plan ? `<p><strong>الخدمة:</strong> ${plan.title}</p>` : ''}
            ${amountHalalas ? `<p><strong>المبلغ:</strong> ${formatSarFromHalalas(amountHalalas)}</p>` : ''}
            <p class="muted">سيصلك تأكيد على البريد، ويمكنك متابعة مشروعك من <a href="/client.html">بوابة العميل</a>.</p>`;
    }

    const firebase = initFirebase();
    if (!firebase) return;

    const { auth, db } = firebase;
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
