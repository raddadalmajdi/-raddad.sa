(function bootSiteBusiness() {
    const b = window.siteBusiness;
    if (!b) return;

    document.querySelectorAll('.site-footer').forEach((footer) => {
        if (footer.querySelector('.site-footer__business')) return;
        const block = document.createElement('div');
        block.className = 'site-footer__business';
        block.setAttribute('aria-label', 'بيانات مقدم الخدمة');
        block.innerHTML = [
            `<p><strong>${b.legalNameAr}</strong> · ${b.tradeNameEn}</p>`,
            `<p>${b.activityAr} · رمز العمل الحر: <span class="verify-code">${b.freelanceCode}</span></p>`,
            `<p>${b.addressAr} · الرمز البريدي: ${b.postalCode}</p>`,
            `<p><a href="tel:${b.phoneE164}">${b.phoneDisplay}</a> · <a href="mailto:${b.email}">${b.email}</a></p>`,
        ].join('');
        const legal = footer.querySelector('.site-footer__legal');
        if (legal) footer.insertBefore(block, legal);
        else footer.appendChild(block);
    });

    document.querySelectorAll('[data-legal-name]').forEach((el) => {
        el.textContent = b.legalNameAr;
    });
})();
