interface CaresProps { setPage: (p: string) => void; }

const PILLARS = [
  {
    title: 'Opportunity',
    body: 'Helping young people access experiences, skills, and possibilities.',
  },
  {
    title: 'Exposure',
    body: 'Connecting children with chefs, engineers, artists, entrepreneurs, and professionals.',
  },
  {
    title: 'Community',
    body: 'Supporting organisations and programmes already doing meaningful work.',
  },
];

const PROGRAMMES_WITH_IMAGES = [
  {
    title: 'Boys and Girls Programmes',
    body: 'Creating safe, structured environments where young people can learn, grow, and belong.',
    img: '/assets/cares-hero.jpg',
  },
  {
    title: 'Mentorship and Career Exposure',
    body: 'Connecting students directly with professionals across hospitality, business, and the creative industries.',
    img: '/assets/cares-mentorship.jpg',
  },
  {
    title: 'Creative Arts and Sport',
    body: 'Supporting expression, discipline, and teamwork through culture, music, and athletics.',
    img: '/assets/cares-arts.jpg',
  },
  {
    title: 'Skills and Hospitality Opportunities',
    body: 'Building practical skills that open doors to employment and entrepreneurship in the community.',
    img: '/assets/cares-sport.jpg',
  },
];

export default function EldoradoCares({ setPage }: CaresProps) {
  return (
    <div style={{ background: 'var(--ivory)' }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/assets/cares-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,27,42,0.88) 45%, rgba(13,27,42,0.35) 100%)' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(3rem,8vw,6rem) clamp(2rem,8vw,7rem)', maxWidth: 680 }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.75)', marginBottom: '1.5rem' }}>
            Eldorado Cares
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(2.8rem,6vw,5.5rem)',
            fontWeight: 300,
            color: 'var(--ivory)',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}>
            A beautiful stay<br />
            should leave something<br />
            beautiful behind.
          </h1>
          <p style={{ fontSize: 'clamp(0.9rem,1.5vw,1.05rem)', color: 'rgba(250,248,242,0.7)', lineHeight: 1.85, maxWidth: 520, marginBottom: '2.5rem' }}>
            Through Eldorado Cares, we intend to support opportunities for boys and girls
            in the communities around us — using hospitality, mentorship, creativity, sport,
            and exposure to help young people see a wider future.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => { document.getElementById('cares-impact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-primary"
              style={{ padding: '0.9rem 2rem', fontSize: '0.72rem' }}
            >
              See Our Impact
            </button>
            <button
              onClick={() => setPage('contact')}
              style={{
                padding: '0.9rem 2rem',
                border: '1px solid rgba(250,248,242,0.4)',
                borderRadius: 3,
                background: 'transparent',
                color: 'rgba(250,248,242,0.85)',
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: "'Jost',sans-serif",
                cursor: 'pointer',
              }}
            >
              Get Involved
            </button>
          </div>
        </div>
      </div>

      {/* ── Why We Care ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 4rem' }}>
            <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: 'var(--navy)', marginBottom: '1.25rem' }}>
              Why We Care
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(13,27,42,0.65)', lineHeight: 1.9 }}>
              Eldorado is being built in a community, not apart from one. We believe the
              success of the hotel should create opportunity beyond our doors.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.5rem' }}>
            {PILLARS.map((p, i) => (
              <div key={p.title} style={{
                background: '#fff',
                border: '1px solid rgba(13,27,42,0.08)',
                borderTop: `3px solid ${i === 0 ? '#C9A84C' : i === 1 ? '#20808D' : '#0D1B2A'}`,
                borderRadius: 5,
                padding: '2rem 1.75rem',
              }}>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: 'var(--navy)',
                  marginBottom: '0.75rem',
                }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.6)', lineHeight: 1.8 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Where Every Stay Can Reach Further ── */}
      <section id="cares-impact" style={{
        background: 'var(--navy)',
        padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 3.5rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '1rem' }}>
              Our Reach
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: 'var(--ivory)', marginBottom: '1.25rem' }}>
              Where Every Stay<br />Can Reach Further
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(250,248,242,0.6)', lineHeight: 1.9 }}>
              When you stay with Eldorado, dine with us, attend an event, or become part of
              our membership community — you become part of a larger story.
            </p>
          </div>

          {/* Impact counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
            {[
              { count: '0', label: 'Young lives supported' },
              { count: '0', label: 'Community programmes' },
              { count: '0', label: 'Volunteer hours' },
            ].map(stat => (
              <div key={stat.label} style={{
                textAlign: 'center',
                padding: '2rem 1.5rem',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 5,
                background: 'rgba(250,248,242,0.03)',
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '3.5rem',
                  fontWeight: 300,
                  color: 'var(--ivory)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  {stat.count}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(250,248,242,0.45)', letterSpacing: '0.1em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(250,248,242,0.3)', fontStyle: 'italic', lineHeight: 1.7 }}>
              These figures will be updated as our community work begins.
            </p>
          </div>
        </div>
      </section>

      {/* ── What We Intend to Support ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem)', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 3.5rem' }}>
            <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: 'var(--navy)' }}>
              What We Intend to Support
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.75rem' }}>
            {PROGRAMMES_WITH_IMAGES.map((prog, i) => (
              <div key={prog.title} style={{
                background: '#fff',
                border: '1px solid rgba(13,27,42,0.07)',
                borderRadius: 6,
                overflow: 'hidden',
              }}>
                {/* Programme image */}
                {prog.img && (
                  <div style={{
                    height: 180,
                    backgroundImage: `url('${prog.img}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(13,27,42,0.25) 100%)' }} />
                  </div>
                )}
                <div style={{ padding: '1.5rem 1.5rem 1.75rem' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: '1px solid rgba(201,168,76,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '0.85rem',
                  }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '0.9rem', color: '#C9A84C', fontWeight: 600 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--navy)',
                    marginBottom: '0.6rem',
                  }}>
                    {prog.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(13,27,42,0.6)', lineHeight: 1.8 }}>{prog.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Promise ── */}
      <section style={{
        padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,5rem)',
        background: 'var(--ivory)',
        borderTop: '1px solid rgba(13,27,42,0.08)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 300, color: 'var(--navy)', marginBottom: '1.5rem' }}>
            Our Promise
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(13,27,42,0.65)', lineHeight: 2, fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic' }}>
            We do not want Eldorado Cares to become a page of promises and photographs.
            As our work begins, we will return here with names, numbers, stories,
            partnerships, and proof.
          </p>
        </div>
      </section>

      {/* ── Closing ── */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', marginBottom: '1.25rem' }}>
            The Bigger Picture
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(2rem,5vw,3.5rem)',
            fontWeight: 300,
            color: 'var(--ivory)',
            lineHeight: 1.2,
            marginBottom: '1.75rem',
          }}>
            The hotel is only part<br />of what we hope to build.
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(250,248,242,0.6)', lineHeight: 1.95, maxWidth: 640, margin: '0 auto 2.5rem' }}>
            We want young people to look at Eldorado and see more than a beautiful place.
            We want them to see careers, ideas, businesses, possibilities, and evidence
            that something extraordinary can be built here.
          </p>
          <button
            onClick={() => setPage('journey')}
            className="btn-primary"
            style={{ padding: '0.9rem 2.25rem', fontSize: '0.72rem' }}
          >
            Follow Our Journey
          </button>
        </div>
      </section>

    </div>
  );
}
