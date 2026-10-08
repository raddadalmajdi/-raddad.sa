# إرسال الطلب لميسر

## قبل الإرسال

- [ ] راجع `عقد ميسر - معبأ - رداد.pdf` على سطح المكتب
- [ ] تأكد أن الاسم يطابق شهادة العمل الحر حرفياً
- [ ] أرفق الشهادة + الهوية + الآيبان
- [ ] انسخ البريد من `~/Desktop/المستندات الخاصة بي/إرسال-لميسر-نسخ-والصق.txt`

## بعد موافقة ميسر

1. أضف `VITE_MOYASAR_PUBLISHABLE_KEY` في `.env` و GitHub Secrets
2. `npm run build` ثم ادفع إلى `main`
3. اختبر https://raddad.sa/pay.html
4. سجّل فيديو نموذج الدفع إن طُلب

See also: [MOYASAR-ACTIVATION.md](./MOYASAR-ACTIVATION.md)
