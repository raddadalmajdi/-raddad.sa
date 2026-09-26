import { onAuthStateChanged, signOut } from 'firebase/auth';
import { initFirebase } from './firebase/init.js';
import { createTicket, fetchUserTickets } from './shared/tickets.js';
import {
    escapeHtml,
    formatDate,
    priorityLabel,
    showFormMessage,
    statusLabel,
} from './shared/ui.js';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/raddad@raddad.sa';

async function notifyInbox(payload) {
    await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _captcha: 'false', _template: 'table', ...payload }),
    });
}

function renderTickets(container, tickets) {
    if (!tickets.length) {
        container.innerHTML = '<p class="muted">لا توجد تذاكر بعد.</p>';
        return;
    }

    container.innerHTML = tickets
        .map(
            (ticket) => `
        <article class="ticket-card">
            <div class="ticket-card__head">
                <strong>${escapeHtml(ticket.title)}</strong>
                <span class="ticket-pill ticket-pill--${escapeHtml(ticket.priority)}">${priorityLabel(ticket.priority)}</span>
            </div>
            <p>${escapeHtml(ticket.body)}</p>
            <footer>
                <span>#${escapeHtml(ticket.publicId || ticket.id)}</span>
                <span>${statusLabel(ticket.status)}</span>
                <time>${escapeHtml(formatDate(ticket.createdAt))}</time>
            </footer>
        </article>`
        )
        .join('');
}

function boot() {
    const firebase = initFirebase();
    const status = document.querySelector('[data-config-status]');
    const ticketsList = document.querySelector('[data-tickets-list]');
    const ticketForm = document.getElementById('ticket-form');
    const welcome = document.querySelector('[data-user-welcome]');
    const logoutBtn = document.querySelector('[data-logout]');

    if (!firebase) {
        if (status) {
            status.textContent = 'Firebase غير مهيأ. راجع js/firebase-config.js';
            status.className = 'status-banner status-banner--warn';
        }
        return;
    }

    const { auth, db } = firebase;

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = '/login.html?next=client';
            return;
        }

        if (welcome) {
            welcome.textContent = `مرحبًا ${user.displayName || 'عميل'} — ${user.email}`;
        }

        if (status) {
            status.textContent = 'متصل بـ Firebase.';
            status.className = 'status-banner status-banner--ok';
        }

        const tickets = await fetchUserTickets(db, user.uid);
        renderTickets(ticketsList, tickets);
    });

    ticketForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        const data = new FormData(ticketForm);
        const title = String(data.get('title') || '').trim();
        const body = String(data.get('body') || '').trim();
        const priority = String(data.get('priority') || 'normal');

        if (!title || !body) {
            showFormMessage(ticketForm, 'يرجى تعبئة عنوان التذكرة والتفاصيل.', 'error');
            return;
        }

        try {
            const ticket = await createTicket(db, user, { title, body, priority });
            await notifyInbox({
                _subject: `تذكرة دعم جديدة — ${ticket.publicId}`,
                type: 'ticket',
                ticket_id: ticket.publicId,
                email: user.email,
                title,
                body,
                priority,
            });

            showFormMessage(ticketForm, `تم فتح التذكرة ${ticket.publicId} بنجاح.`, 'success');
            ticketForm.reset();
            const tickets = await fetchUserTickets(db, user.uid);
            renderTickets(ticketsList, tickets);
        } catch (error) {
            showFormMessage(ticketForm, error.message || 'تعذر إنشاء التذكرة.', 'error');
        }
    });

    logoutBtn?.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = '/login.html';
    });
}

boot();
