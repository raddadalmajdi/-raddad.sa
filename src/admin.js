import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initFirebase, isAdminEmail, needsFirestoreLongPolling, prepareAuthPersistence } from './firebase/init.js';
import { fetchAllIdeas } from './shared/ideas.js';
import { fetchAllTickets, updateTicketStatus } from './shared/tickets.js';
import {
    authErrorMessage,
    escapeHtml,
    formatDate,
    priorityLabel,
    showFormMessage,
    statusLabel,
} from './shared/ui.js';

const AUTH_TIMEOUT_MS = 25000;

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
    if (!tickets.length) {
        container.innerHTML = '<p class="muted">لا توجد تذاكر.</p>';
        return;
    }

    container.innerHTML = tickets
        .map((ticket) => {
            const statusControl = canManage
                ? `<select data-ticket-status data-id="${escapeHtml(ticket.id)}" aria-label="حالة التذكرة">
                    <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>مفتوحة</option>
                    <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>قيد التنفيذ</option>
                    <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>مغلقة</option>
                   </select>`
                : `<span>${statusLabel(ticket.status)}</span>`;

            return `
            <article class="ticket-card">
                <div class="ticket-card__head">
                    <strong>${escapeHtml(ticket.title)}</strong>
                    <span class="ticket-pill ticket-pill--${escapeHtml(ticket.priority)}">${priorityLabel(ticket.priority)}</span>
                </div>
                <p class="muted">${escapeHtml(ticket.email || '')}</p>
                <p>${escapeHtml(ticket.body)}</p>
                <footer>
                    <span>#${escapeHtml(ticket.publicId || ticket.id)}</span>
                    ${statusControl}
                    <time>${escapeHtml(formatDate(ticket.createdAt))}</time>
                </footer>
            </article>`;
        })
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

async function loadDashboard(db, canManage) {
    const [tickets, ideas] = await Promise.all([fetchAllTickets(db), fetchAllIdeas(db)]);
    renderTickets(document.querySelector('[data-admin-tickets]'), tickets, canManage);
    renderIdeas(document.querySelector('[data-admin-ideas]'), ideas);

    document.querySelector('[data-stats-tickets]').textContent = String(tickets.length);
    document.querySelector('[data-stats-ideas]').textContent = String(ideas.length);
    document.querySelector('[data-stats-open]').textContent = String(
        tickets.filter((ticket) => ticket.status !== 'closed').length
    );
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

    if (status) {
        status.textContent = 'جاهز — أدخل كلمة المرور ثم اضغط دخول';
        status.className = 'status-banner status-banner--ok';
    }

    let authListenerAttached = false;

    const attachAuthListener = () => {
        if (authListenerAttached) return;
        authListenerAttached = true;

        onAuthStateChanged(auth, (user) => {
            try {
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

        loadDashboard(db, true)
            .then(() => {
                if (status) {
                    status.textContent = `لوحة الأدمن — ${user.email}`;
                    status.className = 'status-banner status-banner--ok';
                }
            })
            .catch((error) => {
                if (status) {
                    status.textContent =
                        'تم الدخول لكن تعذر تحميل البيانات. تأكد من Firestore ونطاق raddad.sa في Firebase.';
                    status.className = 'status-banner status-banner--warn';
                }
                console.error(error);
            });
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

    document.addEventListener('change', async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLSelectElement) || !target.matches('[data-ticket-status]')) {
            return;
        }

        const ticketId = target.getAttribute('data-id');
        if (!ticketId) return;

        try {
            await updateTicketStatus(db, ticketId, target.value);
            await loadDashboard(db, true);
        } catch (error) {
            alert(error.message || 'تعذر تحديث حالة التذكرة.');
        }
    });

    logoutBtn?.addEventListener('click', async () => {
        await signOut(auth);
        window.location.reload();
    });
}

boot();
