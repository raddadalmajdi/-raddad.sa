import { onAuthStateChanged, signOut } from 'firebase/auth';
import { initFirebase, isAdminEmail, prepareAuthPersistence } from './firebase/init.js';
import { watchIdleSession } from './shared/sessionIdle.js';
import {
    addTicketMessage,
    createTicket,
    fetchTicketsWithMessages,
    fetchUserTickets,
} from './shared/tickets.js';
import { renderTicketCard } from './shared/ticketUi.js';
import { firestoreErrorMessage, showFormMessage } from './shared/ui.js';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/raddad@raddad.sa';

async function notifyInbox(payload) {
    await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _captcha: 'false', _template: 'table', ...payload }),
    });
}

async function renderTickets(container, db, tickets) {
    if (!container) return;
    if (!tickets.length) {
        container.innerHTML = '<p class="muted">لا توجد تذاكر بعد.</p>';
        return;
    }

    const withMessages = await fetchTicketsWithMessages(db, tickets);
    container.innerHTML = withMessages
        .map((ticket) =>
            renderTicketCard(ticket, {
                canManage: false,
                canReply: true,
                messages: ticket.messages || [],
            })
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
            'حساب عميل — تابع تذاكرك ورد على المحادثة بنفس رقم التذكرة. تُنهى الجلسة بعد 10 دقائق بدون نشاط.';
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

    async function reloadTickets(user) {
        const tickets = await fetchUserTickets(db, user.uid);
        await renderTickets(ticketsList, db, tickets);
    }

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
            await reloadTickets(user);
        } catch (error) {
            if (status) {
                const code = error?.code || '';
                status.textContent =
                    code === 'permission-denied'
                        ? 'تعذر قراءة التذاكر — تأكد من نشر قواعد Firestore في Firebase Console (ملف firestore.rules).'
                        : 'تعذر تحميل التذاكر. أعد تحميل الصفحة أو جرّب لاحقًا.';
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
            await reloadTickets(user);
        } catch (error) {
            showFormMessage(ticketForm, firestoreErrorMessage(error) || 'تعذر إنشاء التذكرة.', 'error');
        }
    });

    document.addEventListener('submit', async (event) => {
        const form = event.target;
        if (!(form instanceof HTMLFormElement) || !form.matches('[data-ticket-reply]')) {
            return;
        }
        event.preventDefault();

        const user = auth.currentUser;
        if (!user || isAdminEmail(user.email)) return;

        const ticketId = form.getAttribute('data-ticket-id');
        const text = String(new FormData(form).get('reply') || '').trim();
        if (!ticketId || !text) {
            showFormMessage(form, 'اكتب نص الرد.', 'error');
            return;
        }

        try {
            await addTicketMessage(db, ticketId, user, text, 'client');
            const publicId =
                form.closest('[data-ticket-card]')?.querySelector('.ticket-id')?.textContent?.replace('#', '') ||
                ticketId;
            await notifyInbox({
                _subject: `رد عميل على التذكرة ${publicId}`,
                type: 'ticket_reply_client',
                ticket_id: publicId,
                email: user.email,
                message: text,
            });
            form.reset();
            showFormMessage(form, 'تم إرسال ردك. سيتابعك الفريق على نفس التذكرة.', 'success');
            await reloadTickets(user);
        } catch (error) {
            showFormMessage(form, error.message || 'تعذر إرسال الرد.', 'error');
        }
    });

    logoutBtn?.addEventListener('click', async () => {
        await signOut(auth);
        window.location.replace('/login.html?next=client');
    });
}

boot().catch(console.error);
