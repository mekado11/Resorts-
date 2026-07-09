import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavProps {
  currentPage: string;
  setPage: (page: string) => void;
}

// Pages with a dark hero image behind the nav — transparent nav looks good here
const HERO_PAGES = ['home'];

export default function Nav({ currentPage, setPage }: NavProps) {
  const { user, signOut, displayName } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setAccountOpen(false);
    setPage('home');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const nav = (page: string) => { setPage(page); setMobileOpen(false); window.scrollTo(0, 0); };

  const links = [
    { id: 'home',        label: 'Home' },
    { id: 'rooms',       label: 'Rooms & Suites' },
    { id: 'dining',      label: 'Dining' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'membership',  label: 'Membership' },
    { id: 'journey',         label: 'Our Journey' },
    { id: 'eldorado-cares',  label: 'Eldorado Cares' },
    { id: 'capital',         label: 'Private Capital' },
    { id: 'contact',         label: 'Contact' },
  ];

  const isDark = !HERO_PAGES.includes(currentPage) || scrolled;

  return (
    <>
      {/* Opening Soon ribbon */}
      <div style={{
        position: 'fixed', top: 104, left: 0, right: 0, zIndex: 90,
        background: 'rgba(13,27,42,0.82)', backdropFilter: 'blur(6px)',
        textAlign: 'center', padding: '0.55rem 1rem',
        fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.25em',
        color: '#fff', textTransform: 'uppercase',
        borderBottom: '1px solid rgba(201,168,76,0.3)',
      }}>
        UYO · AKWA IBOM · NIGERIA — OPENING SOON
      </div>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 104, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1rem, 4vw, 4rem)',
        transition: 'background 400ms ease, box-shadow 400ms ease',
        ...(isDark ? {
          background: 'rgba(13,27,42,0.96)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 1px 0 rgba(201,168,76,0.2)',
        } : { background: 'transparent' }),
      }}>
        {/* Logo */}
        <div onClick={() => nav('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img src="/assets/logo-white.png" alt="Heights of Eldorado"
            style={{ height: isMobile ? 56 : 88, width: 'auto' }} />
        </div>

        {/* Desktop links — hidden on mobile via JS */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 1.8vw, 2rem)' }}>
            {links.map(l => (
              <span key={l.id} onClick={() => nav(l.id)} style={{
                fontFamily: "'Jost',sans-serif", fontSize: '0.78rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: currentPage === l.id ? 'var(--gold)' : 'rgba(250,248,242,0.85)',
                cursor: 'pointer', transition: 'color 0.2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = currentPage === l.id ? 'var(--gold)' : 'rgba(250,248,242,0.85)')}>
                {l.label}
              </span>
            ))}
            {/* Auth — Sign In or account dropdown */}
            {user ? (
              <div ref={accountRef} style={{ position: 'relative' }}>
                <button onClick={() => setAccountOpen(o => !o)} style={{
                  background: 'none', border: '1px solid rgba(250,248,242,0.35)', borderRadius: 3,
                  padding: '0.55rem 0.95rem', color: 'rgba(250,248,242,0.9)', fontSize: '0.72rem',
                  letterSpacing: '0.1em', fontFamily: "'Jost',sans-serif", cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap',
                }}>
                  {displayName}
                  <span style={{ fontSize: '0.55rem', opacity: 0.6 }}>▼</span>
                </button>
                {accountOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, background: 'var(--ivory)',
                    borderRadius: 3, boxShadow: '0 4px 20px rgba(13,27,42,0.18)', minWidth: 180, zIndex: 200, overflow: 'hidden',
                  }}>
                    {[
                      { id: 'my-eldorado', label: 'My Eldorado' },
                      { id: 'my-stays', label: 'My Stays' },
                      { id: 'my-preferences', label: 'My Preferences' },
                      { id: 'my-profile', label: 'Profile' },
                    ].map(item => (
                      <button key={item.id} onClick={() => { nav(item.id); setAccountOpen(false); }} style={{
                        display: 'block', width: '100%', padding: '0.75rem 1rem', background: 'none',
                        border: 'none', textAlign: 'left', fontSize: '0.82rem', fontFamily: "'Jost',sans-serif",
                        color: 'var(--navy)', cursor: 'pointer', borderBottom: '1px solid rgba(13,27,42,0.06)',
                      }}>
                        {item.label}
                      </button>
                    ))}
                    <button onClick={handleSignOut} style={{
                      display: 'block', width: '100%', padding: '0.75rem 1rem', background: 'none',
                      border: 'none', textAlign: 'left', fontSize: '0.82rem', fontFamily: "'Jost',sans-serif",
                      color: 'rgba(13,27,42,0.45)', cursor: 'pointer',
                    }}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => nav('signin')} style={{
                background: 'none', border: '1px solid rgba(250,248,242,0.35)', borderRadius: 3,
                padding: '0.55rem 0.95rem', color: 'rgba(250,248,242,0.9)', fontSize: '0.72rem',
                letterSpacing: '0.1em', fontFamily: "'Jost',sans-serif", cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                Sign In
              </button>
            )}

            <button className="btn-primary" onClick={() => nav('rooms')}
              style={{ padding: '0.75rem 1.6rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
              Reserve
            </button>
          </div>
        )}

        {/* Mobile hamburger — only on mobile */}
        {isMobile && (
          <div onClick={() => setMobileOpen(true)}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: '0.5rem' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: 24, height: 1.5, background: 'var(--ivory)' }} />
            ))}
          </div>
        )}
      </nav>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(13,27,42,0.98)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1.75rem',
          overflowY: 'auto',
        }}>
          {/* Close button */}
          <span onClick={() => setMobileOpen(false)} style={{
            position: 'absolute', top: 24, right: 24,
            color: 'var(--ivory)', fontSize: '1.5rem', cursor: 'pointer',
            lineHeight: 1,
          }}>✕</span>

          {/* Logo in menu */}
          <img src="/assets/logo-white.png" alt="Heights of Eldorado"
            style={{ height: 40, width: 'auto', marginBottom: '0.5rem', opacity: 0.8 }} />

          {/* Divider */}
          <div style={{ width: 40, height: 1, background: 'rgba(201,168,76,0.4)' }} />

          {links.map(l => (
            <span key={l.id} onClick={() => nav(l.id)} style={{
              fontFamily: "'Jost',sans-serif", fontSize: '0.85rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: currentPage === l.id ? 'var(--gold)' : 'var(--ivory)',
              cursor: 'pointer',
              borderBottom: currentPage === l.id ? '1px solid rgba(201,168,76,0.4)' : 'none',
              paddingBottom: currentPage === l.id ? '0.15rem' : 0,
            }}>{l.label}</span>
          ))}

          <div style={{ width: 40, height: 1, background: 'rgba(201,168,76,0.4)', marginTop: '0.25rem' }} />

          <button className="btn-primary" onClick={() => nav('rooms')}
            style={{ marginTop: '0.25rem' }}>
            Reserve Now
          </button>
        </div>
      )}
    </>
  );
}
