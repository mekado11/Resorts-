import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface Room {
  tier: number; name: string; pricePerNight: number;
  description: string; amenities: string; imageSlug: string;
}

const ROOMS: Room[] = [
  { tier:1, name:'Comfort Room',       pricePerNight:150000, description:'Our entry suite sets a standard most hotels reserve for their finest offering. Key-card sensor lighting, bladeless climate fan, and premium Egyptian cotton linens.', amenities:'["King Bed","En-suite Bathroom","LED Smart TV","Mini Bar","Key-card Sensor Lighting","Bladeless Fan","Gas Water Heater","City View"]', imageSlug:'room-comfort-new' },
  { tier:2, name:'Deluxe Room',        pricePerNight:250000, description:'Elevated above the standard in every dimension. Richer finishes, a larger footprint, and a workspace for the discerning traveller.', amenities:'["King Bed","Rainfall Shower","Work Desk","Nespresso Machine","Smart Lighting","Bladeless Fan","Coastal View","Premium Minibar"]', imageSlug:'room-deluxe' },
  { tier:3, name:'Superior Room',      pricePerNight:350000, description:'Where space becomes a statement. Commanding a full coastal panorama through floor-to-ceiling glass, furnished in hand-selected West African hardwood.', amenities:'["King Bed","Deep Soaking Tub","Walk-in Shower","Private Balcony","Floor-to-Ceiling Windows","Butler Service","Coastal Panorama","Premium Bar"]', imageSlug:'room-superior' },
  { tier:4, name:'Executive Suite',    pricePerNight:450000, description:'A complete residence above the city. Separate living room, dedicated workspace, and master bedroom — all with 24-hour butler service.', amenities:'["Separate Living Room","Dedicated Workspace","Master Bedroom","24hr Butler","Dining for 4","Premium Sound","Panoramic View","Airport Transfer"]', imageSlug:'room-governor' },
  { tier:5, name:'Grand Suite',        pricePerNight:650000, description:'Designed for those who define luxury on their own terms. A corner position with wraparound coastal views and plunge pool access.', amenities:'["Corner Position","Wraparound Views","Plunge Pool Access","Personal Sommelier","Two Bedrooms","Full Kitchen","Private Dining","VIP Arrival"]', imageSlug:'room-governor' },
  { tier:6, name:'Eldorado Flagship Suite', pricePerNight:900000, description:'The singular standard of Eldorado — an entire private floor. Five rooms, a private rooftop terrace, dedicated concierge team, and chef on request.', amenities:'["Private Floor","Rooftop Terrace","Dedicated Concierge","Private Chef","Five Rooms","Helicopter Pad Access","Full Spa Access","State Protocol"]', imageSlug:'eldorado-flagship-suite' },
];

function fmt(n: number) { return '₦' + n.toLocaleString(); }

interface BookingModalProps { room: Room; onClose: () => void; onSuccess: () => void; }

function BookingModal({ room, onClose, onSuccess }: BookingModalProps) {
  const createBooking = useMutation(api.bookings.create);
  const [form, setForm] = useState({ name:'', email:'', phone:'', checkIn:'', checkOut:'', notes:'' });
  const [loading, setLoading] = useState(false);

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;
  const total = nights * room.pricePerNight;

  const today = new Date().toISOString().split('T')[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nights || nights < 1) return alert('Please select valid check-in and check-out dates.');
    setLoading(true);
    try {
      await createBooking({
        guestName: form.name, guestEmail: form.email, guestPhone: form.phone,
        roomTier: room.tier, roomName: room.name,
        checkIn: form.checkIn, checkOut: form.checkOut,
        nights, totalNGN: total,
        notes: form.notes || undefined,
      });
      onSuccess();
      onClose();
    } catch(err) { alert('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const amenities: string[] = JSON.parse(room.amenities);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(13,27,42,0.85)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--ivory)', maxWidth:560, width:'100%', borderRadius:4, overflow:'hidden', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ background:'var(--navy)', padding:'1.5rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'0.6rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.25rem' }}>Tier {room.tier} — Booking Enquiry</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.5rem', color:'var(--ivory)' }}>{room.name}</div>
          </div>
          <span onClick={onClose} style={{ color:'var(--ivory)', cursor:'pointer', fontSize:'1.2rem', opacity:0.6 }}>✕</span>
        </div>
        <form onSubmit={submit} style={{ padding:'2rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" />
            </div>
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label className="form-label">Phone Number</label>
            <input className="form-input" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+234 xxx xxxx xxx" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <label className="form-label">Check-In</label>
              <input className="form-input" type="date" required min={today} value={form.checkIn} onChange={e=>setForm({...form,checkIn:e.target.value})} />
            </div>
            <div>
              <label className="form-label">Check-Out</label>
              <input className="form-input" type="date" required min={form.checkIn||today} value={form.checkOut} onChange={e=>setForm({...form,checkOut:e.target.value})} />
            </div>
          </div>
          {nights > 0 && (
            <div style={{ background:'var(--navy)', color:'var(--ivory)', padding:'1rem', borderRadius:3, marginBottom:'1rem', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:'0.82rem' }}>{nights} night{nights>1?'s':''} · {room.name}</span>
              <span style={{ color:'var(--gold)', fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem' }}>{fmt(total)}</span>
            </div>
          )}
          <div style={{ marginBottom:'1.5rem' }}>
            <label className="form-label">Special Requests (optional)</label>
            <textarea className="form-input" rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Dietary requirements, occasion, accessibility needs..." style={{ resize:'vertical' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
            {loading ? 'Submitting…' : 'Submit Booking Enquiry'}
          </button>
          <p style={{ fontSize:'0.72rem', color:'rgba(13,27,42,0.5)', textAlign:'center', marginTop:'0.75rem', lineHeight:1.6 }}>
            This submits an enquiry. Our reservations team will contact you within 24 hours to confirm availability and payment details.
          </p>
        </form>
      </div>
    </div>
  );
}

interface RoomsProps { onToast: (msg: string) => void; }

export default function Rooms({ onToast }: RoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room|null>(null);

  return (
    <div>
      {/* Hero */}
      <div style={{ position:'relative', height:'60vh', minHeight:400, display:'flex', alignItems:'flex-end', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/eldorado-flagship-suite.jpg')", backgroundSize:'cover', backgroundPosition:'center 40%' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(13,27,42,0.92) 0%,rgba(13,27,42,0.3) 100%)' }} />
        <div style={{ position:'relative', zIndex:2, padding:'4rem clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.75rem' }}>Accommodations</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.5rem,5vw,4.5rem)', fontWeight:300, color:'var(--ivory)' }}>Rooms &amp; Suites</h1>
        </div>
      </div>

      {/* Rooms grid */}
      <section className="section section-ivory">
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.15rem', fontStyle:'italic', color:'rgba(13,27,42,0.65)', maxWidth:600, margin:'0 auto' }}>Six tiers of accommodation, each representing a distinct level of privilege. Every room begins where other hotels' finest end.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.5rem', maxWidth:1200, margin:'0 auto' }}>
          {ROOMS.map(room => {
            const amenities: string[] = JSON.parse(room.amenities);
            return (
              <div key={room.tier} className="room-card">
                <div style={{ position:'relative' }}>
                  <img src={`/assets/${room.imageSlug}.jpg`} alt={room.name} className="room-card-img" />
                  <div style={{ position:'absolute', top:'1rem', left:'1rem', background:'var(--navy)', color:'var(--gold)', fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', padding:'0.35rem 0.75rem', borderRadius:2 }}>Tier {room.tier}</div>
                </div>
                <div style={{ padding:'1.5rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:500 }}>{room.name}</div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', color:'var(--gold)' }}>{fmt(room.pricePerNight)}</div>
                      <div style={{ fontSize:'0.62rem', color:'rgba(13,27,42,0.5)', letterSpacing:'0.1em' }}>per night</div>
                    </div>
                  </div>
                  <p style={{ fontSize:'0.85rem', lineHeight:1.75, color:'rgba(13,27,42,0.7)', marginBottom:'1rem' }}>{room.description}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'1.25rem' }}>
                    {amenities.slice(0,4).map(a => (
                      <span key={a} style={{ fontSize:'0.62rem', letterSpacing:'0.08em', padding:'0.3rem 0.6rem', border:'1px solid var(--linen)', borderRadius:2, color:'rgba(13,27,42,0.6)' }}>{a}</span>
                    ))}
                    {amenities.length > 4 && <span style={{ fontSize:'0.62rem', color:'var(--gold)', padding:'0.3rem 0.3rem' }}>+{amenities.length-4} more</span>}
                  </div>
                  <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => setSelectedRoom(room)}>
                    Reserve This Room
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onSuccess={() => onToast('Your booking enquiry has been received. Our team will contact you within 24 hours.')}
        />
      )}
    </div>
  );
}
