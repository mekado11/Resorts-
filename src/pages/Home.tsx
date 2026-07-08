interface HomeProps { setPage: (p: string) => void; }

export default function Home({ setPage }: HomeProps) {
  const nav = (p: string) => { setPage(p); window.scrollTo(0,0); };

  const stats = [
    { n: '90',  l: 'Rooms & Suites' },
    { n: '6',   l: 'Floor Levels' },
    { n: '380', l: 'Premier League Matches Per Season' },
    { n: '5★',  l: 'Standard of Service' },
  ];

  const experiences = [
    { tag:'Culinary Arts',   title:'The Table',          desc:'Nigerian haute cuisine reimagined — afang, jollof, banga and Cross River seafood plated at Michelin standard.', img:'afang-fine-dining.jpg', page:'dining' },
    { tag:'Spa & Wellness',  title:'The Still Room',     desc:'Where stillness is the luxury. Limestone walls, lily petal baths, and ancient West African healing traditions.', img:'hero-spa.jpg', page:'experiences' },
    { tag:'Celebrations',    title:'Ekom Iban Pavilion', desc:"Nigeria's premier cultural wedding pavilion — Ibibio tradition elevated to black-tie grandeur.", img:'hero-wedding.jpg', page:'experiences' },
    { tag:'Sport & Society', title:"Gaffer's Club",      desc:"Every Premier League fixture, every Champions League night — broadcast in cinematic clarity with premium service.", img:'hero-theater.jpg', page:'experiences' },
  ];

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
        {/* Background */}
        <div className="hero-zoom" style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/assets/entrance-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }} />
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,27,42,0.45) 0%, rgba(13,27,42,0.25) 50%, rgba(13,27,42,0.65) 100%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '0 2rem',
          width: '100%',
          maxWidth: 800,
        }}>
          {/* Large centered logo */}
          <img
            src="/assets/logo-white.png"
            alt="Heights of Eldorado"
            style={{
              height: 180,
              width: 'auto',
              marginBottom: '2rem',
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))',
            }}
          />

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 300,
            color: 'var(--ivory)',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
          }}>
            Where West Africa Meets <em>Timeless</em> Elegance
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
            fontWeight: 300,
            color: 'rgba(250,248,242,0.82)',
            maxWidth: 520,
            margin: '0 auto 2.5rem',
            lineHeight: 1.85,
          }}>
            Nigeria's most distinguished luxury hotel, rising along the Lagos-Calabar coastal road. Ninety rooms, six floors, one unprecedented standard of care.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => nav('rooms')}>Explore Suites</button>
            <button className="btn-ghost" onClick={() => nav('experiences')}>Discover Experiences</button>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 2,
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <div style={{ width: 36, height: 1, background: 'rgba(201,168,76,0.5)' }} />
          <span style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.75)' }}>Scroll to Explore</span>
          <div style={{ width: 36, height: 1, background: 'rgba(201,168,76,0.5)' }} />
        </div>
      </section>

      {/* ── Brand statement ── */}
      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
        <p className="pull-quote">"Eldorado Welcomes You — to a place where every detail is an act of devotion, every room a private world, every moment an irreplaceable memory."</p>
        <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
      </section>

      {/* ── Stats ── */}
      <section className="section section-navy">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.n}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,248,242,0.55)', marginTop: '0.75rem' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Grand Lobby ── */}
      <section className="section section-ivory">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
          <img src="/assets/room-comfort.jpg" alt="The Grand Lobby" style={{ width: '100%', borderRadius: 4, objectFit: 'cover', height: 480 }} />
          <div>
            <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">The Heart of the Hotel</span></div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 300, marginBottom: '1.25rem' }}>The Grand Lobby</h2>
            <p style={{ lineHeight: 1.9, marginBottom: '1rem', color: 'rgba(13,27,42,0.75)' }}>Your first impression of Eldorado is one you will carry for a lifetime. The Grand Lobby rises across a double-height atrium dressed in Akwa Ibom limestone, polished Iroko timber columns, and hand-cast bronze chandeliers from Calabar craftsmen.</p>
            <p style={{ lineHeight: 1.9, color: 'rgba(13,27,42,0.75)', marginBottom: '2rem' }}>Our lobby concierge desk operates twenty-four hours. From the moment you arrive, you are not checked in — you are received.</p>
            <button className="btn-navy" onClick={() => nav('contact')}>Plan Your Arrival</button>
          </div>
        </div>
      </section>

      {/* ── Experiences grid ── */}
      <section className="section section-cream">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300 }}>Signature Experiences</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
          {experiences.map(e => (
            <div key={e.title} className="room-card" onClick={() => nav(e.page)} style={{ cursor: 'pointer' }}>
              <img src={`/assets/${e.img}`} alt={e.title} className="room-card-img" />
              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>{e.tag}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', fontWeight: 500, marginBottom: '0.75rem' }}>{e.title}</div>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'rgba(13,27,42,0.7)' }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Aerial night ── */}
      <section style={{ position: 'relative', height: '55vh', minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/aerial-night.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,42,0.58)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>Rising on the Coastal Road</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 300, color: 'var(--ivory)' }}>A New Landmark on the<br />Lagos-Calabar Coastal Road</h2>
        </div>
      </section>
    </div>
  );
}
