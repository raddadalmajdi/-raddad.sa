/* ────────────────────────────────────────────────────────────────
   raddad.sa — Bilingual i18n Engine  (AR / EN)
   Auto-detects device language. Saves preference to localStorage.
   Injects 🌐 AR|EN switcher into every page's nav automatically.
   ──────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── 1. Translations ────────────────────────────────────────── */
  var T = {
    ar: {
      /* Nav */
      'nav.toggle': 'القائمة',
      'nav.brand':  'رّداد · raddad.sa',
      /* Nav links – matched by href */
      'nav./':             'الرئيسية',
      'nav./services.html':'الخدمات',
      'nav./pricing.html': 'الأسعار والدفع',
      'nav./work.html':    'الأعمال',
      'nav./process.html': 'آلية العمل',
      'nav./request.html': 'طلب فكرة',
      'nav./login.html':   'تسجيل الدخول',
      'nav./admin.html':   'دخول الأدمن',
      'nav./contact.html': 'تواصل',
      /* Index – Hero */
      'hero.badge':    'متاح لمشاريع التطبيقات والحلول الرقمية',
      'hero.title':    'رّداد الماجدي',
      'hero.subtitle': 'مطور تطبيقات جوال ومبتكر حلول رقمية',
      'hero.fl':       'وثيقة عمل حر سارية · Certified Freelance License FL-629703910 · Ministry of HR, Saudi Arabia',
      'hero.activity': 'نشاط معتمد: تطوير برامج تطبيقات الجوال',
      'hero.lead':     'أحوّل الأفكار إلى منتجات جاهزة — من التصميم والتطوير إلى النشر والدعم عبر بوابة عملاء منظمة.',
      'hero.cta1':     'سجّل فكرة تطبيقك',
      'hero.cta2':     'الأسعار والدفع',
      /* Index – Quick grid */
      'quick.services.h': 'الخدمات',
      'quick.services.p': 'تطبيقات، منصات، Firebase، UI/UX، ونشر المتاجر.',
      'quick.work.h':     'الأعمال',
      'quick.work.p':     'مناسبات بني غانم، إيصالك، Eldres 🇺🇸، Eigo Media 🇯🇵.',
      'quick.process.h':  'آلية العمل',
      'quick.process.p':  'من تسجيل الفكرة إلى التسليم والتذاكر.',
      'quick.portal.h':   'بوابة العملاء',
      'quick.portal.p':   'تسجيل، دخول، ومتابعة الطلبات والتذاكر.',
      'quick.pay.h':      'دفع آمن',
      'quick.pay.p':      'مقدّم مشروع، استشارة، أو اشتراك شهري عبر بوابة معتمدة.',
      'quick.about.h':    'عن المنصة',
      'quick.about.p':    'هوية تجارية، عمل حر، وآلية العمل من الفكرة للدفع.',
      /* Index – Commerce banner */
      'commerce.p':    'منصة جاهزة للتجارة الإلكترونية: أسعار واضحة، سياسات منشورة، ودفع إلكتروني بعد عرض السعر.',
      'commerce.cta1': 'عرض الباقات',
      'commerce.cta2': 'الشروط والخصوصية',
      /* Index – Trust */
      'trust.eyebrow': 'ثقة وامتثال',
      'trust.heading': 'توثيق وامتثال',
      'trust.lead':    'وثيقة عمل حر سارية، وحماية للملكية الفكرية والنطاق وفق الأنظمة المعمول بها في المملكة.',
      /* Index – CTA section */
      'cta.h2':  'هل لديك فكرة تطبيق؟',
      'cta.p':   'أرسل التفاصيل من صفحة طلب الفكرة أو راسلني مباشرة.',
      'cta.btn1':'طلب فكرة',
      'cta.btn2':'تواصل',
      /* Footer */
      'footer.rights': '© 2026 raddad.sa — جميع الحقوق محفوظة',
      'footer.admin':  'الأدمن',
      /* Work page */
      'work.h1':   'أبرز الأعمال والمشاريع',
      'work.lead': 'عينات من تطبيقات ومنصات تم تنفيذها بتركيز على الأداء وتجربة المستخدم — مع توثيق ملكية فكرية لكل منتج معروض.',
      /* Projects */
      'proj.beni.tag':   'تطبيق جوال متكامل',
      'proj.beni.h3':    'تطبيق مناسبات بني غانم',
      'proj.beni.p':     'منصة رقمية لإدارة ومتابعة الفعاليات والمناسبات الاجتماعية، متاحة على متاجر التطبيقات.',
      'proj.beni.link':  'عرض على App Store ←',
      'proj.eysalk.tag':  'منصة رقمية ذكية',
      'proj.eysalk.h3':   'منصة إيصالك',
      'proj.eysalk.p':    'حل لأرشفة واسترجاع الفواتير الورقية برقم الجوال للمحلات والمتاجر الصغيرة.',
      'proj.eysalk.hint': 'لتجربة المنصة كاملة افتح الرابط أدناه.',
      'proj.eysalk.link': 'فتح eysalk.com ←',
      'proj.eldres.tag':  'دومين رعاية كبار السن · أمريكا',
      'proj.eldres.h3':   'Eldres — منصة رعاية المسنين',
      'proj.eldres.p':    'دومين إدارة دور رعاية المسنين في بوسطن، ماساتشوستس. عمره 25 سنة منذ 2001، تم تطويره بواسطة رّداد.',
      'proj.eldres.link': 'فتح eldres.com ←',
      'proj.eigo.tag':    'منصة تعليم إنجليزي · اليابان',
      'proj.eigo.h3':     'Eigo Media — تعليم الإنجليزية',
      'proj.eigo.p':      'منصة تعليم اللغة الإنجليزية لليابانيين — «Eigo» تعني «إنجليزي» بالياباني (英語). الدومين عمره 29 سنة منذ 1997.',
      'proj.eigo.link':   'فتح eigomedia.com ←',
      'proj.ip':          'ملكية فكرية مسجّلة · الهيئة السعودية للملكية الفكرية',
      /* Contact */
      'contact.h1':        'تواصل معنا',
      'contact.subtitle':  'عبر الواتساب، الإيميل، أو نموذج التواصل المباشر',
      'contact.form.name': 'الاسم الكريم',
      'contact.form.phone':'رقم الجوال',
      'contact.form.idea': 'فكرة مشروعك أو سؤالك',
      'contact.form.send': 'أرسل الرسالة',
      'contact.wa':        'واتساب',
      'contact.email':     'إيميل',
      'contact.phone':     'اتصال',
    },

    en: {
      /* Nav */
      'nav.toggle': 'Menu',
      'nav.brand':  'Raddad · raddad.sa',
      /* Nav links */
      'nav./':             'Home',
      'nav./services.html':'Services',
      'nav./pricing.html': 'Pricing',
      'nav./work.html':    'Portfolio',
      'nav./process.html': 'How It Works',
      'nav./request.html': 'Submit Idea',
      'nav./login.html':   'Client Login',
      'nav./admin.html':   'Admin',
      'nav./contact.html': 'Contact',
      /* Hero */
      'hero.badge':    'Available for App Projects & Digital Solutions',
      'hero.title':    'Raddad Al-Majdi',
      'hero.subtitle': 'Mobile App Developer & Digital Solutions Innovator',
      'hero.fl':       'Certified Freelance License FL-629703910 · Licensed by Ministry of HR, Saudi Arabia',
      'hero.activity': 'Certified Activity: Mobile App Development',
      'hero.lead':     'I turn ideas into ready products — from design & development to publishing & support via an organized client portal.',
      'hero.cta1':     'Submit Your App Idea',
      'hero.cta2':     'Pricing',
      /* Quick grid */
      'quick.services.h': 'Services',
      'quick.services.p': 'Apps, platforms, Firebase, UI/UX, and app store publishing.',
      'quick.work.h':     'Portfolio',
      'quick.work.p':     'Bani Alam Events, Eisalak, Eldres 🇺🇸, Eigo Media 🇯🇵.',
      'quick.process.h':  'How It Works',
      'quick.process.p':  'From idea submission to delivery and support tickets.',
      'quick.portal.h':   'Client Portal',
      'quick.portal.p':   'Register, login, and track your requests and tickets.',
      'quick.pay.h':      'Secure Payment',
      'quick.pay.p':      'Project deposit, consultation, or monthly subscription via certified gateway.',
      'quick.about.h':    'About',
      'quick.about.p':    'Business identity, freelance license, and workflow from idea to payment.',
      /* Commerce banner */
      'commerce.p':    'E-commerce ready platform: transparent pricing, published policies, and electronic payment after quotation.',
      'commerce.cta1': 'View Packages',
      'commerce.cta2': 'Terms & Privacy',
      /* Trust */
      'trust.eyebrow': 'Trust & Compliance',
      'trust.heading': 'Certification & Compliance',
      'trust.lead':    'Active freelance license, intellectual property protection, and domain rights under Saudi regulations.',
      /* CTA */
      'cta.h2':  'Have an App Idea?',
      'cta.p':   'Send details via the idea request page or contact me directly.',
      'cta.btn1':'Submit Idea',
      'cta.btn2':'Contact',
      /* Footer */
      'footer.rights': '© 2026 raddad.sa — All rights reserved',
      'footer.admin':  'Admin',
      /* Work page */
      'work.h1':   'Featured Projects',
      'work.lead': 'Samples of apps and platforms built with a focus on performance and user experience — all with intellectual property documentation.',
      /* Projects */
      'proj.beni.tag':   'Full Mobile App',
      'proj.beni.h3':    'Bani Alam Events App',
      'proj.beni.p':     'A digital platform for managing and tracking social events and gatherings, available on app stores.',
      'proj.beni.link':  'View on App Store ←',
      'proj.eysalk.tag':  'Smart Digital Platform',
      'proj.eysalk.h3':   'Eisalak Platform',
      'proj.eysalk.p':    'A solution for archiving and retrieving paper invoices by phone number for small shops and merchants.',
      'proj.eysalk.hint': 'Open the link below for the full platform experience.',
      'proj.eysalk.link': 'Open eysalk.com ←',
      'proj.eldres.tag':  'Senior Care Domain · USA',
      'proj.eldres.h3':   'Eldres — Senior Care Platform',
      'proj.eldres.p':    'Senior care management domain in Boston, Massachusetts. 25-year domain since 2001, developed by Raddad. 861 US referring sites.',
      'proj.eldres.link': 'Open eldres.com ←',
      'proj.eigo.tag':    'English Learning Platform · Japan',
      'proj.eigo.h3':     'Eigo Media — English Learning',
      'proj.eigo.p':      '"Eigo" (英語) means "English" in Japanese. English learning platform for Japanese speakers. 29-year domain since 1997. 647 Japanese backlinks.',
      'proj.eigo.link':   'Open eigomedia.com ←',
      'proj.ip':          'Registered IP · Saudi IP Authority (SAIP)',
      /* Contact */
      'contact.h1':        'Contact Us',
      'contact.subtitle':  'Via WhatsApp, email, or direct contact form',
      'contact.form.name': 'Your Name',
      'contact.form.phone':'Phone Number',
      'contact.form.idea': 'Your project idea or question',
      'contact.form.send': 'Send Message',
      'contact.wa':        'WhatsApp',
      'contact.email':     'Email',
      'contact.phone':     'Call',
    }
  };

  /* ── 2. Language detection ──────────────────────────────────── */
  function detectLang() {
    var saved = localStorage.getItem('raddad_lang');
    if (saved === 'ar' || saved === 'en') return saved;
    var param = new URLSearchParams(window.location.search).get('lang');
    if (param === 'ar' || param === 'en') {
      localStorage.setItem('raddad_lang', param);
      return param;
    }
    var nav = (navigator.language || 'ar').toLowerCase();
    return nav.startsWith('ar') ? 'ar' : 'en';
  }

  /* ── 3. Translate one element ───────────────────────────────── */
  function tx(key, lang) {
    return (T[lang] && T[lang][key]) || null;
  }

  /* ── 4. Apply language to page ──────────────────────────────── */
  function applyLang(lang) {
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    /* data-i18n → textContent */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = tx(el.getAttribute('data-i18n'), lang);
      if (v !== null) el.textContent = v;
    });

    /* data-i18n-html → innerHTML */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = tx(el.getAttribute('data-i18n-html'), lang);
      if (v !== null) el.innerHTML = v;
    });

    /* data-i18n-placeholder → placeholder attr */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = tx(el.getAttribute('data-i18n-placeholder'), lang);
      if (v !== null) el.setAttribute('placeholder', v);
    });

    /* Translate nav links by href */
    var panel = document.querySelector('.nav-panel');
    if (panel) {
      panel.querySelectorAll('a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        /* normalise: / or /foo.html */
        var key = 'nav.' + (href === '/' ? '/' : href.replace(/^https?:\/\/[^/]+/, ''));
        var v = tx(key, lang);
        /* only update text-only links (no child elements other than text) */
        if (v !== null && a.children.length === 0) {
          a.textContent = v;
        }
      });
    }

    /* Nav toggle button */
    var toggle = document.querySelector('.nav-toggle');
    if (toggle) { var vt = tx('nav.toggle', lang); if (vt) toggle.textContent = vt; }

    /* Nav brand span */
    var brandSpan = document.querySelector('.nav-brand > span');
    if (brandSpan) { var vb = tx('nav.brand', lang); if (vb) brandSpan.textContent = vb; }

    /* Lang switcher active state */
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('lang-btn--active', btn.dataset.lang === lang);
    });

    localStorage.setItem('raddad_lang', lang);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  /* ── 5. Inject 🌐 switcher into header ──────────────────────── */
  function injectSwitcher() {
    if (document.querySelector('.lang-switcher')) return;
    var inner = document.querySelector('.site-nav__inner');
    if (!inner) return;

    var sw = document.createElement('div');
    sw.className = 'lang-switcher';
    sw.setAttribute('role', 'group');
    sw.setAttribute('aria-label', 'Language / اللغة');
    sw.innerHTML =
      '<span class="lang-switcher__globe" aria-hidden="true">🌐</span>' +
      '<button class="lang-btn" data-lang="ar" type="button" aria-label="العربية">AR</button>' +
      '<button class="lang-btn" data-lang="en" type="button" aria-label="English">EN</button>';

    /* Insert between brand and toggle */
    var brand = inner.querySelector('.nav-brand');
    var ref = brand ? brand.nextSibling : null;
    inner.insertBefore(sw, ref);

    sw.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-btn');
      if (btn) applyLang(btn.dataset.lang);
    });
  }

  /* ── 6. Boot ────────────────────────────────────────────────── */
  window.__raddadI18n = { applyLang: applyLang, detectLang: detectLang, tx: tx };

  function boot() {
    injectSwitcher();
    applyLang(detectLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
