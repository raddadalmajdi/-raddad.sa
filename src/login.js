import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { initFirebase, isAdminEmail } from './firebase/init.js';
import { authErrorMessage, showFormMessage } from './shared/ui.js';

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
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next === 'admin' && isAdminEmail(email)) {
        window.location.href = '/admin.html';
        return;
    }
    window.location.href = '/client.html';
}

function boot() {
    const firebase = initFirebase();
    const status = document.querySelector('[data-config-status]');

    if (!firebase) {
        if (status) {
            status.textContent = 'يرجى إعداد js/firebase-config.js قبل استخدام تسجيل الدخول.';
            status.className = 'status-banner status-banner--warn';
        }
        return;
    }

    if (status) {
        status.textContent = 'متصل بـ Firebase.';
        status.className = 'status-banner status-banner--ok';
    }

    const { auth, db } = firebase;
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

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

    document.querySelectorAll('[data-tabs]').forEach(setupTabs);
}

boot();
