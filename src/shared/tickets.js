import {
    addDoc,
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';

export async function createTicket(db, user, payload) {
    const publicId = 'TK-' + Date.now().toString(36).toUpperCase();
    const ticketRef = await addDoc(collection(db, 'tickets'), {
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

    await addDoc(collection(db, 'tickets', ticketRef.id, 'messages'), {
        text: payload.body,
        authorRole: 'client',
        authorUid: user.uid,
        authorEmail: user.email,
        createdAt: serverTimestamp(),
    });

    return { id: ticketRef.id, publicId };
}

export async function fetchTicketMessages(db, ticketId) {
    const q = query(
        collection(db, 'tickets', ticketId, 'messages'),
        orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function addTicketMessage(db, ticketId, user, text, authorRole) {
    const trimmed = String(text || '').trim();
    if (!trimmed) {
        throw new Error('اكتب نص الرد قبل الإرسال.');
    }

    await addDoc(collection(db, 'tickets', ticketId, 'messages'), {
        text: trimmed,
        authorRole,
        authorUid: user.uid,
        authorEmail: user.email || '',
        createdAt: serverTimestamp(),
    });

    const patch = {
        updatedAt: serverTimestamp(),
    };
    if (authorRole === 'admin') {
        patch.lastReplyBy = 'admin';
        patch.lastReplyAt = serverTimestamp();
    } else {
        patch.lastReplyBy = 'client';
        patch.lastReplyAt = serverTimestamp();
    }

    await updateDoc(doc(db, 'tickets', ticketId), patch);
}

export async function fetchUserTickets(db, uid) {
    const q = query(collection(db, 'tickets'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    const tickets = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    tickets.sort((a, b) => {
        const aTime = a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
        const bTime = b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
    });
    return tickets;
}

export async function fetchAllTickets(db) {
    const snapshot = await getDocs(collection(db, 'tickets'));
    const tickets = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    tickets.sort((a, b) => {
        const aTime = a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
        const bTime = b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
    });
    return tickets;
}

export async function fetchTicketsWithMessages(db, tickets) {
    const withMessages = await Promise.all(
        tickets.map(async (ticket) => {
            const messages = await fetchTicketMessages(db, ticket.id);
            return { ...ticket, messages };
        })
    );
    return withMessages;
}

export async function updateTicketStatus(db, ticketId, status) {
    await updateDoc(doc(db, 'tickets', ticketId), {
        status,
        updatedAt: serverTimestamp(),
    });
}
