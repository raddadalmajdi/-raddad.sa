import {
    addDoc,
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { formatTicketPublicId, getTicketPeriod } from './ticketPublicId.js';

export async function createTicket(db, user, payload) {
    const counterRef = doc(db, 'counters', 'tickets');
    const ticketRef = doc(collection(db, 'tickets'));
    const period = getTicketPeriod();

    const { publicId } = await runTransaction(db, async (transaction) => {
        const counterSnap = await transaction.get(counterRef);
        const storedPeriod = counterSnap.exists() ? String(counterSnap.data().period || '') : '';
        const storedSeq = counterSnap.exists() ? Number(counterSnap.data().seq) || 0 : 0;
        const nextSeq = storedPeriod === period ? storedSeq + 1 : 1;
        const id = formatTicketPublicId(period, nextSeq);

        transaction.set(counterRef, { period, seq: nextSeq }, { merge: true });
        transaction.set(ticketRef, {
            uid: user.uid,
            email: user.email,
            title: payload.title,
            body: payload.body,
            priority: payload.priority,
            status: 'open',
            publicId: id,
            ticketPeriod: period,
            ticketSeq: nextSeq,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return { publicId: id, ticketSeq: nextSeq, ticketPeriod: period };
    });

    try {
        await addDoc(collection(db, 'tickets', ticketRef.id, 'messages'), {
            text: payload.body,
            authorRole: 'client',
            authorUid: user.uid,
            authorEmail: user.email,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.warn('createTicket message', error);
    }

    return { id: ticketRef.id, publicId };
}

export async function fetchTicketMessages(db, ticketId) {
    try {
        let snapshot;
        try {
            const q = query(
                collection(db, 'tickets', ticketId, 'messages'),
                orderBy('createdAt', 'asc')
            );
            snapshot = await getDocs(q);
        } catch {
            snapshot = await getDocs(collection(db, 'tickets', ticketId, 'messages'));
        }

        const messages = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        messages.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return aTime - bTime;
        });
        return messages;
    } catch (error) {
        console.warn('fetchTicketMessages', ticketId, error);
        return [];
    }
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
    if (!tickets.length) return [];
    return Promise.all(
        tickets.map(async (ticket) => {
            const messages = await fetchTicketMessages(db, ticket.id);
            return { ...ticket, messages };
        })
    );
}

export async function updateTicketStatus(db, ticketId, status) {
    await updateDoc(doc(db, 'tickets', ticketId), {
        status,
        updatedAt: serverTimestamp(),
    });
}
