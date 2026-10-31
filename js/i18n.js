/* ═══════════════════════════════════════════════════════════════
   raddad.sa — Comprehensive Bilingual Engine (AR / EN)
   v2.0 — Full site coverage, no page reload on language switch.

   Works in two layers:
   1. data-i18n attributes  → key-based replacement
   2. CSS-selector scanner  → text-content matching per page
      Stores originals in data-ar so AR↔EN is fully reversible.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Normalise page path ──────────────────────────────────── */
  var PATH = (function () {
    var p = window.location.pathname.replace(/\/index\.html$/, '/');
    return p || '/';
  })();

  /* ══════════════════════════════════════════════════════════════
     1. TRANSLATIONS  (data-i18n key → text)
     ══════════════════════════════════════════════════════════════ */
  var T = {
    ar: {
      /* ── Nav ── */
      'nav.toggle':        'القائمة',
      'nav.brand':         'رّداد · raddad.sa',
      'nav./':             'الرئيسية',
      'nav./services.html':'الخدمات',
      'nav./pricing.html': 'الأسعار والدفع',
      'nav./work.html':    'الأعمال',
      'nav./process.html': 'آلية العمل',
      'nav./request.html': 'طلب فكرة',
      'nav./login.html':   'تسجيل الدخول',
      'nav./admin.html':   'دخول الأدمن',
      'nav./contact.html': 'تواصل',
      /* ── Hero (index) ── */
      'hero.badge':    'متاح لمشاريع التطبيقات والحلول الرقمية',
      'hero.title':    'رّداد الماجدي',
      'hero.subtitle': 'مطور تطبيقات جوال ومبتكر حلول رقمية',
      'hero.fl':       'وثيقة عمل حر سارية · Certified Freelance License FL-629703910 · Ministry of HR, Saudi Arabia',
      'hero.activity': 'نشاط معتمد: تطوير برامج تطبيقات الجوال',
      'hero.lead':     'أحوّل الأفكار إلى منتجات جاهزة — من التصميم والتطوير إلى النشر والدعم عبر بوابة عملاء منظمة.',
      'hero.cta1':     'سجّل فكرة تطبيقك',
      'hero.cta2':     'الأسعار والدفع',
      /* ── Quick grid ── */
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
      /* ── Commerce banner ── */
      'commerce.p':    'منصة جاهزة للتجارة الإلكترونية: أسعار واضحة، سياسات منشورة، ودفع إلكتروني بعد عرض السعر.',
      'commerce.cta1': 'عرض الباقات',
      'commerce.cta2': 'الشروط والخصوصية',
      /* ── Trust ── */
      'trust.eyebrow': 'ثقة وامتثال',
      'trust.heading': 'توثيق وامتثال',
      'trust.lead':    'وثيقة عمل حر سارية، وحماية للملكية الفكرية والنطاق وفق الأنظمة المعمول بها في المملكة.',
      /* ── CTA section ── */
      'cta.h2':  'هل لديك فكرة تطبيق؟',
      'cta.p':   'أرسل التفاصيل من صفحة طلب الفكرة أو راسلني مباشرة.',
      'cta.btn1':'طلب فكرة',
      'cta.btn2':'تواصل',
      /* ── Footer ── */
      'footer.rights': '© 2026 raddad.sa — جميع الحقوق محفوظة',
      'footer.admin':  'الأدمن',
      /* ── Work page ── */
      'work.h1':   'أبرز الأعمال والمشاريع',
      'work.lead': 'عينات من تطبيقات ومنصات تم تنفيذها بتركيز على الأداء وتجربة المستخدم — مع توثيق ملكية فكرية لكل منتج معروض.',
      /* ── Projects ── */
      'proj.beni.tag':    'تطبيق جوال متكامل',
      'proj.beni.h3':     'تطبيق مناسبات بني غانم',
      'proj.beni.p':      'منصة رقمية لإدارة ومتابعة الفعاليات والمناسبات الاجتماعية، متاحة على متاجر التطبيقات.',
      'proj.beni.link':   'عرض على App Store ←',
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
      /* ── Contact ── */
      'contact.h1':        'تواصل معنا',
      'contact.subtitle':  'عبر الواتساب، الإيميل، أو نموذج التواصل المباشر',
      'contact.form.name': 'الاسم الكريم *',
      'contact.form.phone':'رقم الجوال / واتساب *',
      'contact.form.idea': 'فكرة المشروع *',
      'contact.form.send': 'إرسال الفكرة ⟵',
      'contact.wa':        'واتساب مباشر',
    },

    en: {
      /* ── Nav ── */
      'nav.toggle':        'Menu',
      'nav.brand':         'Raddad · raddad.sa',
      'nav./':             'Home',
      'nav./services.html':'Services',
      'nav./pricing.html': 'Pricing',
      'nav./work.html':    'Portfolio',
      'nav./process.html': 'How It Works',
      'nav./request.html': 'Submit Idea',
      'nav./login.html':   'Client Login',
      'nav./admin.html':   'Admin',
      'nav./contact.html': 'Contact',
      /* ── Hero ── */
      'hero.badge':    'Available for App Projects & Digital Solutions',
      'hero.title':    'Raddad Al-Majdi',
      'hero.subtitle': 'Mobile App Developer & Digital Solutions Innovator',
      'hero.fl':       'Certified Freelance License — Valid · FL-629703910 · Licensed by Ministry of HR, Saudi Arabia',
      'hero.activity': 'Certified Activity: Mobile App Development',
      'hero.lead':     'I Transform Ideas Into Ready Products — From Design & Development to Publishing & Support Through an Organized Client Portal.',
      'hero.cta1':     'Submit Your App Idea',
      'hero.cta2':     'Pricing & Plans',
      /* ── Quick grid ── */
      'quick.services.h': 'Services',
      'quick.services.p': 'Apps, platforms, Firebase, UI/UX, and app store publishing.',
      'quick.work.h':     'Portfolio',
      'quick.work.p':     'Banighanim Events, Eisalak, Eldres 🇺🇸, Eigo Media 🇯🇵.',
      'quick.process.h':  'How It Works',
      'quick.process.p':  'From idea submission to delivery and support tickets.',
      'quick.portal.h':   'Client Portal',
      'quick.portal.p':   'Register, login, and track your project requests and tickets.',
      'quick.pay.h':      'Secure Payment',
      'quick.pay.p':      'Project deposit, consultation, or monthly subscription via certified gateway.',
      'quick.about.h':    'About',
      'quick.about.p':    'Business identity, freelance license, and workflow from idea to payment.',
      /* ── Commerce banner ── */
      'commerce.p':    'E-commerce-ready platform: transparent pricing, published policies, and electronic payment after quotation.',
      'commerce.cta1': 'View Packages',
      'commerce.cta2': 'Terms & Privacy',
      /* ── Trust ── */
      'trust.eyebrow': 'Trust & Compliance',
      'trust.heading': 'Certification & Compliance',
      'trust.lead':    'Active freelance license, intellectual property protection, and domain rights under Saudi regulations.',
      /* ── CTA section ── */
      'cta.h2':  'Have an App Idea?',
      'cta.p':   'Send details via the idea request page or contact me directly.',
      'cta.btn1':'Submit Idea',
      'cta.btn2':'Contact Us',
      /* ── Footer ── */
      'footer.rights': '© 2026 raddad.sa — All Rights Reserved',
      'footer.admin':  'Admin',
      /* ── Work page ── */
      'work.h1':   'Featured Projects & Portfolio',
      'work.lead': 'Samples of apps and platforms built with a focus on performance and user experience — all with intellectual property documentation.',
      /* ── Projects ── */
      'proj.beni.tag':    'Full Mobile App',
      'proj.beni.h3':     'Banighanim Events App',
      'proj.beni.p':      'A digital platform for managing and tracking social events and gatherings for the Banighanim tribe, available on app stores.',
      'proj.beni.link':   'View on App Store ←',
      'proj.eysalk.tag':  'Smart Digital Platform',
      'proj.eysalk.h3':   'Eisalak Platform',
      'proj.eysalk.p':    'Your Smart System for Managing Paper Invoices — archive and retrieve receipts by phone number for shops and merchants.',
      'proj.eysalk.hint': 'Open the link below for the full platform experience.',
      'proj.eysalk.link': 'Open eysalk.com ←',
      'proj.eldres.tag':  'Elderly Care Domain · USA',
      'proj.eldres.h3':   'Eldres — Elderly Care Platform',
      'proj.eldres.p':    'Elderly Care Facility Management in Boston, Massachusetts — 25 Years Old Since 2001. 861 US Referring Websites. Developed by Raddad.',
      'proj.eldres.link': 'Open eldres.com ←',
      'proj.eigo.tag':    'English Learning Platform · Japan',
      'proj.eigo.h3':     'Eigo Media — English Learning',
      'proj.eigo.p':      'English Learning Platform for Japanese — "Eigo" (英語) Means English. Domain Age 29 Years Since 1997. 647 Japanese Referring Websites. Developed by Raddad.',
      'proj.eigo.link':   'Open eigomedia.com ←',
      'proj.ip':          'Registered IP · Saudi Authority for Intellectual Property (SAIP)',
      /* ── Contact ── */
      'contact.h1':        'Contact Us',
      'contact.subtitle':  'Via WhatsApp, email, or direct contact form',
      'contact.form.name': 'Your Name *',
      'contact.form.phone':'Phone / WhatsApp *',
      'contact.form.idea': 'Your Project Idea *',
      'contact.form.send': 'Send Message →',
      'contact.wa':        'WhatsApp',
    }
  };

  /* ══════════════════════════════════════════════════════════════
     2. CSS-SELECTOR RULES  (per page + global)
     Each rule: { s: selector, a: Arabic text, e: English text }
     If a.trim() matches el.textContent.trim() → replace.
     Reversible: originals stored in data-ar attribute.
     ══════════════════════════════════════════════════════════════ */
  var RULES = {

    /* ── Global: applied to every page ─────────────────────── */
    GLOBAL: [
      /* Trust bar chips */
      { s: '.trust-bar__chip span',
        a: 'منتجات مسجّلة · الهيئة السعودية للملكية الفكرية',
        e: 'Registered Products · Saudi IP Authority (SAIP)' },
      { s: '.trust-bar__chip span',
        a: 'منصة raddad.sa · حقوق موثّقة',
        e: 'raddad.sa Platform · All Rights Reserved' },
      { s: '.trust-bar__chip span',
        a: 'نطاق raddad.sa · معتمد',
        e: 'raddad.sa Domain · Verified' },
      { s: '.trust-bar__chip span',
        a: 'رمز التوثيق:',
        e: 'License No.:',
        partial: true },
      /* Footer nav links (for pages without nav-panel) */
      { s: '.site-footer__legal a[href="/pricing.html"]', a: 'الأسعار والدفع', e: 'Pricing' },
      { s: '.site-footer__legal a[href="/pay.html"]',     a: 'الدفع الآمن',    e: 'Secure Payment' },
      { s: '.site-footer__legal a[href="/terms.html"]',   a: 'الشروط والأحكام', e: 'Terms & Conditions' },
      { s: '.site-footer__legal a[href="/privacy.html"]', a: 'سياسة الخصوصية', e: 'Privacy Policy' },
      { s: '.site-footer__legal a[href="/refund.html"]',  a: 'الاسترجاع والإلغاء', e: 'Refund & Cancellation' },
      { s: '.site-footer__legal a[href="/about.html"]',   a: 'عن المنصة', e: 'About' },
      { s: '.site-footer__legal a[href="/contact.html"]', a: 'تواصل', e: 'Contact' },
      { s: '.site-footer__legal a[href="/work.html"]',    a: 'الأعمال', e: 'Portfolio' },
      { s: '.site-footer__meta span:first-child',
        a: '© 2026 raddad.sa — جميع الحقوق محفوظة',
        e: '© 2026 raddad.sa — All Rights Reserved' },
      { s: '.site-footer__meta a[href="/admin.html"]', a: 'الأدمن', e: 'Admin' },
    ],

    /* ── index.html / home ── */
    '/': [
      { s: '.badge span:not(.badge-dot)', a: 'متاح لمشاريع التطبيقات والحلول الرقمية', e: 'Available for App Projects & Digital Solutions' },
      { s: '#home-title',  a: 'رّداد الماجدي', e: 'Raddad Al-Majdi' },
      { s: '.hero-copy .lead',
        a: 'أحوّل الأفكار إلى منتجات جاهزة — من التصميم والتطوير إلى النشر والدعم عبر بوابة عملاء منظمة.',
        e: 'I Transform Ideas Into Ready Products — From Design & Development to Publishing & Support Through an Organized Client Portal.' },
      { s: '.btn-primary[href="/request.html"]', a: 'سجّل فكرة تطبيقك', e: 'Submit Your App Idea' },
      { s: '.btn-secondary[href="/pricing.html"]', a: 'الأسعار والدفع', e: 'Pricing & Plans' },
      /* Quick cards */
      { s: '.card[href="/services.html"] h3', a: 'الخدمات', e: 'Services' },
      { s: '.card[href="/services.html"] p',  a: 'تطبيقات، منصات، Firebase، UI/UX، ونشر المتاجر.', e: 'Apps, platforms, Firebase, UI/UX, and app store publishing.' },
      { s: '.card[href="/work.html"] h3', a: 'الأعمال', e: 'Portfolio' },
      { s: '.card[href="/work.html"] p',  a: 'مناسبات بني غانم، إيصالك، Eldres (🇺🇸)، Eigo Media (🇯🇵).', e: 'Banighanim Events, Eisalak, Eldres 🇺🇸, Eigo Media 🇯🇵.' },
      { s: '.card[href="/process.html"] h3', a: 'آلية العمل', e: 'How It Works' },
      { s: '.card[href="/process.html"] p',  a: 'من تسجيل الفكرة إلى التسليم والتذاكر.', e: 'From idea submission to delivery and support tickets.' },
      { s: '.card[href="/login.html"] h3', a: 'بوابة العملاء', e: 'Client Portal' },
      { s: '.card[href="/login.html"] p',  a: 'تسجيل، دخول، ومتابعة الطلبات والتذاكر.', e: 'Register, login, and track your requests and tickets.' },
      { s: '.card[href="/pay.html"] h3', a: 'دفع آمن', e: 'Secure Payment' },
      { s: '.card[href="/pay.html"] p',  a: 'مقدّم مشروع، استشارة، أو اشتراك شهري عبر بوابة معتمدة.', e: 'Project deposit, consultation, or monthly subscription via certified gateway.' },
      { s: '.card[href="/about.html"] h3', a: 'عن المنصة', e: 'About' },
      { s: '.card[href="/about.html"] p',  a: 'هوية تجارية، عمل حر، وآلية العمل من الفكرة للدفع.', e: 'Business identity, freelance license, and workflow from idea to payment.' },
      /* Trust section */
      { s: '.trust-section__eyebrow', a: 'ثقة وامتثال', e: 'Trust & Compliance' },
      { s: '#trust-heading', a: 'توثيق وامتثال', e: 'Certification & Compliance' },
      { s: '.trust-section__lead', a: 'وثيقة عمل حر سارية، وحماية للملكية الفكرية والنطاق وفق الأنظمة المعمول بها في المملكة.', e: 'Active freelance license, intellectual property protection, and domain rights under Saudi regulations.' },
      /* CTA */
      { s: '.contact-cta h2', a: 'هل لديك فكرة تطبيق؟', e: 'Have an App Idea?' },
      { s: '.contact-cta p',  a: 'أرسل التفاصيل من صفحة طلب الفكرة أو راسلني مباشرة.', e: 'Send details via the idea request page or contact me directly.' },
      { s: '.contact-cta .btn-primary',  a: 'طلب فكرة', e: 'Submit Idea' },
      { s: '.contact-cta .btn-secondary',a: 'تواصل',    e: 'Contact Us' },
    ],

    /* ── services.html ── */
    '/services.html': [
      { s: '.section-heading.page-intro h1', a: 'الخدمات', e: 'Services' },
      { s: '.section-heading.page-intro p',
        a: 'حلول رقمية متكاملة — مع ترخيص نشاط تطوير برامج تطبيقات الجوال ضمن وثيقة العمل الحر.',
        e: 'Comprehensive digital solutions — licensed under the Mobile App Development freelance certificate.' },
      { s: '.service-card h3', a: 'تطوير برامج تطبيقات الجوال', e: 'Mobile App Development' },
      { s: '.service-card h3', a: 'منصات ويب ولوحات تحكم', e: 'Web Platforms & Dashboards' },
      { s: '.service-card h3', a: 'تكامل السحابة وFirebase', e: 'Cloud Integration & Firebase' },
      { s: '.service-card h3', a: 'تصميم UI/UX', e: 'UI/UX Design' },
      { s: '.service-card h3', a: 'نشر المتاجر والصيانة', e: 'App Store Publishing & Maintenance' },
      { s: '.service-card h3', a: 'استشارات تقنية', e: 'Technical Consulting' },
      { s: '.service-card p',
        a: 'تصميم وبرمجة تطبيقات iOS وAndroid عالية الأداء، مع تجربة استخدام عربية احترافية ونشر على المتاجر.',
        e: 'Design and development of high-performance iOS and Android apps with professional UX and app store publishing.' },
      { s: '.service-card p',
        a: 'بناء منصات SaaS، لوحات إدارة، ومواقع تفاعلية قابلة للتوسع.',
        e: 'Building SaaS platforms, admin dashboards, and scalable interactive websites.' },
      { s: '.service-card p',
        a: 'مصادقة، قواعد بيانات، إشعارات، واستضافة موثوقة لمنتجك الرقمي.',
        e: 'Authentication, databases, push notifications, and reliable hosting for your digital product.' },
      { s: '.service-card p',
        a: 'واجهات عصرية متوافقة مع هوية علامتك وتجربة المستخدم.',
        e: 'Modern interfaces aligned with your brand identity and user experience.' },
      { s: '.service-card p',
        a: 'إطلاق على App Store وGoogle Play مع تحديثات ودعم فني مستمر.',
        e: 'Launch on App Store and Google Play with ongoing updates and technical support.' },
      { s: '.service-card p',
        a: 'مراجعة الفكرة، تقدير التكلفة، وخارطة طريق تنفيذ واضحة.',
        e: 'Idea review, cost estimation, and a clear implementation roadmap.' },
      { s: '.card h2', a: 'الأسعار والدفع', e: 'Pricing & Payment' },
      { s: '.card p',
        a: 'مقدّم مشروع، دفعات مرحلية، استشارات، واشتراك صيانة شهري — مع عرض أسعار واضح قبل أي دفع إلكتروني.',
        e: 'Project deposit, milestone payments, consulting, and monthly maintenance — with a clear quote before any payment.' },
      { s: '.btn-primary[href="/pricing.html"]', a: 'عرض الباقات والأسعار', e: 'View Pricing & Packages' },
      { s: '.btn-secondary[href="/terms.html"]', a: 'الشروط والأحكام', e: 'Terms & Conditions' },
      { s: '.btn-primary[href="/request.html"]', a: 'ابدأ مشروعك', e: 'Start Your Project' },
      { s: '.btn-secondary[href="/process.html"]', a: 'كيف نعمل؟', e: 'How It Works' },
    ],

    /* ── pricing.html ── */
    '/pricing.html': [
      { s: '.section-heading.page-intro h1', a: 'الأسعار والدفع', e: 'Pricing & Payment' },
      { s: '.pricing-card h2', a: 'استشارة تقنية', e: 'Technical Consultation' },
      { s: '.pricing-card h2', a: 'مقدّم مشروع (تطوير)', e: 'Project Deposit (Development)' },
      { s: '.pricing-card h2', a: 'أقساط مرحلية', e: 'Milestone Payments' },
      { s: '.pricing-card h2', a: 'اشتراك صيانة ودعم', e: 'Maintenance & Support Subscription' },
      { s: '.pricing-card h2', a: 'مناسبة أساسية — بني غانم', e: 'Basic Event — Banighanim' },
      { s: '.pricing-card h2', a: 'VIP — بني غانم', e: 'VIP — Banighanim' },
      { s: '.pricing-card h2', a: 'اشتراك شهري — إيصالك', e: 'Monthly Subscription — Eisalak' },
      { s: '.pricing-card__tag', a: 'الأكثر شيوعاً', e: 'Most Popular' },
      { s: '.pricing-card .muted',
        a: 'جلسة مراجعة فكرة، تقدير أولي، أو توجيه تقني (مدة محددة في العرض).',
        e: 'Idea review session, preliminary estimate, or technical guidance (duration specified in the quote).' },
      { s: '.pricing-card .muted',
        a: 'يُدفع بعد الموافقة على عرض السعر وقبل بدء التنفيذ الفعلي للمشروع.',
        e: 'Paid after approving the quote and before actual project execution begins.' },
      { s: '.pricing-card .muted',
        a: 'بعد المقدّم: دفعات عند إنجاز مراحل محددة (تصميم، تطوير، اختبار، نشر).',
        e: 'After the deposit: payments upon completion of specific milestones (design, development, testing, launch).' },
      { s: '.pricing-card .muted',
        a: 'صيانة، تحديثات، مراقبة، أو ساعات دعم متفق عليها شهرياً.',
        e: 'Maintenance, updates, monitoring, or agreed monthly support hours.' },
      { s: '.pricing-card .muted',
        a: 'باقة المناسبة الأساسية داخل تطبيق مناسبات بني غانم — الدفع بالدينار الكويتي عبر Visa/Mastercard.',
        e: 'Basic event package inside the Banighanim Events App — payment in Kuwaiti Dinar via Visa/Mastercard.' },
      { s: '.pricing-card .muted',
        a: 'باقة VIP في التطبيق — الدفع بالدينار الكويتي؛ التسوية لحساب التاجر في ميسر بالريال.',
        e: 'VIP package in the app — paid in Kuwaiti Dinar; settlement to merchant account via Moyasar in SAR.' },
      { s: '.pricing-card .muted',
        a: 'اشتراك شهري لمنصة إيصالك: أرشفة واسترجاع الفواتير برقم الجوال.',
        e: 'Monthly subscription for Eisalak Platform: archive and retrieve invoices by phone number.' },
      { s: '.pricing-card li', a: 'دفع مرة واحدة', e: 'One-time payment' },
      { s: '.pricing-card li', a: 'تسليم ملخص أو توصيات كتابية عند الاتفاق', e: 'Summary or written recommendations delivered upon agreement' },
      { s: '.pricing-card li', a: 'مشاريع تطبيقات ومنصات: غالباً تبدأ من 15,000 ر.س حسب النطاق', e: 'App and platform projects: typically starting from 15,000 SAR depending on scope' },
      { s: '.pricing-card li', a: 'الدفعات التالية مرتبطة بمراحل التسليم (Milestones)', e: 'Subsequent payments are tied to delivery milestones' },
      { s: '.pricing-card li', a: 'نسب كل دفعة موضّحة في عرض السعر', e: 'Each payment percentage is specified in the quote' },
      { s: '.pricing-card li', a: 'لا تُستحق دفعة مرحلة قبل اعتماد تسليمها', e: 'A milestone payment is not due before its deliverable is approved' },
      { s: '.pricing-card li', a: 'تجديد شهري أو التزام بفترة محددة في العقد', e: 'Monthly renewal or a fixed commitment period per contract' },
      { s: '.pricing-card a.btn', a: 'ادفع الآن', e: 'Pay Now' },
      { s: '.pricing-card a.btn', a: 'دفع المقدّم', e: 'Pay Deposit' },
      { s: '.pricing-card a.btn', a: 'اشترك / ادفع', e: 'Subscribe / Pay' },
      { s: '.pricing-card a.btn', a: 'ادفع 30 د.ك', e: 'Pay 30 KWD' },
      { s: '.pricing-card a.btn', a: 'ادفع 50 د.ك', e: 'Pay 50 KWD' },
      { s: '.pricing-card a.btn', a: 'ادفع الاشتراك', e: 'Pay Subscription' },
      { s: '.section-heading h2', a: 'منتجاتنا — دفع مباشر', e: 'Our Products — Direct Payment' },
      { s: '.card h2', a: 'طرق الدفع', e: 'Payment Methods' },
      { s: '.card h2', a: 'كيف تبدأ؟', e: 'How to Get Started?' },
      { s: '.legal-list li', a: 'مدى (Mada)', e: 'Mada (Saudi Debit)' },
      { s: '.legal-list li', a: 'بطاقات Visa و Mastercard', e: 'Visa & Mastercard' },
      { s: '.legal-list li', a: 'Apple Pay و STC Pay (عند التوفر في البوابة)', e: 'Apple Pay & STC Pay (when available)' },
      { s: '.btn-primary[href="/pay.html"]', a: 'الانتقال إلى الدفع الآمن', e: 'Go to Secure Payment' },
      { s: '.btn-secondary[href="/request.html"]', a: 'طلب عرض سعر أولاً', e: 'Request a Quote First' },
      { s: '.legal-disclaimer',
        a: 'تنبيه: الأرقام إرشادية وقابلة للتعديل حسب تعقيد المشروع. هذا المحتوى لا يُنشئ التزاماً تعاقدياً دون عرض سعر معتمد.',
        e: 'Disclaimer: Figures are indicative and subject to change based on project complexity. This content does not create a contractual obligation without an approved quote.' },
    ],

    /* ── process.html ── */
    '/process.html': [
      { s: '.section-heading.page-intro h1', a: 'آلية العمل', e: 'How It Works' },
      { s: '.section-heading.page-intro p',
        a: 'مسار واضح من أول تواصل حتى التسليم والمتابعة عبر التذاكر.',
        e: 'A clear path from the first contact to delivery and ongoing ticket-based support.' },
      { s: '.step-card h3', a: 'تسجيل الفكرة', e: 'Submit Your Idea' },
      { s: '.step-card h3', a: 'دراسة وعرض', e: 'Review & Quotation' },
      { s: '.step-card h3', a: 'التطوير والتسليم', e: 'Development & Delivery' },
      { s: '.step-card h3', a: 'دعم وتذاكر', e: 'Support & Tickets' },
      { s: '.section-heading h2', a: 'أسئلة شائعة', e: 'Frequently Asked Questions' },
      { s: '.faq-item h3', a: 'كم يستغرق تنفيذ التطبيق؟', e: 'How long does it take to build an app?' },
      { s: '.faq-item h3', a: 'هل يمكن متابعة المشروع بعد الإطلاق؟', e: 'Can I follow up on my project after launch?' },
      { s: '.faq-item h3', a: 'هل أحتاج حسابًا قبل إرسال الفكرة؟', e: 'Do I need an account before submitting my idea?' },
      { s: '.faq-item p',
        a: 'يعتمد على عدد الميزات، وغالبًا بين 4 إلى 12 أسبوعًا للنسخة الأولى.',
        e: 'It depends on the number of features — typically 4 to 12 weeks for the first version.' },
      { s: '.faq-item p',
        a: 'نعم، عبر بوابة العملاء وفتح تذاكر دعم وتطوير مستمر.',
        e: 'Yes, through the client portal by opening support and development tickets.' },
      { s: '.faq-item p',
        a: 'لا، يمكنك الإرسال مباشرة. الحساب مفيد لمتابعة التذاكر لاحقًا.',
        e: 'No, you can submit directly. An account is useful for tracking tickets later.' },
    ],

    /* ── request.html ── */
    '/request.html': [
      { s: '.section-heading.page-intro h1', a: 'طلب تسجيل فكرة تطبيق', e: 'Submit Your App Idea' },
      { s: 'label[for="idea-name"]',     a: 'الاسم',              e: 'Full Name' },
      { s: 'label[for="idea-email"]',    a: 'البريد',             e: 'Email Address' },
      { s: 'label[for="idea-phone"]',    a: 'الجوال',             e: 'Phone / WhatsApp' },
      { s: 'label[for="idea-app"]',      a: 'اسم التطبيق/الفكرة', e: 'App Name / Idea Title' },
      { s: 'label[for="idea-platform"]', a: 'المنصة',             e: 'Platform' },
      { s: 'label[for="idea-budget"]',   a: 'الميزانية التقديرية', e: 'Estimated Budget' },
      { s: 'label[for="idea-timeline"]', a: 'المدة المتوقعة',     e: 'Expected Timeline' },
      { s: 'label[for="idea-desc"]',     a: 'وصف الفكرة والميزات', e: 'Idea Description & Features' },
      { s: 'button[type="submit"]',      a: 'إرسال الطلب',        e: 'Submit Request' },
    ],

    /* ── about.html ── */
    '/about.html': [
      { s: '.legal-page h1', a: 'عن منصة raddad.sa', e: 'About raddad.sa' },
      { s: '.legal-page .lead',
        a: 'منصة احترافية لتطوير تطبيقات الجوال والمنصات الرقمية — من الفكرة إلى النشر والدعم.',
        e: 'A professional platform for mobile app and digital platform development — from idea to publishing and support.' },
      { s: '.legal-section h2', a: 'مقدّم الخدمة', e: 'Service Provider' },
      { s: '.legal-section h2', a: 'كيف تعمل المنصة؟ (للمراجعة والفيديو التوضيحي)', e: 'How the Platform Works' },
      { s: '.legal-section h2', a: 'الثقة والامتثال', e: 'Trust & Compliance' },
      { s: '.legal-section li', a: 'نشاط:', e: 'Activity:' },
    ],

    /* ── work.html ── */
    '/work.html': [
      { s: '.section-heading.page-intro h1', a: 'أبرز الأعمال والمشاريع', e: 'Featured Projects & Portfolio' },
      { s: '#trust-heading-work', a: 'توثيق وامتثال', e: 'Certification & Compliance' },
    ],

    /* ── contact.html ── */
    '/contact.html': [
      { s: '.contact-cta h1', a: 'تواصل معي', e: 'Contact Us' },
    ],
  };

  /* ══════════════════════════════════════════════════════════════
     3. LANGUAGE DETECTION
     ══════════════════════════════════════════════════════════════ */
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

  /* ══════════════════════════════════════════════════════════════
     4. APPLY LANGUAGE
     ══════════════════════════════════════════════════════════════ */
  function tx(key, lang) {
    return (T[lang] && T[lang][key]) || null;
  }

  /* Apply text to element, saving original in data-ar */
  function setElText(el, lang, arText, enText) {
    if (!el) return;
    /* Save Arabic original on first run */
    if (!el.hasAttribute('data-ar')) {
      el.setAttribute('data-ar', el.textContent);
    }
    el.textContent = (lang === 'ar') ? (el.getAttribute('data-ar') || arText) : enText;
  }

  /* Apply data-i18n attributes */
  function applyDataI18n(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = tx(el.getAttribute('data-i18n'), lang);
      if (v !== null) {
        if (!el.hasAttribute('data-ar')) el.setAttribute('data-ar', el.textContent);
        el.textContent = v;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = tx(el.getAttribute('data-i18n-placeholder'), lang);
      if (v !== null) el.setAttribute('placeholder', v);
    });
  }

  /* Apply nav links by href */
  function applyNavLinks(lang) {
    var panel = document.querySelector('.nav-panel');
    if (panel) {
      panel.querySelectorAll('a[href]').forEach(function (a) {
        if (a.children.length > 0) return;
        var href = a.getAttribute('href');
        var key = 'nav.' + (href === '/' ? '/' : href.replace(/^https?:\/\/[^/]+/, ''));
        var v = tx(key, lang);
        if (v !== null) {
          if (!a.hasAttribute('data-ar')) a.setAttribute('data-ar', a.textContent);
          a.textContent = v;
        }
      });
    }
    var toggle = document.querySelector('.nav-toggle');
    if (toggle) {
      if (!toggle.hasAttribute('data-ar')) toggle.setAttribute('data-ar', toggle.textContent);
      var vt = tx('nav.toggle', lang);
      if (vt) toggle.textContent = vt;
    }
    var brandSpan = document.querySelector('.nav-brand > span');
    if (brandSpan) {
      if (!brandSpan.hasAttribute('data-ar')) brandSpan.setAttribute('data-ar', brandSpan.textContent);
      var vb = tx('nav.brand', lang);
      if (vb) brandSpan.textContent = vb;
    }
  }

  /* Apply CSS-selector rules for current page + global */
  function applyRules(lang) {
    var sets = [RULES.GLOBAL, RULES[PATH] || []];
    sets.forEach(function (ruleSet) {
      if (!ruleSet) return;
      ruleSet.forEach(function (rule) {
        var els = document.querySelectorAll(rule.s);
        els.forEach(function (el) {
          /* Determine if this element's stored/live Arabic matches */
          var currentAr = el.getAttribute('data-ar') || el.textContent;
          var matches = rule.partial
            ? currentAr.includes(rule.a)
            : currentAr.trim() === rule.a.trim();

          if (matches) {
            if (!el.hasAttribute('data-ar')) el.setAttribute('data-ar', el.textContent);
            if (lang === 'en') {
              el.textContent = rule.partial
                ? el.getAttribute('data-ar').replace(rule.a, rule.e)
                : rule.e;
            } else {
              el.textContent = el.getAttribute('data-ar');
            }
          }
        });
      });
    });
  }

  /* Update lang switcher buttons */
  function updateSwitcher(lang) {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('lang-btn--active', btn.dataset.lang === lang);
    });
  }

  /* Main apply */
  function applyLang(lang) {
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    applyNavLinks(lang);
    applyDataI18n(lang);
    applyRules(lang);
    updateSwitcher(lang);

    localStorage.setItem('raddad_lang', lang);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  /* ══════════════════════════════════════════════════════════════
     5. INJECT 🌐 SWITCHER
     ══════════════════════════════════════════════════════════════ */
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

    var brand = inner.querySelector('.nav-brand');
    inner.insertBefore(sw, brand ? brand.nextSibling : null);

    sw.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-btn');
      if (btn) applyLang(btn.dataset.lang);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     6. BOOT
     ══════════════════════════════════════════════════════════════ */
  window.__raddadI18n = { applyLang: applyLang, detectLang: detectLang };

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
