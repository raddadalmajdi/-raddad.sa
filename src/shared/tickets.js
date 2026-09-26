import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';

export async function createTicket(db, user, payload) {
    const publicId = 'TK-' + Date.now().toString(36).toUpperCase();
    const ref = await addDoc(collection(db, 'tickets'), {
        uid: user.uid,
        email: user.email,
        title: payload.title,
        body: payload.body,
        priority: payload.priority,
        status: 'open',
        publicId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return { id: ref.id, publicId };
}

export async function fetchUserTickets(db, uid) {
    const q = query(collection(db, 'tickets'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    const tickets = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    tickets.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
    });
    return tickets;
}

export async function fetchAllTickets(db) {
    const snapshot = await getDocs(collection(db, 'tickets'));
    const tickets = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    tickets.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
    });
    return tickets;
}

export async function updateTicketStatus(db, ticketId, status) {
    await updateDoc(doc(db, 'tickets', ticketId), {
        status,
        updatedAt: serverTimestamp(),
    });
}
