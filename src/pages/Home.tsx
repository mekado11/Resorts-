import { useEffect, useRef, useState } from 'react';

// ── Scroll-triggered fade-up hook ──────────────────────────────────────────
function useFadeUp(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// Animated section wrapper
function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useFadeUp();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

interface HomeProps { setPage: (p: string) => void; }

export default function Home({ setPage }: HomeProps) {
  const nav = (p: string) => { setPage(p); window.scrollTo(0, 0); };

  // Hero entrance state
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { n: '90',  l: 'Rooms & Suites' },
    { n: '6',   l: 'Floor Levels' },
    { n: '380', l: 'Premier League Matches Per Season' },
    { n: '5★',  l: 'Standard of Service' },
  ];

  const experiences = [
    { tag: 'Culinary Arts',   title: 'The Table',          desc: 'Nigerian haute cuisine reimagined — afang, jollof, banga and Cross River seafood plated at Michelin standard.', img: 'afang-fine-dining.jpg', page: 'dining' },
    { tag: 'Spa & Wellness',  title: 'The Still Room',     desc: 'Where stillness is the luxury. Limestone walls, lily petal baths, and ancient West African healing traditions.', img: 'hero-spa.jpg', page: 'experiences' },
    { tag: 'Celebrations',    title: 'Ekom Iban Pavilion', desc: "Nigeria's premier cultural wedding pavilion — Ibibio tradition elevated to black-tie grandeur.", img: 'hero-wedding.jpg', page: 'experiences' },
    { tag: 'Sport & Society', title: "Gaffer's Club",      desc: 'Every Premier League fixture, every Champions League night — broadcast in cinematic clarity with premium service.', img: 'hero-theater.jpg', page: 'experiences' },
  ];

  const ease = 'cubic-bezier(0.16,1,0.3,1)';

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        height: '100vh',
        minHeight: 640,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Background — Ken Burns zoom */}
        <div className="hero-zoom" style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/assets/entrance-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,27,42,0.88) 0%, rgba(13,27,42,0.42) 50%, rgba(13,27,42,0.12) 100%)',
        }} />

        {/* Hero text — staggered entrance */}
        <div style={{
          position: 'absolute',
          bottom: '7rem',
          left: 0,
          right: 0,
          zIndex: 2,
          padding: '0 5vw',
          maxWidth: 860,
        }}>
          {/* Thin gold rule — slides in first */}
          <div style={{
            width: heroReady ? 48 : 0,
            height: 1,
            background: 'var(--gold)',
            marginBottom: '1.25rem',
            transition: `width 0.7s ${ease}`,
          }} />

          {/* Headline — fades up */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3.5rem, 6.8vw, 6.2rem)',
            fontWeight: 300,
            color: 'var(--ivory)',
            lineHeight: 1.08,
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? 'translateY(0)' : 'translateY(28px)',
            transition: `opacity 1s ${ease} 200ms, transform 1s ${ease} 200ms`,
          }}>
            Where West Africa<br />Meets <em>Timeless</em> Elegance
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 'clamp(1rem, 1.6vw, 1.18rem)',
            fontWeight: 300,
            color: 'rgba(250,248,242,0.75)',
            maxWidth: 520,
            marginBottom: '2.5rem',
            lineHeight: 1.9,
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 1s ${ease} 450ms, transform 1s ${ease} 450ms`,
          }}>
            Nigeria's most distinguished luxury hotel, rising along the Lagos–Calabar Coastal Road. A new landmark of elegance, heritage, and an unprecedented standard of care.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap',
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 1s ${ease} 680ms, transform 1s ${ease} 680ms`,
          }}>
            <button className="btn-primary" onClick={() => nav('rooms')}>Explore Suites</button>
            <button className="btn-ghost" onClick={() => nav('experiences')}>Discover Experiences</button>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 2,
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          opacity: heroReady ? 1 : 0,
          transition: `opacity 1.2s ${ease} 1200ms`,
        }}>
          <div style={{ width: 36, height: 1, background: 'rgba(201,168,76,0.5)' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.75)' }}>Scroll to Explore</span>
          <div style={{ width: 36, height: 1, background: 'rgba(201,168,76,0.5)' }} />
        </div>
      </section>

      {/* ── Brand statement ── */}
      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <Reveal>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <p className="pull-quote">"Eldorado Welcomes You — to a place where every detail is an act of devotion, every room a private world, every moment an irreplaceable memory."</p>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
        </Reveal>
      </section>

      {/* ── Stats ── */}
      <section className="section section-navy">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(3.1rem,7.4vw,6.2rem)', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,248,242,0.55)', marginTop: '0.75rem' }}>{s.l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Journey teaser ── */}
      <section style={{
        background: 'var(--navy)',
        padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,5vw,5rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
      }}>
        <Reveal style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '0.6rem' }}>
            The Journey to Opening
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem,5vw,3.7rem)', color: 'var(--gold)', fontWeight: 300, lineHeight: 1 }}>25%</span>
            <span style={{ fontSize: '0.87rem', color: 'rgba(250,248,242,0.4)', letterSpacing: '0.1em' }}>Complete</span>
          </div>
          <div style={{ height: 1.5, background: 'rgba(201,168,76,0.15)', borderRadius: 2, maxWidth: 320, marginBottom: '0.85rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '25%', background: 'var(--gold)', borderRadius: 2 }} />
          </div>
          <p style={{ fontSize: '1.02rem', color: 'rgba(250,248,242,0.45)', lineHeight: 1.75, maxWidth: 400, fontStyle: 'italic' }}>
            Land acquired. Architecture complete. Survey and permitting underway.
          </p>
        </Reveal>
        <button className="btn-ghost" onClick={() => nav('journey')} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          Follow the Journey →
        </button>
      </section>

      {/* ── Grand Lobby ── */}
      <section className="section section-ivory">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <img src="/assets/room-comfort.jpg" alt="The Grand Lobby" style={{ width: '100%', borderRadius: 4, objectFit: 'cover', height: 480 }} />
          </Reveal>
          <Reveal delay={150}>
            <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">The Heart of the Hotel</span></div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.2rem,4.3vw,3.5rem)', fontWeight: 300, marginBottom: '1.25rem' }}>The Grand Lobby</h2>
            <p style={{ fontSize: '1.09rem', lineHeight: 1.9, marginBottom: '1rem', color: 'rgba(13,27,42,0.75)' }}>Your first impression of Eldorado is one you will carry for a lifetime. The Grand Lobby rises across a double-height atrium dressed in Akwa Ibom limestone, polished Iroko timber columns, and hand-cast bronze chandeliers from Calabar craftsmen.</p>
            <p style={{ fontSize: '1.09rem', lineHeight: 1.9, color: 'rgba(13,27,42,0.75)', marginBottom: '2rem' }}>Our lobby concierge desk operates twenty-four hours. From the moment you arrive, you are not checked in — you are received.</p>
            <button className="btn-navy" onClick={() => nav('contact')}>Plan Your Arrival</button>
          </Reveal>
        </div>
      </section>

      {/* ── Experiences grid ── */}
      <section className="section section-cream">
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.5rem,5vw,3.7rem)', fontWeight: 300 }}>Signature Experiences</h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
          {experiences.map((e, i) => (
            <Reveal key={e.title} delay={i * 80}>
              <div className="room-card" onClick={() => nav(e.page)} style={{ cursor: 'pointer' }}>
                <img src={`/assets/${e.img}`} alt={e.title} className="room-card-img" />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.74rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>{e.tag}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.74rem', fontWeight: 500, marginBottom: '0.75rem' }}>{e.title}</div>
                  <p style={{ fontSize: '1.09rem', lineHeight: 1.75, color: 'rgba(13,27,42,0.7)' }}>{e.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Aerial night ── */}
      <section style={{ position: 'relative', height: '55vh', minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/aerial-night.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,42,0.58)' }} />
        <Reveal style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>Rising on the Coastal Road</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.2rem,5vw,3.7rem)', fontWeight: 300, color: 'var(--ivory)' }}>A New Landmark on the<br />Lagos-Calabar Coastal Road</h2>
        </Reveal>
      </section>
    </div>
  );
}
