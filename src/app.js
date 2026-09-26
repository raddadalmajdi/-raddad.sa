import { initFirebase } from './firebase/init.js';
import { createIdea } from './shared/ideas.js';
import { showFormMessage } from './shared/ui.js';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/raddad@raddad.sa';

async function notifyInbox(payload) {
    const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _captcha: 'false', _template: 'table', ...payload }),
    });
    if (!response.ok) {
        throw new Error('تعذر إرسال الطلب.');
    }
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

function setupIdeaForm(firebase) {
    const form = document.getElementById('idea-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const payload = {
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
            showFormMessage(form, 'يرجى تعبئة الحقول الأساسية.', 'error');
            return;
        }

        try {
            if (firebase?.db) {
                await createIdea(firebase.db, payload);
            }
            await notifyInbox({
                _subject: 'طلب تسجيل فكرة تطبيق جديدة',
                type: 'idea',
                ...payload,
            });
            showFormMessage(form, 'تم إرسال فكرتك بنجاح. سأتواصل معك قريبًا.', 'success');
            form.reset();
        } catch (error) {
            showFormMessage(form, error.message || 'حدث خطأ غير متوقع.', 'error');
        }
    });
}

function setFirebaseStatus(enabled) {
    const el = document.querySelector('[data-firebase-status]');
    if (!el) return;
    if (enabled) {
        el.textContent = 'المنصة متصلة بـ Firebase.';
        el.className = 'firebase-status firebase-status--on';
    } else {
        el.textContent = 'فعّل js/firebase-config.js لتشغيل التسجيل والتذاكر عبر Firebase.';
        el.className = 'firebase-status firebase-status--off';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const firebase = initFirebase();
    setFirebaseStatus(Boolean(firebase));
    setupNav();
    setupIdeaForm(firebase);
});
