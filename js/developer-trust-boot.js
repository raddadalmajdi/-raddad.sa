/**
 * شارات المطور الرسمية + وثيقة العمل الحر — شريط مربّع منفصل عن trust-bar.
 */
(function bootDeveloperTrust() {
    const code = (window.siteBusiness && window.siteBusiness.freelanceCode) || 'FL-629703910';

    const devPrograms = [
        {
            img: '/assets/badges/apple-developer-icon.png',
            ar: 'مطور معتمد في أبل',
            en: 'Apple Developer',
            mod: 'dev-badge--apple',
        },
        {
            img: '/assets/badges/google-play-developer-icon.png',
            ar: 'مطور معتمد في جوجل',
            en: 'Google Play Developer',
            mod: 'dev-badge--google',
        },
        {
            img: '/assets/badges/huawei-developer-icon.png',
            ar: 'مطور معتمد في هواوي',
            en: 'Huawei Developer',
            mod: 'dev-badge--huawei',
        },
    ];

    function labelText(entry) {
        const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
        return lang === 'en' ? entry.en : entry.ar;
    }

    function badgeItem(entry, compact) {
        const icon = compact ? 40 : 48;
        return (
            '<article class="dev-badge ' +
            entry.mod +
            '">' +
            `<img class="dev-badge__icon" src="${entry.img}" alt="" width="${icon}" height="${icon}" loading="lazy" decoding="async">` +
            `<p class="dev-badge__label" data-i18n-dev="${entry.en}">${labelText(entry)}</p>` +
            '</article>'
        );
    }

    function freelanceBadge(compact) {
        const icon = compact ? 40 : 48;
        return (
            '<article class="dev-badge dev-badge--freelance">' +
            `<span class="dev-badge__icon dev-badge__icon--fl" style="width:${icon}px;height:${icon}px">` +
            '<img src="/assets/freelance-work-logo.png" srcset="/assets/freelance-work-logo@2x.png 2x" alt="" loading="lazy" decoding="async">' +
            '</span>' +
            `<p class="dev-badge__label"><span data-i18n-dev="Freelance license">` +
            (document.documentElement.lang === 'en' ? 'Freelance license' : 'وثيقة عمل حر') +
            `</span> · <span class="verify-code">${code}</span></p>` +
            '</article>'
        );
    }

    function storesRowHtml(compact) {
        return (
            '<div class="dev-badge-strip dev-badge-strip--hero-stores" aria-label="حسابات المطور المعتمدة">' +
            devPrograms
                .map(function (e) {
                    return badgeItem(e, compact);
                })
                .join('') +
            '</div>'
        );
    }

    function stripHtml(compact) {
        return (
            '<div class="dev-badge-strip dev-badge-strip--footer" aria-label="شارات المطور المعتمد">' +
            freelanceBadge(compact) +
            storesRowHtml(compact) +
            '</div>'
        );
    }

    function trustCard(entry) {
        return (
            '<li class="trust-card trust-card--dev">' +
            `<img class="trust-card__icon dev-badge__icon trust-card__icon--store" src="${entry.img}" alt="" width="56" height="56" loading="lazy" decoding="async">` +
            `<h3 data-i18n-dev="${entry.en}">${labelText(entry)}</h3>` +
            `<p class="muted">` +
            (document.documentElement.lang === 'en'
                ? 'Certified developer account on this store.'
                : 'حساب مطور معتمد على المتجر.') +
            '</p></li>'
        );
    }

    function freelanceRowHtml() {
        return (
            '<p class="activity-badge dev-hero-fl dev-hero-fl--inline">' +
            '<img class="freelance-logo freelance-logo--chip" src="/assets/freelance-work-logo.png" srcset="/assets/freelance-work-logo@2x.png 2x" alt="" width="161" height="71" loading="lazy" decoding="async">' +
            `<span>وثيقة عمل حر · <span class="verify-code">${code}</span></span>` +
            '</p>'
        );
    }

    function platformTrustInner(compact) {
        return (
            '<div class="dev-hero-trust-block dev-hero-trust-block--platform">' +
            freelanceRowHtml() +
            storesRowHtml(compact) +
            '</div>'
        );
    }

    document.querySelectorAll('.site-footer').forEach(function (footer) {
        if (footer.dataset.devTrustFooter === '1' || footer.querySelector('.dev-trust-footer-pack')) return;
        footer.dataset.devTrustFooter = '1';
        var bar = footer.querySelector('.trust-bar');
        footer.querySelectorAll('.trust-bar__chip--dev').forEach(function (el) {
            el.remove();
        });
        var div = document.createElement('div');
        div.className = 'dev-trust-footer-pack';
        div.innerHTML = platformTrustInner(false);
        if (bar) footer.insertBefore(div, bar);
        else footer.insertBefore(div, footer.firstChild);
        footer.querySelectorAll('.trust-bar__chip--freelance, .trust-bar__chip:has(.freelance-logo)').forEach(function (el) {
            el.remove();
        });
    });

    var nav = document.querySelector('.site-nav');
    var homeTrust = document.querySelector('#hero-dev-trust, .hero-copy .dev-hero-trust-block');
    if (nav && !homeTrust && !document.querySelector('.platform-dev-trust')) {
        var shell = document.createElement('section');
        shell.className = 'platform-dev-trust';
        shell.setAttribute('aria-label', 'اعتماد المطور');
        var inner = document.createElement('div');
        inner.className = 'container platform-dev-trust__inner';
        inner.innerHTML = platformTrustInner(true);
        shell.appendChild(inner);
        nav.insertAdjacentElement('afterend', shell);
    }

    var payMain = document.querySelector('body.pay-simple .pay-simple__main, body.pay-checkout-body .pay-checkout-main');
    if (payMain && !payMain.querySelector('.dev-trust-footer-pack')) {
        var payFoot = document.createElement('div');
        payFoot.className = 'dev-trust-footer-pack pay-simple__trust';
        payFoot.innerHTML = platformTrustInner(true);
        payMain.appendChild(payFoot);
    }

    document.querySelectorAll('.trust-section .trust-grid').forEach(function (grid) {
        if (grid.dataset.devTrustCards === '1') return;
        grid.dataset.devTrustCards = '1';
        grid.querySelectorAll('.trust-card--dev').forEach(function (card) {
            const h3 = card.querySelector('h3');
            const hit = devPrograms.find(function (p) {
                return h3 && (h3.textContent || '').indexOf(p.ar.slice(0, 6)) >= 0;
            });
            const img = card.querySelector('img');
            if (hit && img) img.src = hit.img;
        });
        if (!grid.querySelector('.trust-card--dev')) {
            grid.insertAdjacentHTML('beforeend', devPrograms.map(trustCard).join(''));
        }
    });

    var heroStores = document.querySelector('[data-hero-dev-stores]');
    if (heroStores && !heroStores.children.length) {
        heroStores.innerHTML = devPrograms
            .map(function (e) {
                return badgeItem(e, true);
            })
            .join('');
    } else if (!heroStores) {
        var activity = document.querySelector('.hero-copy .activity-badge');
        if (activity && !activity.closest('.dev-hero-trust-block')) {
            var block = document.createElement('div');
            block.className = 'dev-hero-trust-block';
            activity.parentNode.insertBefore(block, activity);
            block.appendChild(activity);
            var storesDiv = document.createElement('div');
            storesDiv.innerHTML = storesRowHtml(true);
            block.appendChild(storesDiv.firstElementChild);
        }
    }

    document.addEventListener('langchange', function () {
        document.querySelectorAll('[data-i18n-dev]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-dev');
            var lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
            if (key === 'Freelance license') {
                el.textContent = lang === 'en' ? 'Freelance license' : 'وثيقة عمل حر';
                return;
            }
            var hit = devPrograms.find(function (p) {
                return p.en === key;
            });
            if (hit) el.textContent = lang === 'en' ? hit.en : hit.ar;
        });
    });
})();