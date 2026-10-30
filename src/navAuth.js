import { onAuthStateChanged } from 'firebase/auth';
import { initFirebase, isAdminEmail } from './firebase/init.js';

function updateNavAuthLink(user) {
    const link = document.querySelector('[data-nav-auth]');
    if (!link) return;

    if (!user) {
        link.href = '/login.html';
        link.textContent = 'تسجيل الدخول';
        link.removeAttribute('aria-current');
    } else if (isAdminEmail(user.email)) {
        link.href = '/admin.html';
        link.textContent = 'لوحة الأدمن';
    } else {
        link.href = '/client.html';
        link.textContent = 'حسابي';
    }

    const adminLink = document.querySelector('[data-nav-admin]');
    if (!adminLink) return;
    if (user && isAdminEmail(user.email)) {
        adminLink.href = '/admin.html';
        adminLink.textContent = 'لوحة الأدمن';
        adminLink.setAttribute('aria-current', 'page');
    } else {
        adminLink.href = '/admin.html';
        adminLink.textContent = 'دخول الأدمن';
        adminLink.removeAttribute('aria-current');
    }
}

function boot() {
    const firebase = initFirebase();
    if (!firebase) return;

    onAuthStateChanged(firebase.auth, (user) => {
        updateNavAuthLink(user);
    });
}

boot().catch(console.error);
