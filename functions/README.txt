Moyasar webhook (optional — after Blaze plan)

1. Set secret: firebase functions:secrets:set MOYASAR_SECRET_KEY
2. Deploy: firebase deploy --only functions
3. Register webhook URL in Moyasar dashboard pointing to your function URL.

Until then, payments are confirmed via Moyasar dashboard + pay-success page records.

Never commit sk_ keys to git.
