import { useState } from 'react';
import DiningReservationModal, { type DiningType } from '../components/DiningReservationModal';

interface DiningProps { onToast: (msg: string) => void; }

export default function Dining({ onToast }: DiningProps) {
  const [reserveType, setReserveType] = useState<DiningType | null>(null);

  const venues = [
    { name:'The Table — Grand Restaurant', tag:'Flagship Dining', desc:'Nigerian haute cuisine at its apex. Afang, edikaikong, and banga soup reinterpreted through classical French technique. An eight-course tasting menu changes with the seasons of the Niger Delta.', img:'dining-room-v2.jpg' },
    { name:'Oro Lounge', tag:'All-Day Dining', desc:'From morning café service to late-night cocktails, Oro is the social heart of Eldorado. Lighter fare, Nigerian street food elevated, and a bar programme centred on palm-wine spirits and aged Nigerian gin.', img:'afang-fine-dining.jpg' },
    { name:"Gaffer's Grill", tag:'Sport & Casual', desc:'Signature burgers, suya platters, and jollof rice bowls — served on match days and evenings in the Gaffer\'s Club. Guinness on draft. Pepper soup on demand.', img:'jollof-fine-dining.jpg' },
    { name:'Private Dining Rooms', tag:'Exclusive', desc:'Four private dining rooms for 8 to 40 guests. Corporate dinners, family celebrations, state protocol events. A dedicated events chef assigned to each booking.', img:'dining-room.jpg' },
    { name:'Tea at Eldorado', tag:'Afternoon Tradition', desc:'An afternoon ritual of scones, native pastries, and rare teas, served in the quiet hours between lunch and dinner.', img:'dining-room.jpg' },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ position:'relative', height:'70vh', minHeight:500, display:'flex', alignItems:'flex-end', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/afang-fine-dining.jpg')", backgroundSize:'cover', backgroundPosition:'center 40%' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(13,27,42,0.92) 0%,rgba(13,27,42,0.2) 100%)' }} />
        <div style={{ position:'relative', zIndex:2, padding:'4rem clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.75rem' }}>Culinary Arts</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.5rem,5vw,4.5rem)', fontWeight:300, color:'var(--ivory)' }}>Dining at Eldorado</h1>
        </div>
      </div>

      {/* Intro feature — The Table (Fine Dining) */}
      <section id="fine-dining" className="section section-ivory" style={{ scrollMarginTop: 140 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center', maxWidth:1200, margin:'0 auto' }}>
          <img src="/assets/dining-room-v2.jpg" alt="The Table Grand Restaurant" style={{ width:'100%', height:480, objectFit:'cover', borderRadius:4 }} />
          <div>
            <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">Grand Restaurant</span></div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:300, marginBottom:'1.25rem' }}>The Table</h2>
            <p style={{ lineHeight:1.9, color:'rgba(13,27,42,0.75)', marginBottom:'1rem' }}>The finest dining experience in Akwa Ibom State — drawing on the biodiversity of the Niger Delta, the culinary heritage of the Ibibio people, and the precision of world-class kitchen craft. Every dish is a conversation between tradition and mastery.</p>
            <p style={{ lineHeight:1.9, color:'rgba(13,27,42,0.75)' }}>Breakfast service from 6:30am. Lunch from 12:00 noon. Dinner from 7:00pm. Reservations strongly recommended.</p>
            <button className="btn-primary" onClick={() => setReserveType('fine')} style={{ marginTop:'1.5rem' }}>Reserve a Table</button>
          </div>
        </div>
      </section>

      {/* Casual Dining — Oro Lounge & Gaffer's Grill */}
      <section id="casual-dining" className="section section-ivory" style={{ scrollMarginTop: 140, paddingTop: 0 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center', maxWidth:1200, margin:'0 auto' }}>
          <div>
            <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">Casual Dining</span></div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:300, marginBottom:'1.25rem' }}>Oro Lounge &amp; Gaffer's Grill</h2>
            <p style={{ lineHeight:1.9, color:'rgba(13,27,42,0.75)', marginBottom:'1rem' }}>From morning café service to late-night cocktails, Oro Lounge is the social heart of Eldorado — lighter fare, Nigerian street food elevated, and a bar programme centred on palm-wine spirits and aged Nigerian gin. Next door, Gaffer's Grill serves signature burgers, suya platters, and jollof rice bowls on match days and evenings, with Guinness on draft and pepper soup on demand.</p>
            <p style={{ lineHeight:1.9, color:'rgba(13,27,42,0.75)' }}>Oro Lounge open daily, 7:00am to midnight. Gaffer's Grill open for lunch and dinner, with extended hours on match days.</p>
            <button className="btn-primary" onClick={() => setReserveType('casual')} style={{ marginTop:'1.5rem' }}>Reserve a Table</button>
          </div>
          <img src="/assets/afang-fine-dining.jpg" alt="Oro Lounge & Gaffer's Grill" style={{ width:'100%', height:480, objectFit:'cover', borderRadius:4 }} />
        </div>
      </section>

      {/* Tea at Eldorado */}
      <section id="tea-at-eldorado" className="section section-ivory" style={{ scrollMarginTop: 140, paddingTop: 0 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center', maxWidth:1200, margin:'0 auto' }}>
          <img src="/assets/dining-room.jpg" alt="Tea at Eldorado" style={{ width:'100%', height:480, objectFit:'cover', borderRadius:4 }} />
          <div>
            <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">Afternoon Tradition</span></div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:300, marginBottom:'1.25rem' }}>Tea at Eldorado</h2>
            <p style={{ lineHeight:1.9, color:'rgba(13,27,42,0.75)', marginBottom:'1rem' }}>An afternoon ritual reimagined — native pastries, seasonal Nigerian fruit, and a rotating selection of rare teas, served alongside classical tiered stands in the quiet hours between lunch and dinner. A pause, structured with the same precision as The Table's evening service.</p>
            <p style={{ lineHeight:1.9, color:'rgba(13,27,42,0.75)' }}>Served daily, 2:00pm – 5:00pm. Reservations recommended.</p>
            <button className="btn-primary" onClick={() => setReserveType('tea')} style={{ marginTop:'1.5rem' }}>Reserve a Table</button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section section-ivory" style={{ paddingTop:0 }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1rem', marginBottom:'2rem' }}>
            <div style={{ flex:1, height:1, background:'var(--gold)', opacity:0.3 }} />
            <span style={{ fontSize:'0.62rem', letterSpacing:'0.28em', textTransform:'uppercase', color:'var(--gold)' }}>Gallery</span>
            <div style={{ flex:1, height:1, background:'var(--gold)', opacity:0.3 }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <img src="/assets/dining-room-v2.jpg" alt="Restaurant" style={{ width:'100%', height:260, objectFit:'cover', borderRadius:4 }} />
            <img src="/assets/afang-fine-dining.jpg" alt="Afang Fine Dining" style={{ width:'100%', height:260, objectFit:'cover', borderRadius:4 }} />
            <img src="/assets/jollof-fine-dining.jpg" alt="Jollof & Plantains" style={{ width:'100%', height:260, objectFit:'cover', borderRadius:4 }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div style={{ background:'var(--navy)', padding:'2rem', borderRadius:4 }}>
              <div style={{ fontSize:'0.62rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.75rem' }}>Signature Dishes</div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.25rem', color:'var(--ivory)', lineHeight:1.7, fontWeight:300 }}>Afang soup · Jollof rice · Fried sweet plantains · Grilled chicken · Edikaikong · Banga soup · Cross River seafood platter · Pepper soup</p>
            </div>
            <img src="/assets/dining-room.jpg" alt="Eldorado Dining Room" style={{ width:'100%', height:200, objectFit:'cover', borderRadius:4 }} />
          </div>
        </div>
      </section>

      {/* Venues */}
      <section className="section section-cream">
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300 }}>Five Dining Destinations</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1.5rem', maxWidth:1200, margin:'0 auto' }}>
          {venues.map(v => (
            <div key={v.name} className="room-card">
              <img src={`/assets/${v.img}`} alt={v.name} className="room-card-img" />
              <div style={{ padding:'1.5rem' }}>
                <div style={{ fontSize:'0.6rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>{v.tag}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:500, marginBottom:'0.75rem' }}>{v.name}</div>
                <p style={{ fontSize:'0.85rem', lineHeight:1.75, color:'rgba(13,27,42,0.7)' }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {reserveType && (
        <DiningReservationModal
          diningType={reserveType}
          onClose={() => setReserveType(null)}
          onSuccess={() => onToast("Thank you. We'll take it from here.")}
        />
      )}
    </div>
  );
}
