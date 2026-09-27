import { onAuthStateChanged, signOut } from 'firebase/auth';
import { initFirebase, isAdminEmail, prepareAuthPersistence } from './firebase/init.js';
import { watchIdleSession } from './shared/sessionIdle.js';
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
    if (!container) return;
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

function showClientDashboard(ui, user) {
    ui.dashboard.hidden = false;
    ui.loginPrompt.hidden = true;
    ui.logoutBtn.hidden = false;
    if (ui.welcome) {
        ui.welcome.hidden = false;
        ui.welcome.textContent = `مرحبًا ${user.displayName || 'عميل'} — ${user.email}`;
    }
    if (ui.status) {
        ui.status.textContent =
            'حساب عميل — يمكنك فتح تذكرة ومتابعتها هنا. تُنهى الجلسة تلقائيًا بعد 10 دقائق بدون نشاط.';
        ui.status.className = 'status-banner status-banner--ok';
    }
}

function showLoginRequired(ui) {
    ui.dashboard.hidden = true;
    ui.loginPrompt.hidden = false;
    ui.logoutBtn.hidden = true;
    if (ui.welcome) {
        ui.welcome.hidden = true;
    }
    if (ui.status) {
        ui.status.textContent = 'يجب تسجيل الدخول أو إنشاء حساب عميل للمتابعة.';
        ui.status.className = 'status-banner status-banner--warn';
    }
}

async function boot() {
    const firebase = initFirebase();
    const status = document.querySelector('[data-config-status]');
    const ticketsList = document.querySelector('[data-tickets-list]');
    const ticketForm = document.getElementById('ticket-form');
    const welcome = document.querySelector('[data-user-welcome]');
    const logoutBtn = document.querySelector('[data-logout]');
    const dashboard = document.querySelector('[data-client-dashboard]');
    const loginPrompt = document.querySelector('[data-client-login-prompt]');

    const ui = { status, welcome, logoutBtn, dashboard, loginPrompt };

    if (!firebase) {
        if (status) {
            status.textContent = 'Firebase غير مهيأ. راجع js/firebase-config.js';
            status.className = 'status-banner status-banner--warn';
        }
        return;
    }

    try {
        await prepareAuthPersistence(firebase.auth);
    } catch (error) {
        console.warn('Auth persistence', error);
    }

    const { auth, db } = firebase;
    let stopIdleWatch = null;

    onAuthStateChanged(auth, async (user) => {
        if (stopIdleWatch) {
            stopIdleWatch();
            stopIdleWatch = null;
        }
        if (!user) {
            showLoginRequired(ui);
            window.location.replace('/login.html?next=client');
            return;
        }

        if (isAdminEmail(user.email)) {
            if (status) {
                status.textContent =
                    'أنت مسجّل كأدمن — لوحة العميل للعملاء فقط. جارٍ تحويلك إلى لوحة الأدمن…';
                status.className = 'status-banner status-banner--warn';
            }
            ui.dashboard.hidden = true;
            ui.loginPrompt.hidden = true;
            window.location.replace('/admin.html');
            return;
        }

        showClientDashboard(ui, user);

        stopIdleWatch = watchIdleSession(auth, {
            onTimeout: () => {
                window.location.replace('/login.html?reason=timeout');
            },
        });

        try {
            const tickets = await fetchUserTickets(db, user.uid);
            renderTickets(ticketsList, tickets);
        } catch (error) {
            if (status) {
                status.textContent = 'تعذر تحميل التذاكر. أعد تحميل الصفحة.';
                status.className = 'status-banner status-banner--warn';
            }
            console.error(error);
        }
    });

    ticketForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            showFormMessage(ticketForm, 'سجّل الدخول أولًا.', 'error');
            window.location.href = '/login.html?next=client';
            return;
        }
        if (isAdminEmail(user.email)) {
            showFormMessage(ticketForm, 'حساب الأدمن لا يفتح تذاكر عميل. استخدم لوحة الأدمن.', 'error');
            return;
        }

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
        window.location.replace('/login.html?next=client');
    });
}

boot().catch(console.error);
