import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initFirebase, isAdminEmail, needsFirestoreLongPolling, prepareAuthPersistence } from './firebase/init.js';
import { watchIdleSession } from './shared/sessionIdle.js';
import { fetchAllIdeas } from './shared/ideas.js';
import {
    addTicketMessage,
    fetchAllTickets,
    fetchTicketsWithMessages,
    isTicketNewForAdmin,
    markTicketSeenByAdmin,
    sortTicketsForAdmin,
    updateTicketStatus,
} from './shared/tickets.js';
import { renderTicketCard } from './shared/ticketUi.js';
import {
    authErrorMessage,
    escapeHtml,
    formatDate,
    priorityLabel,
    showFormMessage,
    statusLabel,
} from './shared/ui.js';

const AUTH_TIMEOUT_MS = 25000;
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/raddad@raddad.sa';

function withTimeout(promise, ms, message) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), ms);
        }),
    ]);
}

function setSubmitLoading(form, loading) {
    const btn = form?.querySelector('button[type="submit"]');
    if (!btn) return;
    const defaultLabel = btn.getAttribute('data-submit-label') || btn.textContent || 'دخول';
    btn.disabled = loading;
    btn.classList.toggle('is-loading', loading);
    btn.setAttribute('aria-busy', loading ? 'true' : 'false');
    btn.textContent = loading ? 'جاري التحقق…' : defaultLabel;
}

function setupSafariPasswordField() {
    if (!needsFirestoreLongPolling()) return;
    const passwordInput = document.getElementById('admin-password');
    if (!(passwordInput instanceof HTMLInputElement)) return;

    passwordInput.setAttribute('readonly', 'true');
    const unlock = () => {
        passwordInput.removeAttribute('readonly');
    };
    passwordInput.addEventListener('pointerdown', unlock, { once: true });
    passwordInput.addEventListener('focus', unlock, { once: true });
}

function notifyUser(form, statusEl, message, type) {
    showFormMessage(form, message, type);
    const box = form?.querySelector('.form-message');
    if (box) {
        box.setAttribute('role', 'alert');
        box.scrollIntoView({ block: 'nearest' });
    }
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className =
            type === 'error'
                ? 'status-banner status-banner--warn'
                : 'status-banner status-banner--ok';
    }
}

function renderTickets(container, tickets, canManage) {
    if (!container) return;
    if (!tickets.length) {
        container.innerHTML = '<p class="muted">لا توجد تذاكر.</p>';
        return;
    }

    container.innerHTML = tickets
        .map((ticket) =>
            renderTicketCard(ticket, {
                canManage,
                canReply: canManage,
                messages: ticket.messages || [],
            })
        )
        .join('');
}

function renderIdeas(container, ideas) {
    if (!ideas.length) {
        container.innerHTML = '<p class="muted">لا توجد طلبات أفكار.</p>';
        return;
    }

    container.innerHTML = ideas
        .map(
            (idea) => `
        <article class="ticket-card">
            <div class="ticket-card__head">
                <strong>${escapeHtml(idea.app_name || 'فكرة تطبيق')}</strong>
                <span class="ticket-pill ticket-pill--normal">${escapeHtml(idea.platform || 'غير محدد')}</span>
            </div>
            <p class="muted">${escapeHtml(idea.name)} — ${escapeHtml(idea.email)} — ${escapeHtml(idea.phone || '')}</p>
            <p>${escapeHtml(idea.description)}</p>
            <footer>
                <span>الميزانية: ${escapeHtml(idea.budget || '—')}</span>
                <time>${escapeHtml(formatDate(idea.createdAt))}</time>
            </footer>
        </article>`
        )
        .join('');
}

async function loadDashboard(db, canManage, statusEl) {
    let rawTickets = [];
    let ideas = [];
    let loadError = null;

    try {
        rawTickets = await fetchAllTickets(db);
    } catch (error) {
        loadError = error;
        console.error('fetchAllTickets', error);
    }

    try {
        ideas = await fetchAllIdeas(db);
    } catch (error) {
        if (!loadError) loadError = error;
        console.error('fetchAllIdeas', error);
    }

    let tickets = [];
    try {
        tickets = await fetchTicketsWithMessages(db, rawTickets);
    } catch (error) {
        if (!loadError) loadError = error;
        tickets = rawTickets.map((ticket) => ({ ...ticket, messages: [] }));
    }
    tickets = sortTicketsForAdmin(tickets);

    renderTickets(document.querySelector('[data-admin-tickets]'), tickets, canManage);
    renderIdeas(document.querySelector('[data-admin-ideas]'), ideas);

    document.querySelector('[data-stats-tickets]').textContent = String(tickets.length);
    document.querySelector('[data-stats-ideas]').textContent = String(ideas.length);
    document.querySelector('[data-stats-open]').textContent = String(
        tickets.filter((ticket) => ticket.status !== 'closed').length
    );
    const newCount = tickets.filter((ticket) => isTicketNewForAdmin(ticket)).length;
    const newStat = document.querySelector('[data-stats-new]');
    if (newStat) {
        newStat.textContent = String(newCount);
    }

    if (statusEl && loadError) {
        const code = loadError?.code || '';
        statusEl.textContent =
            code === 'permission-denied'
                ? 'تعذر قراءة البيانات — انشر قواعد Firestore من المشروع (firestore.rules) في Firebase Console.'
                : 'تم الدخول لكن تعذر تحميل بعض البيانات. حدّث الصفحة أو راجع Firestore ونطاق raddad.sa.';
        statusEl.className = 'status-banner status-banner--warn';
    } else if (statusEl && tickets.length) {
        statusEl.textContent = `لوحة الأدمن — ${tickets.length} تذكرة`;
        statusEl.className = 'status-banner status-banner--ok';
    }

    return { loadError, tickets };
}

function boot() {
    const loginPanel = document.querySelector('[data-admin-login]');
    const dashboard = document.querySelector('[data-admin-dashboard]');
    const status = document.querySelector('[data-config-status]');
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.querySelector('[data-logout]');
    const welcome = document.querySelector('[data-admin-welcome]');

    let firebase;
    try {
        firebase = initFirebase();
    } catch (error) {
        console.error(error);
        if (status) {
            status.textContent = 'تعذر الاتصال بـ Firebase. حدّث الصفحة أو جرّب متصفحاً آخر.';
            status.className = 'status-banner status-banner--warn';
        }
        return;
    }

    if (!firebase) {
        if (status) {
            status.textContent = 'Firebase غير مهيأ. راجع js/firebase-config.js';
            status.className = 'status-banner status-banner--warn';
        }
        return;
    }

    const { auth, db } = firebase;

    setupSafariPasswordField();

    const timeoutParam = new URLSearchParams(window.location.search).get('reason');
    if (status && timeoutParam === 'timeout') {
        status.textContent = 'انتهت جلسة الأدمن لعدم النشاط (10 دقائق). سجّل الدخول مجددًا.';
        status.className = 'status-banner status-banner--warn';
    } else if (status) {
        status.textContent = 'جاهز — أدخل كلمة المرور ثم اضغط دخول';
        status.className = 'status-banner status-banner--ok';
    }

    let authListenerAttached = false;
    let stopIdleWatch = null;

    const attachAuthListener = () => {
        if (authListenerAttached) return;
        authListenerAttached = true;

        onAuthStateChanged(auth, (user) => {
            try {
                if (stopIdleWatch) {
                    stopIdleWatch();
                    stopIdleWatch = null;
                }
                handleAuthUser(user);
            } catch (error) {
                console.error('onAuthStateChanged', error);
                if (status) {
                    status.textContent = 'حدث خطأ في الجلسة. أعد تحميل الصفحة وحاول الدخول مرة أخرى.';
                    status.className = 'status-banner status-banner--warn';
                }
            }
        });
    };

    function handleAuthUser(user) {
        const isAdmin = Boolean(user && isAdminEmail(user.email));

        if (!isAdmin) {
            if (loginPanel) loginPanel.hidden = false;
            if (dashboard) dashboard.hidden = true;
            if (status && !user) {
                status.textContent = 'جاهز — أدخل كلمة المرور ثم اضغط دخول';
                status.className = 'status-banner status-banner--ok';
            }
            if (user && !isAdminEmail(user.email)) {
                notifyUser(
                    loginForm,
                    status,
                    'أنت مسجّل بحساب عميل. سجّل الخروج من لوحة العميل أو استخدم raddad@raddad.sa هنا.',
                    'error'
                );
            }
            return;
        }

        if (loginPanel) loginPanel.hidden = true;
        if (dashboard) dashboard.hidden = false;
        if (welcome) {
            welcome.textContent = `مرحبًا، ${user.email}`;
        }
        if (status) {
            status.textContent = 'تم الدخول — جاري تحميل البيانات…';
            status.className = 'status-banner status-banner--ok';
        }

        stopIdleWatch = watchIdleSession(auth, {
            onTimeout: () => {
                window.location.replace('/admin.html?reason=timeout');
            },
        });

        void loadDashboard(db, true, status);
    }

    if (needsFirestoreLongPolling()) {
        const attachWhenIdle = () => {
            window.setTimeout(() => attachAuthListener(), 800);
        };
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(attachWhenIdle, { timeout: 3000 });
        } else {
            attachWhenIdle();
        }
    } else {
        attachAuthListener();
    }

    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(loginForm);
        const email = String(data.get('email') || '').trim().toLowerCase();
        const password = String(data.get('password') || '');

        if (!password) {
            notifyUser(loginForm, status, 'أدخل كلمة المرور.', 'error');
            return;
        }

        if (!isAdminEmail(email)) {
            notifyUser(
                loginForm,
                status,
                'هذا البريد غير مصرّح كأدمن. استخدم raddad@raddad.sa.',
                'error'
            );
            return;
        }

        setSubmitLoading(loginForm, true);
        if (status) {
            status.textContent = 'جاري التحقق من الحساب…';
            status.className = 'status-banner status-banner--ok';
        }

        try {
            attachAuthListener();
            await prepareAuthPersistence(auth);
            const cred = await withTimeout(
                signInWithEmailAndPassword(auth, email, password),
                AUTH_TIMEOUT_MS,
                'انتهت مهلة الاتصال. تحقق من الإنترنت أو أعد المحاولة.'
            );
            const signedEmail = cred.user?.email || email;
            if (!isAdminEmail(signedEmail)) {
                await signOut(auth);
                notifyUser(loginForm, status, 'هذا الحساب لا يملك صلاحية الأدمن.', 'error');
                return;
            }
            notifyUser(loginForm, status, 'تم الدخول بنجاح — جاري فتح اللوحة…', 'success');
        } catch (error) {
            const message =
                error && error.message && !error.code
                    ? error.message
                    : authErrorMessage(error);
            notifyUser(loginForm, status, message, 'error');
        } finally {
            setSubmitLoading(loginForm, false);
        }
    });

    const ticketsContainer = document.querySelector('[data-admin-tickets]');

    ticketsContainer?.addEventListener('click', async (event) => {
        const card = event.target.closest('[data-ticket-card]');
        if (!card || !auth.currentUser || !isAdminEmail(auth.currentUser.email)) {
            return;
        }
        const ticketId = card.getAttribute('data-ticket-card');
        if (!ticketId || !card.classList.contains('ticket-card--unread')) {
            return;
        }
        try {
            await markTicketSeenByAdmin(db, ticketId);
            card.classList.remove('ticket-card--unread');
            card.querySelector('[data-ticket-new-badge]')?.remove();
            const newStat = document.querySelector('[data-stats-new]');
            if (newStat) {
                const remaining = ticketsContainer.querySelectorAll('.ticket-card--unread').length;
                newStat.textContent = String(remaining);
            }
        } catch (error) {
            console.warn('markTicketSeenByAdmin', error);
        }
    });

    document.addEventListener('change', async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLSelectElement) || !target.matches('[data-ticket-status]')) {
            return;
        }

        const ticketId = target.getAttribute('data-id');
        if (!ticketId) return;

        try {
            await markTicketSeenByAdmin(db, ticketId);
            await updateTicketStatus(db, ticketId, target.value);
            await loadDashboard(db, true, status);
        } catch (error) {
            alert(error.message || 'تعذر تحديث حالة التذكرة.');
        }
    });

    document.addEventListener('submit', async (event) => {
        const form = event.target;
        if (!(form instanceof HTMLFormElement) || !form.matches('[data-ticket-reply]')) {
            return;
        }
        event.preventDefault();

        const user = auth.currentUser;
        if (!user || !isAdminEmail(user.email)) return;

        const ticketId = form.getAttribute('data-ticket-id');
        const text = String(new FormData(form).get('reply') || '').trim();
        if (!ticketId || !text) {
            showFormMessage(form, 'اكتب نص الرد.', 'error');
            return;
        }

        try {
            await markTicketSeenByAdmin(db, ticketId);
            await addTicketMessage(db, ticketId, user, text, 'admin');
            const ticketCard = form.closest('[data-ticket-card]');
            const publicId =
                ticketCard?.querySelector('.ticket-id')?.textContent?.replace('#', '') || ticketId;
            const statusSelect = form.closest('[data-ticket-card]')?.querySelector('[data-ticket-status]');
            if (statusSelect && statusSelect.value !== 'closed') {
                await updateTicketStatus(db, ticketId, 'in_progress');
            }
            await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    _captcha: 'false',
                    _template: 'table',
                    _subject: `رد على التذكرة ${publicId}`,
                    type: 'ticket_reply',
                    ticket_id: publicId,
                    to_client: 'yes',
                    message: text,
                }),
            }).catch(() => {});
            form.reset();
            showFormMessage(form, 'تم إرسال الرد للعميل على نفس التذكرة.', 'success');
            await loadDashboard(db, true, status);
        } catch (error) {
            showFormMessage(form, error.message || 'تعذر إرسال الرد.', 'error');
        }
    });

    logoutBtn?.addEventListener('click', async () => {
        await signOut(auth);
        window.location.reload();
    });
}

boot();
