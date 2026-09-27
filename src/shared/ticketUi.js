import { escapeHtml, formatDate, priorityLabel, statusLabel } from './ui.js';

function renderMessageList(messages, ticket) {
    const items = messages.length
        ? messages
        : ticket.body
          ? [
                {
                    text: ticket.body,
                    authorRole: 'client',
                    createdAt: ticket.createdAt,
                },
            ]
          : [];

    if (!items.length) {
        return '<p class="muted ticket-thread__empty">لا توجد رسائل بعد.</p>';
    }

    return items
        .map((message) => {
            const isAdmin = message.authorRole === 'admin';
            return `
        <div class="ticket-msg ${isAdmin ? 'ticket-msg--admin' : 'ticket-msg--client'}">
            <div class="ticket-msg__meta">
                <strong>${isAdmin ? 'الدعم · رداد' : 'أنت'}</strong>
                <time>${escapeHtml(formatDate(message.createdAt))}</time>
            </div>
            <p>${escapeHtml(message.text)}</p>
        </div>`;
        })
        .join('');
}

export function renderTicketCard(ticket, options = {}) {
    const { canManage = false, canReply = false, messages = [] } = options;
    const statusControl = canManage
        ? `<select data-ticket-status data-id="${escapeHtml(ticket.id)}" aria-label="حالة التذكرة">
            <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>مفتوحة</option>
            <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>قيد التنفيذ</option>
            <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>مغلقة</option>
           </select>`
        : `<span>${statusLabel(ticket.status)}</span>`;

    const replyBlock =
        canReply && ticket.status !== 'closed'
            ? `
        <form class="ticket-reply-form" data-ticket-reply data-ticket-id="${escapeHtml(ticket.id)}">
            <label class="sr-only" for="reply-${escapeHtml(ticket.id)}">رد على التذكرة ${escapeHtml(ticket.publicId || ticket.id)}</label>
            <textarea id="reply-${escapeHtml(ticket.id)}" name="reply" rows="3" placeholder="اكتب ردك هنا… (رقم التذكرة: ${escapeHtml(ticket.publicId || ticket.id)})" required></textarea>
            <button class="btn-secondary" type="submit">إرسال الرد</button>
            <p class="form-message" hidden></p>
        </form>`
            : ticket.status === 'closed'
              ? '<p class="muted ticket-thread__closed">التذكرة مغلقة — لا يمكن إضافة ردود جديدة.</p>'
              : '';

    return `
    <article class="ticket-card" data-ticket-card="${escapeHtml(ticket.id)}">
        <div class="ticket-card__head">
            <strong>${escapeHtml(ticket.title)}</strong>
            <span class="ticket-pill ticket-pill--${escapeHtml(ticket.priority)}">${priorityLabel(ticket.priority)}</span>
        </div>
        ${canManage ? `<p class="muted">${escapeHtml(ticket.email || '')}</p>` : ''}
        <footer class="ticket-card__meta">
            <span class="ticket-id">#${escapeHtml(ticket.publicId || ticket.id)}</span>
            ${statusControl}
            <time>${escapeHtml(formatDate(ticket.updatedAt || ticket.createdAt))}</time>
        </footer>
        <div class="ticket-thread">
            <p class="ticket-thread__title">المحادثة على التذكرة</p>
            ${renderMessageList(messages, ticket)}
        </div>
        ${replyBlock}
    </article>`;
}
