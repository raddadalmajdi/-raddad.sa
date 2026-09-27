const RIYADH_TZ = 'Asia/Riyadh';

/** فترة التسلسل: سنة-شهر بتوقيت الرياض (مثال: 2026-09) */
export function getTicketPeriod(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: RIYADH_TZ,
        year: 'numeric',
        month: '2-digit',
    }).formatToParts(date);
    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    if (!year || !month) {
        throw new Error('تعذر تحديد شهر التذكرة.');
    }
    return `${year}-${month}`;
}

/** رقم عام — سنوي وشهري: R-2026-09-0001 */
export function formatTicketPublicId(period, seq) {
    const match = String(period).match(/^(\d{4})-(\d{2})$/);
    if (!match) {
        throw new Error('فترة التذكرة غير صالحة.');
    }
    const n = Number(seq);
    if (!Number.isFinite(n) || n < 1 || n > 9999) {
        throw new Error('رقم التسلسل الشهري غير صالح.');
    }
    return `R-${match[1]}-${match[2]}-${String(Math.floor(n)).padStart(4, '0')}`;
}

export const TICKET_PUBLIC_ID_PATTERN = /^R-[0-9]{4}-[0-9]{2}-[0-9]{4}$/;
