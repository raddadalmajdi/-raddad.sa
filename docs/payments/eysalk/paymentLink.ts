/**
 * انسخ هذا الملف إلى مستودع eysalk (مثلاً src/lib/paymentLink.ts).
 * الدفع يُتم على raddad.sa — لا مفاتيح ميسر هنا.
 */

const PAY_HOST = "https://raddad.sa"

export type EysalkPayChannel = "card" | "applepay"

export function eysalkCheckoutUrl(channel: EysalkPayChannel = "card"): string {
  const params = new URLSearchParams({
    plan: "eysalk_monthly",
    channel,
    source: "eysalk",
  })
  return `${PAY_HOST}/pay-checkout.html?${params.toString()}`
}

export function eysalkPayLandingUrl(): string {
  const params = new URLSearchParams({
    plan: "eysalk_monthly",
    source: "eysalk",
  })
  return `${PAY_HOST}/pay.html?${params.toString()}`
}

export function openEysalkSubscriptionCheckout(channel: EysalkPayChannel = "card"): void {
  const url = eysalkCheckoutUrl(channel)
  if (typeof window !== "undefined") {
    window.location.href = url
    return
  }
  // React Native: import { Linking } from "react-native"; await Linking.openURL(url)
  throw new Error(`Open in browser: ${url}`)
}
