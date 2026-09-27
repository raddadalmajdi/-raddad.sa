function normalizePath(pathname) {
    if (!pathname || pathname === '/index.html') {
        return '/';
    }
    const trimmed = pathname.replace(/\/index\.html$/, '');
    if (trimmed === '') {
        return '/';
    }
    return trimmed.endsWith('/') ? trimmed : trimmed;
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const panel = document.querySelector('.nav-panel');
    if (!toggle || !panel) return;

    const closeMenu = () => {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', (event) => {
        event.preventDefault();
        const open = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
        if (!panel.classList.contains('is-open')) return;
        const target = event.target;
        if (target instanceof Node && !panel.contains(target) && !toggle.contains(target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    const currentPath = normalizePath(window.location.pathname);

    panel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);

        let linkPath = '/';
        try {
            linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
        } catch {
            linkPath = normalizePath(link.getAttribute('href') || '/');
        }

        if (linkPath === currentPath) {
            link.classList.add('is-active');
        }
    });
});
