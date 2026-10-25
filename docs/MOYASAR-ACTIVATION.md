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

## 5) Apple Pay — نطاقات الويب (لوحة ميسر → نطاقات Apple Pay)

الحالة **PENDING** تعني أن ميسر لم يتحقق بعد من ملف التوثيق على موقعك.

### raddad.sa (GitHub Pages)

1. في ميسر اضغط **ملف التحقق** (تحميل الملف بدون أي امتداد).
2. ضع الملف في المستودع بالمسار **بالضبط**:
   ```
   .well-known/apple-developer-merchantid-domain-association
   ```
   لا تُسمّه `.txt` ولا تضف امتداداً.
3. ادفع إلى `main` وانتظر نشر GitHub Pages (دقيقة أو دقيقتان).
4. تأكد أن الرابط يفتح نصاً (وليس 404):
   https://raddad.sa/.well-known/apple-developer-merchantid-domain-association
5. في ميسر على صف `raddad.sa`: **تحقق** ثم **تسجيل** (Register) حسب ما يظهر في اللوحة.

بعد أن تصبح الحالة **مسجّل / نشط** يمكن إعادة تفعيل `applepay` في `src/pay.js` ونشر الموقع.

### quuq.ai

نطاق منفصل — نفس ملف التحقق (عادةً من نفس حساب ميسر) يُرفع على **استضافة quuq.ai** بنفس المسار `/.well-known/...` ثم **تحقق** من صف `quuq.ai` في ميسر.

## 6) إشعارات الدفع (Webhooks) — اختياري الآن

لا تحتاج Webhook لكي يعمل الدفع من `/pay.html`. العميل يُعاد إلى `pay-success.html` بعد الدفع، ويمكنك متابعة العمليات من لوحة ميسر.

فعّل Webhook لاحقاً إذا أردت تحديثاً تلقائياً (Firestore، بريد، إلخ) عبر Cloud Function — راجع `functions/README.txt` (خطة Blaze).

في ميسر: **إضافة Webhook** → URL الدالة → أحداث الدفع (نجاح/فشل) حسب توثيق ميسر.
