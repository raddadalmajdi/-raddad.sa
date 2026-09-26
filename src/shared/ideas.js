import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

export async function createIdea(db, payload) {
    await addDoc(collection(db, 'ideas'), {
        ...payload,
        status: 'new',
        createdAt: serverTimestamp(),
    });
}

export async function fetchAllIdeas(db) {
    const snapshot = await getDocs(collection(db, 'ideas'));
    const ideas = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    ideas.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
    });
    return ideas;
}
