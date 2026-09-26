document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const panel = document.querySelector('.nav-panel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
        const open = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    panel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            panel.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });

        const path = window.location.pathname.replace(/\/index\.html$/, '/') || '/';
        const linkPath = link.pathname.replace(/\/index\.html$/, '/') || '/';
        if (linkPath === path) {
            link.classList.add('is-active');
        }
    });
});
