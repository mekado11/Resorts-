import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavProps {
  currentPage: string;
  setPage: (page: string) => void;
}

const HERO_PAGES = ['home'];

// ─── Mega-menu data ─────────────────────────────────────────────────────────

const MENUS = {
  stay: {
    cols: [
      {
        heading: 'Rooms & Suites',
        links: [
          { label: 'Twin Room',            page: 'rooms' },
          { label: "Governor's Lounge",    page: 'rooms' },
          { label: 'Executive Room',       page: 'rooms' },
          { label: 'Eldorado Flagship',    page: 'rooms' },
          { label: 'View All Rooms',       page: 'rooms' },
        ],
      },
      {
        heading: 'Your Stay',
        links: [
          { label: 'Book a Room',          page: 'rooms' },
          { label: 'Airport Transfers',    page: 'contact' },
          { label: 'Guest Preferences',    page: 'my-preferences' },
          { label: 'My Eldorado',          page: 'my-eldorado' },
        ],
      },
    ],
    featured: {
      headline: 'Stay the Eldorado Way',
      sub: 'Every detail prepared before you arrive.',
      img: '/assets/hero-suite.jpg',
      cta: 'Reserve a Room',
      page: 'rooms',
    },
  },
  experience: {
    cols: [
      {
        heading: 'Dine',
        links: [
          { label: 'Restaurant',           page: 'dining', anchor: 'fine-dining' },
          { label: 'Casual Dining',        page: 'dining', anchor: 'casual-dining' },
          { label: 'Private Dining',       page: 'dining' },
          { label: "Chef's Table",         page: 'dining' },
          { label: 'Afternoon Tea',        page: 'dining', anchor: 'tea-at-eldorado' },
        ],
      },
      {
        heading: 'Discover',
        links: [
          { label: 'Spa — The Still Room', page: 'experiences' },
          { label: 'Culture & Heritage',   page: 'experiences' },
          { label: 'Private Experiences',  page: 'experiences' },
          { label: 'Events',               page: 'experiences' },
          { label: 'Explore Uyo',          page: 'experiences' },
        ],
      },
    ],
    featured: {
      headline: 'Beyond the Ordinary',
      sub: 'Eight worlds. Each one unforgettable.',
      img: '/assets/hero-spa.jpg',
      cta: 'Explore Experiences',
      page: 'experiences',
    },
  },
  membership: {
    cols: [
      {
        heading: 'My Eldorado',
        links: [
          { label: 'Membership Overview',  page: 'membership' },
          { label: 'Member Benefits',      page: 'membership' },
          { label: 'Membership Tiers',     page: 'membership' },
          { label: 'My Account',           page: 'my-eldorado' },
        ],
      },
      {
        heading: 'Discover',
        links: [
          { label: 'Reserve',              page: 'membership' },
          { label: 'Estate',               page: 'membership' },
          { label: 'Pinnacle',             page: 'membership' },
        ],
      },
    ],
    featured: {
      headline: 'Belong to Eldorado',
      sub: 'Your stays, your preferences, remembered.',
      img: '/assets/eldorado-flagship-suite.jpg',
      cta: 'Explore Membership',
      page: 'membership',
    },
  },
  story: {
    cols: [
      {
        heading: 'Eldorado',
        links: [
          { label: 'Our Journey',          page: 'journey' },
          { label: 'Sustainability',        page: 'capital', anchor: 'sustainability' },
          { label: 'The People Behind Eldorado', page: 'journey' },
        ],
      },
      {
        heading: 'Community',
        links: [
          { label: 'Eldorado Cares',       page: 'eldorado-cares' },
          { label: 'Local Craft & Culture', page: 'experiences' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'Private Capital',      page: 'capital' },
          { label: 'Contact',              page: 'contact' },
        ],
      },
    ],
    featured: {
      headline: 'A Legacy in the Making',
      sub: 'Built with intention, rooted in community.',
      img: '/assets/entrance-hero.jpg',
      cta: 'Our Journey',
      page: 'journey',
    },
  },
};

type MenuKey = keyof typeof MENUS;

// Maps a current page to whichever menu section it belongs to (for persistent gold underline)
function isPageInMenu(menuId: MenuKey, page: string): boolean {
  return MENUS[menuId].cols.some(col => col.links.some(l => l.page === page));
}

const TOP_LINKS: { id: MenuKey; label: string }[] = [
  { id: 'stay',        label: 'Stay' },
  { id: 'experience',  label: 'Experience' },
  { id: 'membership',  label: 'Membership' },
  { id: 'story',       label: 'Our Story' },
];

export default function Nav({ currentPage, setPage }: NavProps) {
  const { user, signOut, displayName } = useAuth();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 1024);
  const [activeMenu, setActiveMenu]   = useState<MenuKey | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const megaRef   = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── scroll / resize ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── outside click account dropdown ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── outside click mega-menu ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const nav = (page: string, anchor?: string) => {
    setPage(page);
    setMobileOpen(false);
    setActiveMenu(null);
    setAccountOpen(false);
    if (anchor) {
      // wait for the target page to mount before scrolling to its section
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleMouseEnter = (id: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(id);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 180);
  };
  const handleMegaEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const handleSignOut = async () => {
    await signOut();
    setAccountOpen(false);
    setPage('home');
  };

  const isDark = !HERO_PAGES.includes(currentPage) || scrolled;

  // Initials for avatar
  const initials = displayName
    ? displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'ME';

  return (
    <>
      {/* ── Opening ribbon ── */}
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

      {/* ── Main nav bar ── */}
      <nav
        ref={megaRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: 104,
          transition: 'background 400ms ease, box-shadow 400ms ease',
          ...(isDark ? {
            background: 'rgba(13,27,42,0.97)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 1px 0 rgba(201,168,76,0.2)',
          } : { background: 'transparent' }),
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '100%', padding: '0 clamp(1.5rem, 4vw, 4rem)',
        }}>
          {/* Logo */}
          <div onClick={() => nav('home')} style={{ cursor: 'pointer', flexShrink: 0 }}>
            <img src="/assets/logo-white.png" alt="Heights of Eldorado"
              style={{ height: isMobile ? 72 : 162, width: 'auto' }} />
          </div>

          {/* Desktop centre links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1.4rem, 1.8vw, 2.5rem)' }}>
              {TOP_LINKS.map(link => (
                <div
                  key={link.id}
                  onMouseEnter={() => handleMouseEnter(link.id)}
                  onMouseLeave={handleMouseLeave}
                  style={{ position: 'relative', height: 104, display: 'flex', alignItems: 'center' }}
                >
                  <span style={{
                    fontFamily: "'Jost',sans-serif", fontSize: '0.85rem',
                    letterSpacing: '0.13em', textTransform: 'uppercase',
                    color: (activeMenu === link.id || isPageInMenu(link.id, currentPage))
                      ? '#C9A84C'
                      : 'rgba(250,248,242,0.9)',
                    cursor: 'pointer', transition: 'color 0.2s', whiteSpace: 'nowrap',
                    userSelect: 'none', fontWeight: 400,
                  }}>
                    {link.label}
                    <span style={{ fontSize: '0.48rem', marginLeft: '0.3rem', opacity: 0.5 }}>▼</span>
                  </span>
                  {/* Active / hover underline */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                    background: '#C9A84C',
                    opacity: (activeMenu === link.id || isPageInMenu(link.id, currentPage)) ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }} />
                </div>
              ))}
            </div>
          )}

          {/* Desktop right: MY ELDORADO / SIGN IN + RESERVE */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
              {user ? (
                <div ref={accountRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setAccountOpen(o => !o)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.55rem',
                      padding: '0.4rem 0.1rem',
                    }}
                  >
                    {/* Notification bell */}
                    <div style={{ position: 'relative', marginRight: '0.2rem' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="rgba(250,248,242,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="rgba(250,248,242,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {/* Avatar circle */}
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'rgba(201,168,76,0.18)', border: '1.5px solid rgba(201,168,76,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#C9A84C', letterSpacing: '0.05em' }}>
                        {initials}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.68rem', letterSpacing: '0.08em', color: 'rgba(250,248,242,0.82)', whiteSpace: 'nowrap' }}>
                      {displayName}
                    </span>
                    <span style={{ fontSize: '0.45rem', color: 'rgba(250,248,242,0.4)' }}>▼</span>
                  </button>

                  {accountOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 0.75rem)', right: 0,
                      background: 'var(--ivory)', borderRadius: 4,
                      boxShadow: '0 8px 32px rgba(13,27,42,0.18)',
                      minWidth: 200, zIndex: 300, overflow: 'hidden',
                      border: '1px solid rgba(13,27,42,0.08)',
                    }}>
                      {/* Account header */}
                      <div style={{ padding: '1rem 1.1rem 0.6rem', borderBottom: '1px solid rgba(13,27,42,0.07)' }}>
                        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', color: 'var(--navy)', fontWeight: 500 }}>{displayName}</div>
                        <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C' }}>My Eldorado</div>
                      </div>
                      {[
                        { id: 'my-eldorado',    label: 'Overview' },
                        { id: 'my-stays',       label: 'My Stays' },
                        { id: 'my-preferences', label: 'My Preferences' },
                        { id: 'my-profile',     label: 'Personal Details' },
                      ].map(item => (
                        <button key={item.id} onClick={() => nav(item.id)} style={{
                          display: 'block', width: '100%', padding: '0.7rem 1.1rem',
                          background: 'none', border: 'none', textAlign: 'left',
                          fontSize: '0.8rem', fontFamily: "'Jost',sans-serif",
                          color: 'var(--navy)', cursor: 'pointer',
                          borderBottom: '1px solid rgba(13,27,42,0.05)',
                        }}>
                          {item.label}
                        </button>
                      ))}
                      <button onClick={handleSignOut} style={{
                        display: 'block', width: '100%', padding: '0.7rem 1.1rem',
                        background: 'none', border: 'none', textAlign: 'left',
                        fontSize: '0.78rem', fontFamily: "'Jost',sans-serif",
                        color: 'rgba(13,27,42,0.4)', cursor: 'pointer',
                      }}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => nav('signin')} style={{
                  background: 'none', border: '1px solid rgba(250,248,242,0.3)',
                  borderRadius: 3, padding: '0.5rem 1rem',
                  color: 'rgba(250,248,242,0.82)', fontSize: '0.68rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontFamily: "'Jost',sans-serif", cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  Sign In
                </button>
              )}

              <button className="btn-primary" onClick={() => nav('rooms')}
                style={{ padding: '0.7rem 1.6rem', fontSize: '0.68rem', letterSpacing: '0.18em', whiteSpace: 'nowrap' }}>
                Reserve
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <div onClick={() => setMobileOpen(true)} style={{ cursor: 'pointer', padding: '0.5rem' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: 'block', width: 24, height: 1.5, background: 'var(--ivory)', marginBottom: i < 2 ? 5 : 0 }} />
              ))}
            </div>
          )}
        </div>

        {/* ── MEGA MENU PANEL ── */}
        {!isMobile && activeMenu && (
          <div
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'absolute', top: 104, left: 0, right: 0,
              background: 'rgba(13,27,42,0.98)', backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(201,168,76,0.15)',
              borderBottom: '1px solid rgba(201,168,76,0.15)',
              padding: '1.6rem clamp(1.5rem,5vw,5rem)',
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              zIndex: 99,
              animation: 'megaFadeIn 0.18s ease',
            }}
          >
            {/* Columns — each one self-contained, no stretching */}
            {MENUS[activeMenu].cols.map((col) => (
              <div key={col.heading} style={{ minWidth: 160, flexShrink: 0 }}>
                <div style={{
                  fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.6)', marginBottom: '0.75rem', fontFamily: "'Jost',sans-serif",
                  fontWeight: 600,
                }}>
                  {col.heading}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0rem' }}>
                  {col.links.map(link => (
                    <button
                      key={link.label}
                      onClick={() => nav(link.page, (link as { anchor?: string }).anchor)}
                      style={{
                        background: 'none', border: 'none', padding: '0.3rem 0',
                        textAlign: 'left', cursor: 'pointer',
                        fontFamily: "'Jost',sans-serif", fontSize: '1.05rem',
                        color: 'rgba(250,248,242,0.78)', letterSpacing: '0.02em',
                        transition: 'color 0.15s', lineHeight: 1.4,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,248,242,0.78)')}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Featured card — compact, self-contained */}
            {(() => {
              const f = MENUS[activeMenu].featured;
              return (
                <div
                  onClick={() => nav(f.page)}
                  style={{
                    position: 'relative', borderRadius: 5, overflow: 'hidden',
                    cursor: 'pointer', width: 200, flexShrink: 0,
                    minHeight: 160, alignSelf: 'stretch',
                  }}
                >
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url('${f.img}')`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.2) 55%)' }} />
                  <div style={{ position: 'absolute', bottom: '0.85rem', left: '0.9rem', right: '0.9rem' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.05rem', fontWeight: 400, color: 'var(--ivory)', marginBottom: '0.2rem', lineHeight: 1.2 }}>
                      {f.headline}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(250,248,242,0.5)', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                      {f.sub}
                    </div>
                    <div style={{
                      display: 'inline-block', padding: '0.32rem 0.8rem',
                      border: '1px solid rgba(201,168,76,0.55)', borderRadius: 2,
                      fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: '#C9A84C', fontFamily: "'Jost',sans-serif",
                    }}>
                      {f.cta}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </nav>

      {/* ── CSS for mega fade ── */}
      <style>{`
        @keyframes megaFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Mobile full-screen menu ── */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(13,27,42,0.99)',
          overflowY: 'auto', padding: '5rem 2rem 3rem',
        }}>
          <span onClick={() => setMobileOpen(false)} style={{
            position: 'absolute', top: 24, right: 24,
            color: 'var(--ivory)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1,
          }}>✕</span>

          <img src="/assets/logo-white.png" alt="Heights of Eldorado"
            style={{ height: 36, width: 'auto', marginBottom: '2rem', opacity: 0.7 }} />

          {/* Mobile accordion */}
          {TOP_LINKS.map(link => {
            const menu = MENUS[link.id];
            const isOpen = mobileExpanded === link.id;
            return (
              <div key={link.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.12)', marginBottom: '0.1rem' }}>
                <button
                  onClick={() => setMobileExpanded(isOpen ? null : link.id)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem 0', cursor: 'pointer',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.82rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: isOpen ? '#C9A84C' : 'var(--ivory)',
                  }}
                >
                  {link.label}
                  <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', color: 'rgba(250,248,242,0.4)' }}>▼</span>
                </button>
                {isOpen && (
                  <div style={{ paddingBottom: '1rem' }}>
                    {menu.cols.flatMap(col => col.links).map(l => (
                      <button key={l.label} onClick={() => nav(l.page, (l as { anchor?: string }).anchor)} style={{
                        display: 'block', width: '100%', background: 'none', border: 'none',
                        padding: '0.5rem 0.75rem', textAlign: 'left', cursor: 'pointer',
                        fontFamily: "'Jost',sans-serif", fontSize: '0.8rem',
                        color: 'rgba(250,248,242,0.55)', letterSpacing: '0.04em',
                      }}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {user ? (
              <>
                <button onClick={() => nav('my-eldorado')} style={{
                  background: 'none', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 3,
                  padding: '0.85rem 1.5rem', color: '#C9A84C',
                  fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                  fontFamily: "'Jost',sans-serif", cursor: 'pointer',
                }}>
                  My Eldorado
                </button>
                <button onClick={handleSignOut} style={{
                  background: 'none', border: 'none', padding: '0.5rem 0',
                  color: 'rgba(250,248,242,0.35)', fontSize: '0.72rem',
                  fontFamily: "'Jost',sans-serif", cursor: 'pointer', textAlign: 'left',
                  letterSpacing: '0.1em',
                }}>
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => nav('signin')} style={{
                background: 'none', border: '1px solid rgba(250,248,242,0.3)', borderRadius: 3,
                padding: '0.85rem 1.5rem', color: 'rgba(250,248,242,0.75)',
                fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                fontFamily: "'Jost',sans-serif", cursor: 'pointer',
              }}>
                Sign In
              </button>
            )}
            <button className="btn-primary" onClick={() => nav('rooms')}
              style={{ justifyContent: 'center' }}>
              Reserve Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
