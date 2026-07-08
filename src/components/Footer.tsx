interface FooterProps { setPage: (p: string) => void; }

export default function Footer({ setPage }: FooterProps) {
  const nav = (p: string) => { setPage(p); window.scrollTo(0,0); };
  return (
    <footer style={{ background:'var(--navy)', color:'rgba(250,248,242,0.7)', padding:'4rem clamp(1.5rem,5vw,5rem) 2rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2.5rem', marginBottom:'3rem' }}>
        <div>
          <img src="/assets/logo-gold.png" alt="Heights of Eldorado" style={{ height:52, marginBottom:'1rem' }} />
          <p style={{ fontSize:'0.82rem', lineHeight:1.8 }}>Luxury Hotels &amp; Resorts.<br/>Arriving at the Lagos-Calabar Coastal Road,<br/>Uyo, Akwa Ibom State, Nigeria.</p>
        </div>
        <div>
          <div style={{ fontSize:'0.6rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'1rem' }}>Navigate</div>
          {['home','rooms','dining','experiences','membership','contact'].map(p => (
            <div key={p} onClick={() => nav(p)} style={{ fontSize:'0.82rem', marginBottom:'0.5rem', cursor:'pointer', textTransform:'capitalize' }}
              onMouseEnter={e => (e.currentTarget.style.color='var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(250,248,242,0.7)')}>
              {p === 'rooms' ? 'Rooms & Suites' : p.charAt(0).toUpperCase()+p.slice(1)}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize:'0.6rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'1rem' }}>Contact</div>
          <p style={{ fontSize:'0.82rem', lineHeight:2 }}>
            Uyo, Akwa Ibom State<br/>
            <a href="mailto:info@obadear.com" style={{ color:'inherit' }}>info@obadear.com</a><br/>
            <span onClick={() => nav('contact')} style={{ cursor:'pointer' }}>Press Enquiries</span><br/>
            <span onClick={() => nav('contact')} style={{ cursor:'pointer' }}>Partnerships</span>
          </p>
        </div>
      </div>
      <div style={{ borderTop:'1px solid rgba(201,168,76,0.15)', paddingTop:'1.5rem', display:'flex', flexWrap:'wrap', gap:'1rem', justifyContent:'space-between', fontSize:'0.72rem', opacity:0.5 }}>
        <span>© 2026 Heights of Eldorado Luxury Hotels &amp; Resorts Ltd. All rights reserved.</span>
        <span>CAC Registered · Nigeria</span>
      </div>
    </footer>
  );
}
