(function loadAssistant() {
    if (document.querySelector('script[data-raddad-assistant]')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/js/assistant.bundle.js';
    script.dataset.raddadAssistant = '1';
    document.body.appendChild(script);
})();
