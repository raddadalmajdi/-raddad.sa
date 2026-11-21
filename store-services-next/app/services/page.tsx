import { DeveloperTrustBar } from '../components/DeveloperTrust';
import { QrDemo } from '../components/QrDemo';
import { ServiceIcon } from '../components/ServiceIcon';
import { addOns, DEMO_MENU_URL, faqs, flowSteps, packages, services, waLink } from '../data/storeServices';

const Chevron = () => (
  <span className="ss-faq-chevron" aria-hidden="true">
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  </span>
);

export default function StoreServicesPage() {
  const heroWa = waLink(
    'السلام عليكم، أريد خدمة واتساب ذكي لنشاطي'
  );
  const demoWa = waLink('السلام، أريد تجربة نظام واتساب الذكي (مثال مطعم شاورما)');

  return (
    <main className="container page">
      <section className="hero-home page-intro" id="top">
        <div className="hero-copy">
          <p className="badge">
            <span className="badge-dot" />
            واتساب للأعمال (Meta) — دفع وتسجيل على المنصة
          </p>
          <h1>واتساب ذكي لمحلك أو شركتك — طلبات ورد آلي على رقمك</h1>
          <p className="lead">
            خدمة مبرمجة جاهزة: العميل يختار الباقة، يدفع، يُسجَّل نشاطه، ونربط واتساب عبر القنوات المعتمدة —
            اشتراك شهري أو دفعة إعداد حسب الباقة.
          </p>
          <DeveloperTrustBar />
          <div className="store-services-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <a
              className="btn btn-wa"
              href={heroWa}
              target="_blank"
              rel="noopener noreferrer"
            >
              اطلب الخدمة — واتساب
            </a>
            <a className="btn btn-primary" href="/pay.html?plan=store_growth&amp;source=store_services">
              ادفع وابدأ التسجيل
            </a>
            <a className="btn btn-secondary" href="#demo">
              جرّب مثال القائمة
            </a>
          </div>
        </div>
        <div className="hero-logo-stage" aria-hidden="true">
          <img
            className="hero-logo"
            src="/assets/logo.png"
            srcSet="/assets/logo.png 1x, /assets/logo@2x.png 2x"
            alt=""
            width={260}
            height={273}
            loading="lazy"
          />
        </div>
      </section>

      <section id="offerings" className="section-heading">
        <p className="trust-section__eyebrow">المنتج الذي نبيعه اليوم</p>
        <h2>نظام واتساب ذكي — ليس موقعاً ولا تطبيقاً منفصلاً</h2>
        <p className="muted">
          المحور: ربط Meta وواتساب للأعمال. الباركود والموقع والخريطة إضافات عند الطلب فقط.
        </p>
      </section>
      <div className="services-grid">
        {services.map((s) => (
          <article key={s.title} className="service-card">
            <span className="ss-icon">
              <ServiceIcon type={s.icon} />
            </span>
            <h3 style={{ marginTop: 12 }}>{s.title}</h3>
            <p>{s.desc}</p>
            <p className="ss-deliverable">{s.deliverable}</p>
            <p className="ss-delivery">{s.delivery}</p>
          </article>
        ))}
      </div>

      <section className="section-heading" style={{ marginTop: 24 }}>
        <h2>إضافات اختيارية</h2>
      </section>
      <ul className="trust-grid" style={{ marginBottom: 8 }}>
        {addOns.map((a) => (
          <li key={a.title} className="trust-card">
            <strong>{a.title}</strong>
            <span className="muted" style={{ fontSize: '0.86rem' }}>
              {a.note}
            </span>
          </li>
        ))}
      </ul>

      <section id="packages" className="section-heading" style={{ marginTop: 36 }}>
        <h2>الباقات — دفع وتسجيل</h2>
        <p>اختر باقة، ادفع على المنصة، ثم نكمل ربط واتساب وتفعيل حسابك.</p>
      </section>
      <div className="pricing-grid">
        {packages.map((pkg) => (
          <article
            key={pkg.name}
            className={pkg.featured ? 'pricing-card pricing-card--featured' : 'pricing-card'}
          >
            {'tag' in pkg && pkg.tag ? (
              <span className="pricing-card__tag">{pkg.tag}</span>
            ) : null}
            <h2>{pkg.name}</h2>
            <p className="pricing-card__price">
              <strong>{pkg.price}</strong>{' '}
              <span className="muted" style={{ fontSize: '0.95rem' }}>
                {pkg.priceNote}
              </span>
            </p>
            <ul className="pricing-card__list">
              {pkg.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {pkg.paySetup ? (
              <a
                className={pkg.featured ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ marginTop: 12, display: 'inline-flex' }}
                href={`/pay.html?plan=${pkg.payPlan}&source=store_services`}
              >
                ادفع رسوم الإعداد
              </a>
            ) : (
              <a
                className="btn btn-primary"
                style={{ marginTop: 12, display: 'inline-flex' }}
                href={`/pay.html?plan=${pkg.payPlan}&source=store_services`}
              >
                ادفع الاشتراك الشهري
              </a>
            )}
            {'payMonthlyPlan' in pkg && pkg.payMonthlyPlan ? (
              <a
                className="btn btn-secondary"
                style={{ marginTop: 8, display: 'inline-flex' }}
                href={`/pay.html?plan=${pkg.payMonthlyPlan}&source=store_services`}
              >
                ادفع الاشتراك فقط
              </a>
            ) : null}
            <a
              className="btn btn-secondary"
              style={{ marginTop: 8, display: 'inline-flex' }}
              href={waLink(pkg.waText)}
              target="_blank"
              rel="noopener noreferrer"
            >
              استفسر على واتساب
            </a>
          </article>
        ))}
      </div>

      <div className="store-services-band" id="demo">
        <DemoSection demoWa={demoWa} menuUrl={DEMO_MENU_URL} />
      </div>

      <section id="how" className="section-heading" style={{ marginTop: 36 }}>
        <h2>من الطلب إلى التشغيل</h2>
      </section>
      <ol className="steps-grid" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {flowSteps.map((step) => (
          <li key={step.n} className="step-card">
            <strong>{step.n}</strong>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </li>
        ))}
      </ol>

      <section className="trust-section" id="trust" style={{ marginTop: 36 }}>
        <div className="trust-section__head">
          <h2>ثقة وتوثيق</h2>
          <p className="trust-section__lead">
            نشاط مسجّل بوثيقة عمل حر سعودية — ننفّذ الربط التقني ونسلّمك نظاماً جاهزاً على رقم نشاطك.
          </p>
        </div>
        <ul className="trust-grid">
          <li className="trust-card">
            <img className="trust-card__icon" src="/assets/freelance-work-logo.png" alt="" width={120} height={52} loading="lazy" />
            <h3>وثيقة عمل حر</h3>
            <p>
              نشاط معتمد في المملكة · <span className="verify-code">FL-629703910</span>
            </p>
          </li>
          <li className="trust-card trust-card--dev">
            <img className="trust-card__icon dev-badge__icon trust-card__icon--store" src="/assets/badges/apple-developer-icon.png" alt="" width={56} height={56} loading="lazy" />
            <h3>مطور معتمد في أبل</h3>
            <p className="muted">نشر وصيانة تطبيقات iOS.</p>
          </li>
          <li className="trust-card trust-card--dev">
            <img className="trust-card__icon dev-badge__icon trust-card__icon--store" src="/assets/badges/google-play-developer-icon.png" alt="" width={56} height={56} loading="lazy" />
            <h3>مطور معتمد في جوجل</h3>
            <p className="muted">نشر تطبيقات أندرويد.</p>
          </li>
          <li className="trust-card trust-card--dev">
            <img className="trust-card__icon dev-badge__icon trust-card__icon--store" src="/assets/badges/huawei-developer-icon.png" alt="" width={56} height={56} loading="lazy" />
            <h3>مطور معتمد في هواوي</h3>
            <p className="muted">توزيع عبر متجر هواوي.</p>
          </li>
          <li className="trust-card">تشغيل عبر واتساب للأعمال (Meta)</li>
          <li className="trust-card">دفع آمن وتسجيل على raddad.sa</li>
        </ul>
      </section>

      <section id="faq" className="section-heading" style={{ marginTop: 36 }}>
        <h2>أسئلة شائعة</h2>
      </section>
      <div className="ss-faq" style={{ maxWidth: 720 }}>
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <Chevron />
            </summary>
            <p className="muted">{f.a}</p>
          </details>
        ))}
      </div>

      <section className="contact-cta contact-cta--stores" style={{ marginTop: 40 }}>
        <h2>جاهز تربط واتساب نشاطك؟</h2>
        <p>ادفع من المنصة أو راسلنا بكلمة «واتساب»</p>
        <a
          className="btn btn-primary"
          href="/pricing.html"
        >
          منتجاتنا — دفع مباشر
        </a>
        <a
          className="btn btn-wa"
          style={{ marginInlineStart: 8 }}
          href={waLink('واتساب')}
          target="_blank"
          rel="noopener noreferrer"
        >
          أرسل «واتساب» على واتساب
        </a>
      </section>
    </main>
  );
}

function DemoSection({ demoWa, menuUrl }: { demoWa: string; menuUrl: string }) {
  return (
    <div className="container">
      <div className="section-heading">
        <h2>مثال توضيحي — ليس محلاً حقيقياً</h2>
        <p>مطعم شاورما (نموذج فقط) يوضّح مسار العميل: مسح باركود → قائمة → طلب على واتساب</p>
      </div>
      <div className="demo-grid">
        <div className="demo-card">
          <p className="muted" style={{ marginBottom: 12 }}>
            باركود قائمة (يعمل)
          </p>
          <QrDemo />
          <p className="muted" style={{ marginTop: 12, fontSize: '0.82rem' }}>
            يفتح {menuUrl.replace('https://', '')}
          </p>
        </div>
        <div className="demo-card demo-card--menu">
          <p className="muted" style={{ marginBottom: 12 }}>
            معاينة القائمة
          </p>
          <ul className="demo-menu-list">
            <li>
              <span>شاورما لحم</span>
              <span className="price">18 ر.س</span>
            </li>
            <li>
              <span>شاورما دجاج</span>
              <span className="price">15 ر.س</span>
            </li>
            <li>
              <span>بطاطس</span>
              <span className="price">8 ر.س</span>
            </li>
            <li>
              <span>عصير</span>
              <span className="price">7 ر.س</span>
            </li>
          </ul>
          <a className="project-link" style={{ marginTop: 12, display: 'inline-block' }} href={menuUrl}>
            افتح صفحة المثال
          </a>
        </div>
        <div
          className="demo-card"
          style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}
        >
          <a className="btn btn-wa" href={demoWa} target="_blank" rel="noopener noreferrer">
            طلب عبر واتساب (مثال)
          </a>
          <a className="btn btn-secondary" href="/pay.html?plan=store_growth&amp;source=store_services">
            اشترِ خدمة واتساب الذكي
          </a>
        </div>
      </div>
    </div>
  );
}