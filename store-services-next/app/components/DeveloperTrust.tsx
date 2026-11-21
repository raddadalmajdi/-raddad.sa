const PROGRAMS = [
  {
    img: '/assets/badges/apple-developer-icon.png',
    label: 'مطور معتمد في أبل',
    mod: 'dev-badge--apple',
  },
  {
    img: '/assets/badges/google-play-developer-icon.png',
    label: 'مطور معتمد في جوجل',
    mod: 'dev-badge--google',
  },
  {
    img: '/assets/badges/huawei-developer-icon.png',
    label: 'مطور معتمد في هواوي',
    mod: 'dev-badge--huawei',
  },
] as const;

function StoresRow({ compact }: { compact: boolean }) {
  const icon = compact ? 40 : 44;
  return (
    <div className="dev-badge-strip dev-badge-strip--hero-stores" aria-label="حسابات المطور المعتمدة">
      {PROGRAMS.map((p) => (
        <article key={p.img} className={`dev-badge ${p.mod}`}>
          <img
            className="dev-badge__icon"
            src={p.img}
            alt=""
            width={icon}
            height={icon}
            loading="lazy"
            decoding="async"
          />
          <p className="dev-badge__label">{p.label}</p>
        </article>
      ))}
    </div>
  );
}

function FreelanceBadge({ compact }: { compact: boolean }) {
  const icon = compact ? 40 : 48;
  return (
    <article className="dev-badge dev-badge--freelance">
      <span className="dev-badge__icon dev-badge__icon--fl" style={{ width: icon, height: icon }}>
        <img
          src="/assets/freelance-work-logo.png"
          srcSet="/assets/freelance-work-logo@2x.png 2x"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
      <p className="dev-badge__label">
        وثيقة عمل حر · <span className="verify-code">FL-629703910</span>
      </p>
    </article>
  );
}

export function DeveloperTrustBar() {
  return (
    <div className="dev-hero-trust-block" id="hero-dev-trust">
      <p className="activity-badge dev-hero-fl">
        <img
          className="freelance-logo freelance-logo--chip"
          src="/assets/freelance-work-logo.png"
          srcSet="/assets/freelance-work-logo@2x.png 2x"
          alt=""
          width={161}
          height={71}
          loading="lazy"
          decoding="async"
        />
        <span>
          وثيقة عمل حر · <span className="verify-code">FL-629703910</span>
        </span>
      </p>
      <StoresRow compact />
    </div>
  );
}

export function DeveloperTrustChips() {
  return (
    <>
      <FreelanceBadge compact={false} />
      <StoresRow compact={false} />
    </>
  );
}