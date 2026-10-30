import { initFirebase } from './firebase/init.js';
import { fetchPaymentLinkPublic } from './shared/paymentLinks.js';
import { formatSarFromHalalas } from './shared/paymentPlans.js';

function showState({ loading, error, link }) {
    const loadingEl = document.getElementById('pay-request-loading');
    const errorEl = document.getElementById('pay-request-error');
    const cardEl = document.getElementById('pay-request-card');
    const titleEl = document.getElementById('pay-request-title');
    const amountEl = document.getElementById('pay-request-amount');
    const payBtn = document.getElementById('pay-request-go');

    if (loadingEl) loadingEl.hidden = !loading;
    if (errorEl) {
        errorEl.hidden = !error;
        if (error) errorEl.textContent = error;
    }
    if (cardEl) cardEl.hidden = !link;
    if (!link) return;

    if (titleEl) titleEl.textContent = link.serviceTitle;
    if (amountEl) amountEl.textContent = formatSarFromHalalas(link.amountHalalas);
    if (payBtn) {
        payBtn.href = `/pay-checkout.html?link=${encodeURIComponent(link.id)}&channel=card`;
    }
}

async function boot() {
    const params = new URLSearchParams(window.location.search);
    const linkId = params.get('link');
    if (!linkId) {
        showState({ loading: false, error: 'رابط الدفع غير صالح.', link: null });
        return;
    }

    const firebase = initFirebase();
    if (!firebase) {
        showState({ loading: false, error: 'تعذر الاتصال. حاول لاحقاً.', link: null });
        return;
    }

    try {
        const link = await fetchPaymentLinkPublic(firebase.db, linkId);
        if (!link) {
            showState({
                loading: false,
                error: 'انتهت صلاحية الرابط أو تم الدفع مسبقاً. تواصل معنا إن احتجت رابطاً جديداً.',
                link: null,
            });
            return;
        }
        showState({ loading: false, error: '', link });
    } catch (err) {
        console.error(err);
        showState({ loading: false, error: 'تعذر تحميل تفاصيل الدفع.', link: null });
    }
}

boot();
