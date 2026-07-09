import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { id: 'my-eldorado',       label: 'Overview' },
  { id: 'my-stays',          label: 'My Stays' },
  { id: 'my-preferences',    label: 'My Preferences' },
  { id: 'my-experiences',    label: 'Saved Experiences' },
  { id: 'my-profile',        label: 'Personal Details' },
  { id: 'my-communications', label: 'Communications' },
  { id: 'my-security',       label: 'Security' },
  { id: 'eldorado-cares',    label: 'Eldorado Cares' },
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

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem clamp(1rem,4vw,2.5rem) 4rem', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2.5rem', alignItems: 'start' }}>
      {/* Sidebar */}
      <aside style={{ position: 'sticky', top: 140 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.25rem', color: 'var(--navy)', fontWeight: 500 }}>{displayName}</div>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: '0.2rem' }}>My Eldorado</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              background: current === item.id ? 'var(--navy)' : 'transparent',
              color: current === item.id ? 'var(--ivory)' : 'rgba(13,27,42,0.6)',
              border: 'none', borderRadius: 3, padding: '0.65rem 0.9rem',
              textAlign: 'left', fontFamily: "'Jost',sans-serif", fontSize: '0.82rem',
              cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.15s',
            }}>
              {item.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid rgba(13,27,42,0.1)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
            <button onClick={handleSignOut} style={{
              background: 'transparent', color: 'rgba(13,27,42,0.4)', border: 'none',
              borderRadius: 3, padding: '0.65rem 0.9rem', textAlign: 'left',
              fontFamily: "'Jost',sans-serif", fontSize: '0.82rem', cursor: 'pointer',
              letterSpacing: '0.04em', width: '100%',
            }}>
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
