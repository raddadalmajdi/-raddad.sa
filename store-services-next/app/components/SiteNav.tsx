export function SiteNav() {
  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a className="nav-brand" href="/">
          <img
            className="nav-logo"
            src="/assets/logo.png"
            srcSet="/assets/logo.png 1x, /assets/logo@2x.png 2x"
            alt=""
            width={40}
            height={42}
            loading="eager"
            decoding="async"
          />
          <span>رّداد · raddad.sa</span>
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="main-nav"
        >
          القائمة
        </button>
        <nav className="nav-panel" id="main-nav" aria-label="التنقل الرئيسي">
          <a href="/">الرئيسية</a>
          <a href="/services.html">الخدمات</a>
          <a href="/services" aria-current="page">
            خدمات المتاجر
          </a>
          <a href="/pricing.html">الأسعار والدفع</a>
          <a href="/work.html">الأعمال</a>
          <a href="/process.html">آلية العمل</a>
          <a href="/request.html">طلب فكرة</a>
          <a href="/login.html" data-nav-auth>
            تسجيل الدخول
          </a>
          <a href="/admin.html" className="nav-admin-link" data-nav-admin>
            دخول الأدمن
          </a>
          <a href="/contact.html">تواصل</a>
        </nav>
      </div>
    </header>
  );
}