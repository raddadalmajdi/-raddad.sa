import { signOut } from 'firebase/auth';

/** مدة الخمول قبل تسجيل الخروج التلقائي (10 دقائق) */
export const SESSION_IDLE_MS = 10 * 60 * 1000;

export function watchIdleSession(auth, options = {}) {
    const idleMs = options.idleMs ?? SESSION_IDLE_MS;
    const onTimeout = options.onTimeout;

    let timerId = null;

    const clear = () => {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
    };

    const schedule = () => {
        clear();
        if (!auth.currentUser) return;
        timerId = window.setTimeout(async () => {
            if (!auth.currentUser) return;
            try {
                await signOut(auth);
            } catch (error) {
                console.warn('idle signOut', error);
            }
            onTimeout?.();
        }, idleMs);
    };

    const onActivity = () => schedule();

    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((name) => {
        window.addEventListener(name, onActivity, { passive: true });
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            onActivity();
        }
    });

    schedule();

    return () => {
        clear();
        events.forEach((name) => {
            window.removeEventListener(name, onActivity);
        });
    };
}
