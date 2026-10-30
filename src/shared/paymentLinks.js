import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    orderBy,
    limit,
} from 'firebase/firestore';

const COLLECTION = 'paymentLinks';
const TITLE_MIN = 3;
const TITLE_MAX = 120;
const MIN_HALALAS = 100;
const MAX_HALALAS = 50000000;

function clampTitle(raw) {
    const t = String(raw || '').trim().replace(/\s+/g, ' ');
    if (t.length < TITLE_MIN || t.length > TITLE_MAX) {
        throw new Error(`اسم الخدمة بين ${TITLE_MIN} و${TITLE_MAX} حرفاً.`);
    }
    return t;
}

function parseAmountHalalas(amountSar) {
    const sar = Number(String(amountSar || '').replace(/,/g, '').trim());
    if (!Number.isFinite(sar) || sar <= 0) {
        throw new Error('أدخل المبلغ بالريال.');
    }
    const halalas = Math.round(sar * 100);
    if (halalas < MIN_HALALAS || halalas > MAX_HALALAS) {
        throw new Error('المبلغ خارج الحد المسموح.');
    }
    return halalas;
}

export function buildPaymentLinkUrl(linkId, siteUrl = 'https://raddad.sa') {
    const base = String(siteUrl || 'https://raddad.sa').replace(/\/$/, '');
    return `${base}/pay-request.html?link=${encodeURIComponent(linkId)}`;
}

export function buildWhatsAppShareUrl(linkUrl, serviceTitle, amountLabel) {
    const text = `مرحباً،\nرابط الدفع لـ «${serviceTitle}» — ${amountLabel}:\n${linkUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export async function createPaymentLink(db, adminEmail, { serviceTitle, amountSar }) {
    const title = clampTitle(serviceTitle);
    const amountHalalas = parseAmountHalalas(amountSar);
    const id = crypto.randomUUID();
    await setDoc(doc(db, COLLECTION, id), {
        serviceTitle: title,
        amountHalalas,
        status: 'active',
        createdAt: serverTimestamp(),
        createdBy: String(adminEmail || '').toLowerCase(),
    });
    return { id, serviceTitle: title, amountHalalas };
}

export async function fetchPaymentLinkPublic(db, linkId) {
    const id = String(linkId || '').trim();
    if (!id || id.length > 64) return null;
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.status !== 'active') return null;
    return {
        id: snap.id,
        serviceTitle: data.serviceTitle,
        amountHalalas: data.amountHalalas,
        status: data.status,
    };
}

export async function fetchAllPaymentLinks(db, max = 40) {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function cancelPaymentLink(db, linkId) {
    await updateDoc(doc(db, COLLECTION, linkId), {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
    });
}

export async function markPaymentLinkPaid(db, linkId, moyasarPaymentId) {
    await updateDoc(doc(db, COLLECTION, linkId), {
        status: 'paid',
        paidAt: serverTimestamp(),
        moyasarPaymentId: String(moyasarPaymentId || ''),
    });
}
