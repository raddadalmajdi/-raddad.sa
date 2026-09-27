import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { initFirebase, isAdminEmail, prepareAuthPersistence } from './firebase/init.js';
import { authErrorMessage, showFormMessage } from './shared/ui.js';
import { SESSION_IDLE_MS } from './shared/sessionIdle.js';

function setupTabs(root) {
    const tabs = root.querySelectorAll('[data-tab-target]');
    const panels = root.querySelectorAll('[data-tab-panel]');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const id = tab.getAttribute('data-tab-target');
            tabs.forEach((item) => {
                item.classList.toggle('is-active', item === tab);
            });
            panels.forEach((panel) => {
                panel.classList.toggle('is-active', panel.id === id);
            });
        });
    });
}

function redirectAfterLogin(email) {
    const normalized = String(email || '').trim().toLowerCase();
    if (isAdminEmail(normalized)) {
        window.location.replace('/admin.html');
        return;
    }
    window.location.replace('/client.html');
}

function showTimeoutNotice(status) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reason') !== 'timeout' || !status) return;
    status.textContent =
        'انتهت جلستك لعدم النشاط (10 دقائق). سجّل الدخول مرة أخرى للمتابعة.';
    status.className = 'status-banner status-banner--warn';
}

async function boot() {
    const firebase = initFirebase();
    const status = document.querySelector('[data-config-status]');

    if (!firebase) {
        if (status) {
            status.textContent = 'يرجى إعداد js/firebase-config.js قبل استخدام تسجيل الدخول.';
            status.className = 'status-banner status-banner--warn';
        }
        return;
    }

    try {
        await prepareAuthPersistence(firebase.auth);
    } catch (error) {
        console.warn('Auth persistence', error);
    }

    showTimeoutNotice(status);

    const { auth, db } = firebase;
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const forgotForm = document.getElementById('forgot-form');
    const forgotToggle = document.querySelector('[data-forgot-toggle]');
    const forgotPanel = document.querySelector('[data-forgot-panel]');

    if (status && !new URLSearchParams(window.location.search).get('reason')) {
        status.textContent =
            'سجّل الدخول أو أنشئ حسابًا للوصول إلى تذاكر الدعم. الجلسة تنتهي تلقائيًا بعد 10 دقائق بدون نشاط.';
        status.className = 'status-banner status-banner--ok';
    }

    forgotToggle?.addEventListener('click', () => {
        if (!forgotPanel) return;
        const open = forgotPanel.hidden;
        forgotPanel.hidden = !open;
        forgotToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    forgotForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(forgotForm);
        const email = String(data.get('email') || '').trim().toLowerCase();
        if (!email) {
            showFormMessage(forgotForm, 'أدخل بريدك الإلكتروني.', 'error');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            showFormMessage(
                forgotForm,
                'أُرسل رابط إعادة تعيين كلمة المرور إلى بريدك. راجع البريد الوارد أو الرسائل غير المرغوبة.',
                'success'
            );
        } catch (error) {
            showFormMessage(forgotForm, authErrorMessage(error), 'error');
        }
    });

    registerForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(registerForm);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const phone = String(data.get('phone') || '').trim();
        const company = String(data.get('company') || '').trim();
        const password = String(data.get('password') || '');

        if (!name || !email || !phone || !password) {
            showFormMessage(registerForm, 'يرجى تعبئة الحقول المطلوبة.', 'error');
            return;
        }

        if (isAdminEmail(email)) {
            showFormMessage(
                registerForm,
                'بريد الأدمن مخصّص للوحة الإدارة. استخدم بريد عميل آخر للتسجيل.',
                'error'
            );
            return;
        }

        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: name });
            await setDoc(doc(db, 'clients', cred.user.uid), {
                name,
                email,
                phone,
                company,
                createdAt: serverTimestamp(),
            });
            showFormMessage(registerForm, 'تم إنشاء الحساب بنجاح. جارٍ تحويلك...', 'success');
            redirectAfterLogin(email);
        } catch (error) {
            showFormMessage(registerForm, authErrorMessage(error), 'error');
        }
    });

    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(loginForm);
        const email = String(data.get('email') || '').trim();
        const password = String(data.get('password') || '');

        if (!email || !password) {
            showFormMessage(loginForm, 'يرجى إدخال البريد وكلمة المرور.', 'error');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            showFormMessage(loginForm, 'تم تسجيل الدخول. جارٍ تحويلك...', 'success');
            redirectAfterLogin(email);
        } catch (error) {
            showFormMessage(loginForm, authErrorMessage(error), 'error');
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (!user) return;
        redirectAfterLogin(user.email);
    });

    document.querySelectorAll('[data-tabs]').forEach(setupTabs);

    // إعلام المستخدم بمدة الجلسة (للتوثيق في الواجهة)
    const idleNote = document.querySelector('[data-session-idle-note]');
    if (idleNote) {
        idleNote.textContent = `مدة الجلسة: ${SESSION_IDLE_MS / 60000} دقائق بدون نشاط ثم يُطلب الدخول مجددًا.`;
    }
}

boot().catch(console.error);
