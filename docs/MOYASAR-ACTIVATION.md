# تفعيل ميسر على raddad.sa

## 1) بعد موافقة ميسر

احصل على **المفتاح العام** فقط:

- تجريبي: `pk_test_...`
- إنتاج: `pk_live_...`

**لا تضع** `sk_` في الموقع أو GitHub إلا كـ Secret لـ Cloud Functions (اختياري).

## 2) محلياً

```bash
# في .env
VITE_MOYASAR_PUBLISHABLE_KEY=pk_test_xxxxxxxx
VITE_SITE_URL=https://raddad.sa
npm run build
```

## 3) GitHub Pages (الإنتاج)

في **Settings → Secrets → Actions** أضف:

`VITE_MOYASAR_PUBLISHABLE_KEY` = نفس `pk_live_...` بعد التفعيل النهائي

ثم ادفع إلى `main` — workflow يبني وينشر تلقائياً.

## 4) التحقق

1. افتح https://raddad.sa/pay.html
2. اختر «استشارة تقنية» (500 ر.س) أو مبلغ مقدّم
3. يظهر نموذج ميسر (مدى / بطاقة / Apple Pay إن مُفعّل في لوحة ميسر)
4. للفيديو التوضيحي لميسر: سجّل الشاشة من `/about.html` → `/pricing.html` → `/pay.html` → نموذج الدفع

## 5) Apple Pay (اختياري)

في لوحة ميسر: أضف نطاق `raddad.sa` واتبع توثيق النطاق.

## 6) Webhook (لاحقاً)

راجع `functions/README.txt` على خطة Blaze.
