# ميسر — مشروع eysalk

**Firebase:** `eysalk-2c7be` (أو `eysalk` في اللوحة)  
**الموقع/التطبيق:** eysalk (مستودع منفصل عن raddad.sa)

## ما لا تفعله في eysalk

- لا تضع `pk_` أو `sk_` في التطبيق إن كان الدفع عبر المتصفح.
- لا تنسخ `pay-checkout.html` إلا إن قررت استضافة نموذج ميسر على نطاق eysalk لاحقاً.

## ما تفعله في eysalk (الآن)

انسخ الملف الجاهز إلى مستودع eysalk:

`docs/payments/eysalk/paymentLink.ts` → مثلاً `src/lib/paymentLink.ts`

### الرابط

```
https://raddad.sa/pay-checkout.html?plan=eysalk_monthly&channel=card&source=eysalk
```

أو صفحة الاختيار:

```
https://raddad.sa/pay.html?plan=eysalk_monthly&source=eysalk
```

### React / React Native

```ts
import { openEysalkSubscriptionCheckout } from "./lib/paymentLink"

// زر اشتراك
<button type="button" onClick={() => openEysalkSubscriptionCheckout()}>
  ادفع 299 ر.س / شهر
</button>
```

في RN استخدم `Linking.openURL(url)` داخل نفس الدالة.

## بعد الدفع

1. المستخدم يعود إلى `https://raddad.sa/pay-success.html?id=...`
2. (لاحقاً) Webhook في **مشروع eysalk** يقرأ `metadata.source === "eysalk"` ويضبط `subscriptionStatus: "active"` في Firestore.

## السعر

يُحدد في **raddad.sa** فقط: `plan=eysalk_monthly` (299 ر.س). غيّر السعر في `src/shared/paymentPlans.js` ثم build للموقع.
