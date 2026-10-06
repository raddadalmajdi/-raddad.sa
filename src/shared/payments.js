import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';

export async function recordMoyasarPayment(db, user, payload) {
    const docRef = await addDoc(collection(db, 'payments'), {
        uid: user.uid,
        email: user.email || '',
        gateway: 'moyasar',
        moyasarPaymentId: payload.moyasarPaymentId,
        planId: payload.planId,
        amountHalalas: payload.amountHalalas,
        status: 'redirect_received',
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function fetchAllPayments(db) {
    let snapshot;
    try {
        snapshot = await getDocs(query(collection(db, 'payments'), orderBy('createdAt', 'desc')));
    } catch {
        snapshot = await getDocs(collection(db, 'payments'));
    }
    const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    rows.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    return rows;
}
