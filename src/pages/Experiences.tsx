interface ExperienceItem {
  tag: string;
  title: string;
  sub: string;
  desc: string;
  img: string;
  flip: boolean;
}

const items: ExperienceItem[] = [
  {
    tag: 'Spa & Wellness',
    title: 'The Still Room',
    sub: 'A sanctuary where the world grows quiet',
    desc: 'Limestone walls, lily petal baths, and master therapists trained in ancient West African healing traditions, refined for the modern world. Eight treatment rooms, a heated mineral pool, and a meditation garden enclosed by tropical greenery.',
    img: 'hero-spa.jpg',
    flip: false,
  },
  {
    tag: 'Celebrations',
    title: 'Ekom Iban Cultural Wedding Pavilion',
    sub: 'Where tradition meets grandeur',
    desc: "Nigeria's premier venue for cultural weddings. The Ekom Iban Pavilion accommodates 500 guests and is designed to honour Ibibio traditional marriage rites — from the Nkuho ceremony to the formal reception, planned by our dedicated cultural events team.",
    img: 'hero-wedding.jpg',
    flip: true,
  },
  {
    tag: 'Sport & Society',
    title: "Gaffer's Club — Premier League Watch Parties",
    sub: 'Every match. Every moment. Cinematic.',
    desc: "The ultimate Premier League experience in Akwa Ibom State. Massive screens, surround sound, dedicated match-day menu, and Eldorado service. VIP tables bookable per season. Corporate hospitality packages available for 2026/27.",
    img: 'hero-theater.jpg',
    flip: false,
  },
  {
    tag: 'Events & Banqueting',
    title: 'The Grand Ballroom',
    sub: 'Timeless architecture. Understated luxury.',
    desc: 'A space for life\'s most unforgettable moments. The Grand Ballroom seats 450 guests banquet style across 700–850 sqm of marble floor, beneath 8.5–10m ceilings fitted with crystal chandeliers. Divisible into two or three independent sections. Full backstage, VIP lounge, bridal suite access, and a separate service entrance.',
    img: 'eldorado-ballroom.jpg',
    flip: true,
  },
  {
    tag: 'Fitness & Wellness',
    title: 'The Eldorado Fitness Centre',
    sub: 'Stronger today. Better every day.',
    desc: 'A full-service gym designed for the serious guest. Strength training, cardio, functional training zone, and an indoor sprint track — all with floor-to-ceiling windows overlooking tropical gardens. Complemented by a sauna, steam room, yoga studio, locker rooms, and a refreshment bar. Personal trainers available on request. Open 24 hours.',
    img: 'eldorado-gym.jpg',
    flip: false,
  },
];

export default function Experiences() {
  return (
    <div>
      <div style={{ position:'relative', height:'60vh', minHeight:400, display:'flex', alignItems:'flex-end', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/hero-wedding.jpg')", backgroundSize:'cover', backgroundPosition:'center' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(13,27,42,0.92) 0%,rgba(13,27,42,0.3) 100%)' }} />
        <div style={{ position:'relative', zIndex:2, padding:'4rem clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.75rem' }}>Signature Experiences</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.5rem,5vw,4.5rem)', fontWeight:300, color:'var(--ivory)' }}>Beyond the Room</h1>
        </div>
      </div>

      {items.map((e) => (
        <section key={e.title} className="section section-ivory">
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr 1fr',
            gap:'4rem',
            alignItems:'center',
            maxWidth:1200,
            margin:'0 auto',
          }}>
            {e.flip ? (
              <>
                <div>
                  <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">{e.tag}</span></div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:300, marginBottom:'0.5rem' }}>{e.title}</h2>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', color:'rgba(13,27,42,0.55)', marginBottom:'1.25rem' }}>{e.sub}</p>
                  <p style={{ lineHeight:1.9, color:'rgba(13,27,42,0.75)' }}>{e.desc}</p>
                </div>
                <img src={`/assets/${e.img}`} alt={e.title} style={{ width:'100%', height:440, objectFit:'cover', borderRadius:4 }} />
              </>
            ) : (
              <>
                <img src={`/assets/${e.img}`} alt={e.title} style={{ width:'100%', height:440, objectFit:'cover', borderRadius:4 }} />
                <div>
                  <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">{e.tag}</span></div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:300, marginBottom:'0.5rem' }}>{e.title}</h2>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', color:'rgba(13,27,42,0.55)', marginBottom:'1.25rem' }}>{e.sub}</p>
                  <p style={{ lineHeight:1.9, color:'rgba(13,27,42,0.75)' }}>{e.desc}</p>
                </div>
              </>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
