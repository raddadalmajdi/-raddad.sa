export function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function showFormMessage(form, message, type) {
    const box = form.querySelector('.form-message');
    if (!box) return;
    box.textContent = message;
    box.className = 'form-message ' + (type || 'info');
    box.hidden = false;
}

export function authErrorMessage(error) {
    const code = error && error.code ? error.code : '';
    const map = {
        'auth/email-already-in-use': 'هذا البريد مستخدم مسبقًا.',
        'auth/invalid-email': 'البريد الإلكتروني غير صالح.',
        'auth/weak-password': 'كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.',
        'auth/user-not-found': 'لا يوجد حساب بهذا البريد.',
        'auth/wrong-password': 'كلمة المرور غير صحيحة.',
        'auth/invalid-credential': 'بيانات الدخول غير صحيحة.',
    };
    return map[code] || error.message || 'حدث خطأ غير متوقع.';
}

export function formatDate(value) {
    if (!value) return '';
    if (typeof value.toDate === 'function') {
        return value.toDate().toLocaleString('ar-KW');
    }
    return String(value);
}

export function priorityLabel(value) {
    if (value === 'high') return 'عاجل';
    if (value === 'low') return 'منخفض';
    return 'عادي';
}

export function statusLabel(value) {
    if (value === 'in_progress') return 'قيد التنفيذ';
    if (value === 'closed') return 'مغلقة';
    return 'مفتوحة';
}
