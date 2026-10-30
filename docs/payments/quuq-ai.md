# ميسر — مشروع quuq-ai

**Firebase:** `quuq-ai`  
**المستودع:** `quuq-ai` (محلي مثلاً `~/Desktop/quuq-ai`)

## الدفع

النموذج على **raddad.sa**؛ quuq-ai يفتح الرابط فقط.

| plan | المبلغ |
|------|--------|
| `quuq_ai_monthly` | 299 ر.س / شهر |

```
https://raddad.sa/pay-checkout.html?plan=quuq_ai_monthly&channel=card&source=quuq_ai
```

## الكود في quuq-ai

- `src/config/payments.ts` — بناء الرابط
- `src/pages/Business.tsx` — زر الاشتراك
- `docs/MOYASAR.md` — ملخص داخل المستودع

```bash
cd quuq-ai
npm run build
firebase deploy --only hosting
```

## Apple Pay على quuq.ai

إن فتحت الدفع من نطاق `quuq.ai` لاحقاً: ملف  
`/.well-known/apple-developer-merchantid-domain-association`  
على استضافة quuq.ai + تسجيل النطاق في ميسر.

## بعد الدفع (لاحقاً)

Webhook في **functions** لمشروع `quuq-ai` يفعّل اشتراك الشركة من `metadata.plan_id`.
