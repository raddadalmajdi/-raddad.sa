import { replyToMessage, welcomeMessage } from './shared/assistantEngine.js';

const STORAGE_KEY = 'raddad_assistant_open';

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
}

function renderMarkdownLite(text) {
    const safe = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const span = document.createElement('div');
    span.className = 'assistant-msg__text';
    span.innerHTML = safe;
    return span;
}

function renderLinks(links) {
    if (!links?.length) return null;
    const wrap = el('div', 'assistant-msg__links');
    for (const link of links) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.label;
        a.className = 'assistant-link-chip';
        if (link.external) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }
        wrap.appendChild(a);
    }
    return wrap;
}

function appendMessage(log, { role, text, links }) {
    const row = el('div', `assistant-msg assistant-msg--${role}`);
    row.appendChild(renderMarkdownLite(text));
    const linkRow = renderLinks(links);
    if (linkRow) row.appendChild(linkRow);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
}

function quickReplies(container, onPick) {
    const items = [
        'الأسعار والدفع',
        'دعوة زواج بني غانم',
        'اشتراك إيصالك',
        'طلب مشروع',
        'تواصل',
    ];
    container.innerHTML = '';
    for (const label of items) {
        const btn = el('button', 'assistant-quick', label);
        btn.type = 'button';
        btn.addEventListener('click', () => onPick(label));
        container.appendChild(btn);
    }
}

function mountAssistant() {
    if (document.getElementById('raddad-assistant')) return;

    const root = el('div', 'assistant-root');
    root.id = 'raddad-assistant';

    const toggle = el('button', 'assistant-toggle');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'raddad-assistant-panel');
    toggle.innerHTML = '<span class="assistant-toggle__icon" aria-hidden="true">💬</span><span class="assistant-toggle__label">مساعد المنصة</span>';

    const panel = el('div', 'assistant-panel');
    panel.id = 'raddad-assistant-panel';
    panel.hidden = true;

    const head = el('header', 'assistant-panel__head');
    head.innerHTML =
        '<div><strong>مساعد raddad.sa</strong><p class="muted">إجابات سريعة · توجيه للصفحات المناسبة</p></div>';
    const closeBtn = el('button', 'assistant-close', '×');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'إغلاق');
    head.appendChild(closeBtn);

    const log = el('div', 'assistant-log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');

    const quick = el('div', 'assistant-quick-row');

    const form = el('form', 'assistant-form');
    const input = el('input', 'assistant-input');
    input.type = 'text';
    input.name = 'message';
    input.placeholder = 'اسأل عن الخدمة، السعر، أو الدفع…';
    input.autocomplete = 'off';
    input.maxLength = 500;
    const send = el('button', 'assistant-send', 'إرسال');
    send.type = 'submit';
    form.append(input, send);

    panel.append(head, log, quick, form);
    root.append(toggle, panel);
    document.body.appendChild(root);

    const welcome = welcomeMessage();
    appendMessage(log, { role: 'bot', text: welcome.text, links: welcome.links });

    function setOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        try {
            sessionStorage.setItem(STORAGE_KEY, open ? '1' : '0');
        } catch {
            /* ignore */
        }
        if (open) input.focus();
    }

    function ask(text) {
        const q = String(text).trim();
        if (!q) return;
        appendMessage(log, { role: 'user', text: q, links: [] });
        const answer = replyToMessage(q);
        appendMessage(log, { role: 'bot', text: answer.text, links: answer.links });
    }

    quickReplies(quick, ask);

    toggle.addEventListener('click', () => setOpen(panel.hidden));
    closeBtn.addEventListener('click', () => setOpen(false));

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = input.value;
        input.value = '';
        ask(value);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !panel.hidden) setOpen(false);
    });

    try {
        if (sessionStorage.getItem(STORAGE_KEY) === '1') setOpen(true);
    } catch {
        /* ignore */
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAssistant);
} else {
    mountAssistant();
}
