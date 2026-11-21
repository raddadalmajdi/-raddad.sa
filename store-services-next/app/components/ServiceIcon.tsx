type Props = { type: string };

export function ServiceIcon({ type }: Props) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true,
  };

  switch (type) {
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M20 11.5a8.5 8.5 0 0 1-12.37 7.57L4 20l.97-3.5A8.5 8.5 0 1 1 20 11.5Z" />
        </svg>
      );
    case 'qr':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <path d="M14 14h3v3h-3zM20 14v7M14 20h7" />
        </svg>
      );
    case 'map':
      return (
        <svg {...common}>
          <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
      );
    case 'mobile':
      return (
        <svg {...common}>
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <path d="M11 19h2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
  }
}