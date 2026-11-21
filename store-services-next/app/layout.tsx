import type { Metadata } from 'next';
import Script from 'next/script';
import { SiteFooter } from './components/SiteFooter';
import { SiteNav } from './components/SiteNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'واتساب ذكي للأعمال | رداد - RADDAD',
  description:
    'خدمة واتساب ذكي للمحلات والشركات: ربط Meta، دفع وتسجيل على المنصة، اشتراك شهري أو دفعة إعداد. مطور معتمد بوثيقة عمل حر سعودية.',
  icons: {
    icon: [
      { url: '/assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/assets/apple-touch-icon.png',
  },
  themeColor: '#f0fdfa',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/site.css?v=20261121" />
        <link rel="stylesheet" href="/css/store-services.css" />
      </head>
      <body className="store-services-page">
        <SiteNav />
        {children}
        <SiteFooter />
        <Script src="/js/i18n.js" strategy="afterInteractive" />
        <Script src="/js/firebase-config.js" strategy="afterInteractive" />
        <Script src="/js/site-business.js" strategy="afterInteractive" />
        <Script src="/js/site-business-boot.js" strategy="lazyOnload" />
        <Script src="/js/assistant-boot.js" strategy="lazyOnload" />
        <Script src="/js/navAuth.bundle.js" strategy="afterInteractive" type="module" />
        <Script src="/js/nav.js" strategy="lazyOnload" />
        <Script src="/js/developer-trust-boot.js?v=20261121" strategy="lazyOnload" />
      </body>
    </html>
  );
}