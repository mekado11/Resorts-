import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

// ─── SVG icon helpers ─────────────────────────────────────────────────────────
function IconHouse() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IconBadge() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  );
}
function IconPerson() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function IconEnvelope() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function IconSignOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { id: 'my-eldorado',       label: 'Overview',           Icon: IconHouse },
  { id: 'my-stays',          label: 'My Stays',           Icon: IconCalendar },
  { id: 'my-preferences',    label: 'My Preferences',     Icon: IconSettings },
  { id: 'my-experiences',    label: 'Saved Experiences',  Icon: IconHeart },
  { id: 'membership',        label: 'Membership',         Icon: IconBadge },
  { id: 'my-profile',        label: 'Personal Details',   Icon: IconPerson },
  { id: 'my-communications', label: 'Communications',     Icon: IconEnvelope },
  { id: 'my-security',       label: 'Security',           Icon: IconLock },
];

interface Props {
  children: ReactNode;
  current: string;
  setPage: (p: string) => void;
}

export default function AccountLayout({ children, current, setPage }: Props) {
  const { user, signOut, displayName } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setPage('home');
  };

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', color: 'var(--navy)' }}>Please sign in to continue.</p>
        <button className="btn-primary" onClick={() => setPage('signin')}>Sign In</button>
      </div>
    );
  }

  // Initials for avatar
  const initials = displayName
    ? displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'ME';

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '2rem clamp(1rem,4vw,2.5rem) 4rem', display: 'grid', gridTemplateColumns: '230px 1fr', gap: '2.5rem', alignItems: 'start' }}>
      {/* ── Sidebar ── */}
      <aside style={{ position: 'sticky', top: 140 }}>
        {/* Avatar + name */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(13,27,42,0.08)', border: '1.5px solid rgba(201,168,76,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.68rem', fontWeight: 600, color: '#C9A84C', letterSpacing: '0.04em' }}>{initials}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: 'var(--navy)', fontWeight: 500, lineHeight: 1.2 }}>{displayName}</div>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginTop: '0.15rem' }}>My Eldorado</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          {NAV_ITEMS.map(item => {
            const isActive = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  background: isActive ? 'var(--navy)' : 'transparent',
                  color: isActive ? 'var(--ivory)' : 'rgba(13,27,42,0.55)',
                  border: 'none', borderRadius: 4, padding: '0.62rem 0.85rem',
                  textAlign: 'left', fontFamily: "'Jost',sans-serif", fontSize: '0.8rem',
                  cursor: 'pointer', letterSpacing: '0.03em', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(13,27,42,0.05)'; e.currentTarget.style.color = 'var(--navy)'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(13,27,42,0.55)'; }}}
              >
                <span style={{ opacity: isActive ? 1 : 0.55, flexShrink: 0 }}>
                  <item.Icon />
                </span>
                {item.label}
              </button>
            );
          })}

          {/* Eldorado Cares widget in sidebar */}
          <div style={{ margin: '1rem 0 0', padding: '1rem', background: 'rgba(13,27,42,0.03)', border: '1px solid rgba(13,27,42,0.07)', borderRadius: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span style={{ color: '#C9A84C', opacity: 0.8 }}><IconHeart /></span>
              <span style={{ fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.4)', fontFamily: "'Jost',sans-serif" }}>Eldorado Cares</span>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'rgba(13,27,42,0.55)', lineHeight: 1.6, marginBottom: '0.6rem' }}>
              Every stay helps us create opportunity for our community.
            </p>
            <button onClick={() => setPage('eldorado-cares')} style={{
              background: 'none', border: 'none', padding: 0,
              fontSize: '0.68rem', color: '#C9A84C', cursor: 'pointer',
              fontFamily: "'Jost',sans-serif", letterSpacing: '0.06em',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              Learn more <span>→</span>
            </button>
          </div>

          {/* Sign out */}
          <div style={{ borderTop: '1px solid rgba(13,27,42,0.08)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
            <button
              onClick={handleSignOut}
              style={{
                background: 'transparent', color: 'rgba(13,27,42,0.38)', border: 'none',
                borderRadius: 4, padding: '0.62rem 0.85rem', textAlign: 'left',
                fontFamily: "'Jost',sans-serif", fontSize: '0.78rem', cursor: 'pointer',
                letterSpacing: '0.03em', width: '100%',
                display: 'flex', alignItems: 'center', gap: '0.65rem', transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(13,27,42,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(13,27,42,0.38)')}
            >
              <span style={{ opacity: 0.45 }}><IconSignOut /></span>
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* ── Main content ── */}
      <main>{children}</main>
    </div>
  );
}
