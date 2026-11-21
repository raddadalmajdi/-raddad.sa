export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer__legal" aria-label="السياسات والأسعار">
        <a href="/pricing.html">الأسعار والدفع</a>
        <a href="/pay.html">الدفع الآمن</a>
        <a href="/terms.html">الشروط والأحكام</a>
        <a href="/privacy.html">سياسة الخصوصية</a>
        <a href="/refund.html">الاسترجاع والإلغاء</a>
        <a href="/about.html">عن المنصة</a>
        <a href="/contact.html">تواصل</a>
      </nav>
      <div className="site-footer__meta">
        <span>&copy; 2026 raddad.sa — جميع الحقوق محفوظة</span>
        <span>
          <a href="tel:+966533160799">0533160799</a> ·{' '}
          <a href="mailto:raddadalmajdi@gmail.com">raddadalmajdi@gmail.com</a>
        </span>
      </div>
    </footer>
  );
}