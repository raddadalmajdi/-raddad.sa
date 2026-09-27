import { onAuthStateChanged } from 'firebase/auth';
import { initFirebase, isAdminEmail } from './firebase/init.js';

function updateNavAuthLink(user) {
    const link = document.querySelector('[data-nav-auth]');
    if (!link) return;

    if (!user) {
        link.href = '/login.html';
        link.textContent = 'تسجيل الدخول';
        link.removeAttribute('aria-current');
        return;
    }

    if (isAdminEmail(user.email)) {
        link.href = '/admin.html';
        link.textContent = 'لوحة الأدمن';
        return;
    }

    link.href = '/client.html';
    link.textContent = 'حسابي';
}

function boot() {
    const firebase = initFirebase();
    if (!firebase) return;

    onAuthStateChanged(firebase.auth, (user) => {
        updateNavAuthLink(user);
    });
}

boot().catch(console.error);
