# ميسر — مشروع raddad-sa

**Firebase:** `raddad-sa`  
**الموقع:** https://raddad.sa  
**هذا المستودع** يضم نموذج ميسر (`pay.html` → `pay-checkout.html`).

## المفتاح

```env
# .env (لا يُرفع لـ Git)
VITE_MOYASAR_PUBLISHABLE_KEY=pk_live_...
VITE_SITE_URL=https://raddad.sa
```

```bash
npm run build
git add js/payment-config.js
git push origin main
```

GitHub Actions → Secret `VITE_MOYASAR_PUBLISHABLE_KEY`.

## خطط هذا المشروع

| plan | الاستخدام |
|------|-----------|
| `consultation` | استشارة 500 ر.س |
| `maintenance` | صيانة شهرية |
| `deposit` | مقدّم + `amount` بالريال |
| `beni_ghanem_basic` | مناسبة أساسية — 30 د.ك (KWD) |
| `beni_ghanem_vip` | VIP — 50 د.ك (KWD) |

معرف المنصة في ميسر: `source=raddad_sa` (اختياري في الرابط).

## اختبار

https://raddad.sa/pay.html?plan=consultation&source=raddad_sa

## لاحقاً (نفس مشروع Firebase)

- Cloud Function + `MOYASAR_SECRET_KEY` لـ Webhook
- تسجيل الدفعات في Firestore `raddad-sa`
