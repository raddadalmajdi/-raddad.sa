import { DEMO_MENU_URL } from '../data/storeServices';

export function QrDemo() {
  return (
    <a href={DEMO_MENU_URL} className="demo-qr-link" aria-label="فتح القائمة التجريبية">
      <img
        src="/assets/demo-menu-qr.png"
        width={148}
        height={148}
        alt="باركود يفتح قائمة مثال مطعم شاورما"
        className="mx-auto"
        loading="lazy"
      />
    </a>
  );
}