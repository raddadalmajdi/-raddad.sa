import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initFirebase, isAdminEmail } from './firebase/init.js';
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
    const firebase = initFirebase();
    const loginPanel = document.querySelector('[data-admin-login]');
    const dashboard = document.querySelector('[data-admin-dashboard]');
    const status = document.querySelector('[data-config-status]');
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.querySelector('[data-logout]');

    if (!firebase) {
        if (status) {
            status.textContent = 'Firebase غير مهيأ. راجع js/firebase-config.js';
            status.className = 'status-banner status-banner--warn';
        }
        return;
    }

    const { auth, db } = firebase;

    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(loginForm);
        const email = String(data.get('email') || '').trim();
        const password = String(data.get('password') || '');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (!isAdminEmail(email)) {
                await signOut(auth);
                showFormMessage(loginForm, 'هذا الحساب لا يملك صلاحية الأدمن.', 'error');
                return;
            }
            showFormMessage(loginForm, 'تم تسجيل الدخول.', 'success');
        } catch (error) {
            showFormMessage(loginForm, authErrorMessage(error), 'error');
        }
    });

    onAuthStateChanged(auth, async (user) => {
        const isAdmin = user && isAdminEmail(user.email);
        if (logoutBtn) {
            logoutBtn.hidden = !isAdmin;
        }

        if (!isAdmin) {
            loginPanel.hidden = false;
            dashboard.hidden = true;
            return;
        }

        loginPanel.hidden = true;
        dashboard.hidden = false;
        if (status) {
            status.textContent = `لوحة الأدمن — ${user.email}`;
            status.className = 'status-banner status-banner--ok';
        }

        await loadDashboard(db, true);
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
