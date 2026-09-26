(function () {
    const STORAGE_USERS = 'raddad_clients_v1';
    const STORAGE_TICKETS = 'raddad_tickets_v1';
    const STORAGE_SESSION = 'raddad_session_v1';
    const FORM_ENDPOINT = 'https://formsubmit.co/ajax/raddad@raddad.sa';

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function generateAccessCode() {
        const part = () => Math.random().toString(36).replace(/[^a-z0-9]/g, '').slice(0, 4);
        return (part() + part()).toUpperCase();
    }

    function getSession() {
        return readJson(STORAGE_SESSION, null);
    }

    function setSession(user) {
        writeJson(STORAGE_SESSION, user);
    }

    function clearSession() {
        localStorage.removeItem(STORAGE_SESSION);
    }

    function getUsers() {
        return readJson(STORAGE_USERS, []);
    }

    function saveUser(user) {
        const users = getUsers().filter((u) => u.email !== user.email);
        users.push(user);
        writeJson(STORAGE_USERS, users);
    }

    function findUser(email) {
        return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
    }

    function getTickets(email) {
        const all = readJson(STORAGE_TICKETS, []);
        return all.filter((t) => t.email.toLowerCase() === email.toLowerCase());
    }

    function saveTicket(ticket) {
        const all = readJson(STORAGE_TICKETS, []);
        all.unshift(ticket);
        writeJson(STORAGE_TICKETS, all);
    }

    async function sendToInbox(payload) {
        const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                _captcha: 'false',
                _template: 'table',
                ...payload,
            }),
        });

        if (!response.ok) {
            throw new Error('تعذر إرسال الطلب. حاول مرة أخرى.');
        }

        return response.json();
    }

    function showFormMessage(form, message, type) {
        const box = form.querySelector('.form-message');
        if (!box) return;
        box.textContent = message;
        box.className = 'form-message ' + (type || 'info');
        box.hidden = false;
    }

    function setupNav() {
        const toggle = document.querySelector('.nav-toggle');
        const panel = document.querySelector('.nav-panel');
        if (!toggle || !panel) return;

        toggle.addEventListener('click', () => {
            const open = panel.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        panel.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', () => {
                panel.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function setupTabs(root) {
        const tabs = root.querySelectorAll('[data-tab-target]');
        const panels = root.querySelectorAll('[data-tab-panel]');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const id = tab.getAttribute('data-tab-target');
                tabs.forEach((t) => {
                    t.classList.toggle('is-active', t === tab);
                    t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
                });
                panels.forEach((panel) => {
                    panel.classList.toggle('is-active', panel.id === id);
                });
            });
        });
    }

    function renderPortalState() {
        const session = getSession();
        const welcome = document.querySelector('[data-portal-welcome]');
        const logoutBtn = document.querySelector('[data-portal-logout]');
        const ticketEmail = document.querySelector('#ticket-email');
        const ticketsList = document.querySelector('[data-tickets-list]');

        if (session && welcome) {
            welcome.hidden = false;
            welcome.textContent = `مرحبًا ${session.name} — بريدك: ${session.email}`;
        } else if (welcome) {
            welcome.hidden = true;
        }

        if (logoutBtn) {
            logoutBtn.hidden = !session;
        }

        if (ticketEmail && session) {
            ticketEmail.value = session.email;
            ticketEmail.readOnly = true;
        } else if (ticketEmail) {
            ticketEmail.readOnly = false;
        }

        if (ticketsList) {
            if (!session) {
                ticketsList.innerHTML = '<p class="muted">سجّل الدخول لعرض تذاكرك المحفوظة على هذا الجهاز.</p>';
                return;
            }

            const tickets = getTickets(session.email);
            if (!tickets.length) {
                ticketsList.innerHTML = '<p class="muted">لا توجد تذاكر بعد. افتح تذكرة جديدة من التبويب المجاور.</p>';
                return;
            }

            ticketsList.innerHTML = tickets
                .map(
                    (t) => `
                <article class="ticket-card">
                    <div class="ticket-card__head">
                        <strong>${escapeHtml(t.title)}</strong>
                        <span class="ticket-pill ticket-pill--${escapeHtml(t.priority)}">${priorityLabel(t.priority)}</span>
                    </div>
                    <p>${escapeHtml(t.body)}</p>
                    <footer><span>#${escapeHtml(t.id)}</span><time>${escapeHtml(t.createdAt)}</time></footer>
                </article>`
                )
                .join('');
        }
    }

    function priorityLabel(value) {
        if (value === 'high') return 'عاجل';
        if (value === 'low') return 'منخفض';
        return 'عادي';
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function setupRegisterForm() {
        const form = document.getElementById('register-form');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const name = String(data.get('name') || '').trim();
            const email = String(data.get('email') || '').trim();
            const phone = String(data.get('phone') || '').trim();
            const company = String(data.get('company') || '').trim();

            if (!name || !email || !phone) {
                showFormMessage(form, 'يرجى تعبئة الاسم والبريد والجوال.', 'error');
                return;
            }

            const accessCode = generateAccessCode();
            const user = {
                name,
                email,
                phone,
                company,
                accessCode,
                createdAt: new Date().toISOString(),
            };

            try {
                await sendToInbox({
                    _subject: 'تسجيل عميل جديد — raddad.sa',
                    type: 'register',
                    name,
                    email,
                    phone,
                    company,
                    access_code: accessCode,
                });
                saveUser(user);
                setSession({ name, email });
                showFormMessage(
                    form,
                    `تم التسجيل بنجاح. رمز الدخول الخاص بك: ${accessCode} (احفظه لاستخدام بوابة العملاء).`,
                    'success'
                );
                form.reset();
                renderPortalState();
            } catch (error) {
                showFormMessage(form, error.message || 'حدث خطأ غير متوقع.', 'error');
            }
        });
    }

    function setupLoginForm() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const email = String(data.get('email') || '').trim();
            const code = String(data.get('access_code') || '').trim().toUpperCase();
            const user = findUser(email);

            if (!user || user.accessCode !== code) {
                showFormMessage(form, 'بيانات الدخول غير صحيحة. تأكد من البريد ورمز الدخول.', 'error');
                return;
            }

            setSession({ name: user.name, email: user.email });
            showFormMessage(form, 'تم تسجيل الدخول بنجاح.', 'success');
            form.reset();
            renderPortalState();
        });
    }

    function setupTicketForm() {
        const form = document.getElementById('ticket-form');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const session = getSession();
            const data = new FormData(form);
            const email = String(data.get('email') || session?.email || '').trim();
            const title = String(data.get('title') || '').trim();
            const body = String(data.get('body') || '').trim();
            const priority = String(data.get('priority') || 'normal');

            if (!email || !title || !body) {
                showFormMessage(form, 'يرجى تعبئة البريد وعنوان التذكرة والتفاصيل.', 'error');
                return;
            }

            const user = findUser(email);
            if (!user) {
                showFormMessage(form, 'هذا البريد غير مسجل. أنشئ حسابًا أولًا من تبويب التسجيل.', 'error');
                return;
            }

            const ticket = {
                id: 'TK-' + Date.now().toString(36).toUpperCase(),
                email,
                title,
                body,
                priority,
                createdAt: new Date().toLocaleString('ar-KW'),
            };

            try {
                await sendToInbox({
                    _subject: `تذكرة دعم جديدة — ${ticket.id}`,
                    type: 'ticket',
                    ticket_id: ticket.id,
                    email,
                    title,
                    body,
                    priority,
                });
                saveTicket(ticket);
                showFormMessage(form, `تم فتح التذكرة ${ticket.id} وإرسالها بنجاح.`, 'success');
                form.reset();
                renderPortalState();
            } catch (error) {
                showFormMessage(form, error.message || 'حدث خطأ غير متوقع.', 'error');
            }
        });
    }

    function setupIdeaForm() {
        const form = document.getElementById('idea-form');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const payload = {
                _subject: 'طلب تسجيل فكرة تطبيق جديدة',
                type: 'idea',
                name: String(data.get('name') || '').trim(),
                email: String(data.get('email') || '').trim(),
                phone: String(data.get('phone') || '').trim(),
                app_name: String(data.get('app_name') || '').trim(),
                platform: String(data.get('platform') || '').trim(),
                budget: String(data.get('budget') || '').trim(),
                timeline: String(data.get('timeline') || '').trim(),
                description: String(data.get('description') || '').trim(),
            };

            if (!payload.name || !payload.email || !payload.description) {
                showFormMessage(form, 'يرجى تعبئة الحقول الأساسية على الأقل.', 'error');
                return;
            }

            try {
                await sendToInbox(payload);
                showFormMessage(form, 'تم إرسال فكرتك بنجاح. سأتواصل معك قريبًا.', 'success');
                form.reset();
            } catch (error) {
                showFormMessage(form, error.message || 'حدث خطأ غير متوقع.', 'error');
            }
        });
    }

    function setupLogout() {
        const btn = document.querySelector('[data-portal-logout]');
        if (!btn) return;
        btn.addEventListener('click', () => {
            clearSession();
            renderPortalState();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupNav();
        document.querySelectorAll('[data-tabs]').forEach(setupTabs);
        setupRegisterForm();
        setupLoginForm();
        setupTicketForm();
        setupIdeaForm();
        setupLogout();
        renderPortalState();
    });
})();
