interface FooterProps { setPage: (p: string) => void; }

export default function Footer({ setPage }: FooterProps) {
  const nav = (p: string) => { setPage(p); window.scrollTo(0,0); };
  return (
    <footer style={{ background:'var(--navy)', color:'rgba(250,248,242,0.7)', padding:'4rem clamp(1.5rem,5vw,5rem) 2rem' }}>

      {/* Opening banner */}
      <div style={{
        borderTop: '1px solid rgba(201,168,76,0.3)',
        borderBottom: '1px solid rgba(201,168,76,0.3)',
        padding: '1.75rem 0',
        marginBottom: '3rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(201,168,76,0.6)', marginBottom:'0.6rem' }}>
          Status
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.5rem,3vw,2.2rem)',
          fontWeight: 300,
          color: 'var(--ivory)',
          letterSpacing: '0.04em',
          marginBottom: '0.6rem',
        }}>
          Now Open for Pre-Opening Reservations &amp; Enquiries
        </div>
        <p style={{ fontSize:'0.85rem', color:'rgba(250,248,242,0.45)', lineHeight:1.8, maxWidth:500, margin:'0 auto' }}>
          Eldorado is accepting advance reservations and partnership enquiries ahead of our Grand Opening. Contact our team to begin the conversation.
        </p>
        <button
          onClick={() => nav('contact')}
          className="btn-primary"
          style={{ marginTop:'1.25rem', fontSize:'0.68rem' }}
        >
          Submit an Enquiry
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2.5rem', marginBottom:'3rem' }}>
        <div>
          <img src="/assets/logo-gold.png" alt="Heights of Eldorado" style={{ height:52, marginBottom:'1rem' }} />
          <p style={{ fontSize:'0.82rem', lineHeight:1.8 }}>
            Luxury Hotels &amp; Resorts.<br />
            Lagos–Calabar Coastal Road,<br />
            Uyo, Akwa Ibom State, Nigeria.
          </p>
        </div>
        <div>
          <div style={{ fontSize:'0.6rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'1rem' }}>Navigate</div>
          {['home','rooms','dining','experiences','membership','journey','capital','contact'].map(p => (
            <div key={p} onClick={() => nav(p)} style={{ fontSize:'0.82rem', marginBottom:'0.5rem', cursor:'pointer', textTransform:'capitalize' }}
              onMouseEnter={e => (e.currentTarget.style.color='var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(250,248,242,0.7)')}>
              {p === 'rooms' ? 'Rooms & Suites'
                : p === 'journey' ? 'Our Journey'
                : p === 'capital' ? 'Private Capital'
                : p.charAt(0).toUpperCase()+p.slice(1)}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize:'0.6rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'1rem' }}>Contact</div>
          <p style={{ fontSize:'0.82rem', lineHeight:2 }}>
            Uyo, Akwa Ibom State<br />
            <span onClick={() => nav('contact')} style={{ cursor:'pointer' }}>Reservations &amp; Enquiries</span><br />
            <span onClick={() => nav('contact')} style={{ cursor:'pointer' }}>Press &amp; Media</span><br />
            <span onClick={() => nav('contact')} style={{ cursor:'pointer' }}>Partnerships</span>
          </p>
        </div>
      </div>

      <div style={{ borderTop:'1px solid rgba(201,168,76,0.15)', paddingTop:'1.5rem', display:'flex', flexWrap:'wrap', gap:'1rem', justifyContent:'space-between', fontSize:'0.72rem', opacity:0.5 }}>
        <span>© 2026 Heights of Eldorado Luxury Hotels &amp; Resorts Ltd. All rights reserved.</span>
        <span>Uyo · Akwa Ibom · Nigeria</span>
      </div>
    </footer>
  );
}
