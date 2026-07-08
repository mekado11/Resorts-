import { useState, useEffect } from 'react';

interface NavProps {
  currentPage: string;
  setPage: (page: string) => void;
}

export default function Nav({ currentPage, setPage }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = (page: string) => { setPage(page); setMobileOpen(false); window.scrollTo(0,0); };

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Rooms & Suites' },
    { id: 'dining', label: 'Dining' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'membership', label: 'Membership' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Opening Soon ribbon */}
      <div style={{ position:'fixed', top:80, left:0, right:0, zIndex:90,
        background:'rgba(13,27,42,0.82)', backdropFilter:'blur(6px)',
        textAlign:'center', padding:'0.55rem 1rem',
        fontWeight:700, fontSize:'0.72rem', letterSpacing:'0.25em',
        color:'#fff', textTransform:'uppercase',
        borderBottom:'1px solid rgba(201,168,76,0.3)' }}>
        UYO · AKWA IBOM · NIGERIA — OPENING SOON
      </div>

      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        height:80, display:'flex', alignItems:'center',
        justifyContent:'space-between',
        padding:'0 clamp(1.5rem,5vw,4rem)',
        transition:'background 400ms ease, box-shadow 400ms ease',
        ...(scrolled ? {
          background:'rgba(13,27,42,0.96)',
          backdropFilter:'blur(16px)',
          boxShadow:'0 1px 0 rgba(201,168,76,0.2)'
        } : { background:'transparent' })
      }}>
        {/* Logo */}
        <div onClick={() => nav('home')} style={{ cursor:'pointer', display:'flex', alignItems:'center' }}>
          <img src="/assets/logo-white.png" alt="Heights of Eldorado"
            style={{ height:48, width:'auto' }} />
        </div>

        {/* Desktop links */}
        <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}
          className="hidden md:flex">
          {links.map(l => (
            <span key={l.id} onClick={() => nav(l.id)} style={{
              fontFamily:"'Jost',sans-serif", fontSize:'0.68rem',
              letterSpacing:'0.18em', textTransform:'uppercase',
              color: currentPage===l.id ? 'var(--gold)' : 'rgba(250,248,242,0.85)',
              cursor:'pointer', transition:'color 0.2s',
            }}
            onMouseEnter={e=>(e.currentTarget.style.color='var(--gold)')}
            onMouseLeave={e=>(e.currentTarget.style.color=currentPage===l.id?'var(--gold)':'rgba(250,248,242,0.85)')}>
              {l.label}
            </span>
          ))}
          <button className="btn-primary" onClick={() => nav('rooms')}
            style={{ padding:'0.65rem 1.4rem', fontSize:'0.65rem' }}>
            Reserve
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden" onClick={() => setMobileOpen(true)}
          style={{ cursor:'pointer', display:'flex', flexDirection:'column', gap:5 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ display:'block', width:24, height:1.5, background:'var(--ivory)' }} />
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position:'fixed', inset:0, zIndex:200,
          background:'rgba(13,27,42,0.98)',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:'2rem'
        }}>
          <span onClick={() => setMobileOpen(false)} style={{
            position:'absolute', top:24, right:24,
            color:'var(--ivory)', fontSize:'1.5rem', cursor:'pointer'
          }}>✕</span>
          {links.map(l => (
            <span key={l.id} onClick={() => nav(l.id)} style={{
              fontFamily:"'Jost',sans-serif", fontSize:'0.9rem',
              letterSpacing:'0.2em', textTransform:'uppercase',
              color:'var(--ivory)', cursor:'pointer'
            }}>{l.label}</span>
          ))}
          <button className="btn-primary" onClick={() => nav('rooms')}>Reserve Now</button>
        </div>
      )}
    </>
  );
}
