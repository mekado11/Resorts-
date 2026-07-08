import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface Room {
  tier: number; name: string;
  description: string; amenities: string; imageSlug: string;
}

const ROOMS: Room[] = [
  {
    tier: 1, name: 'The Manor',
    description: 'Our entry accommodation sets a standard most hotels reserve for their finest. Key-card sensor lighting, bladeless climate fan, and premium Egyptian cotton linens — where every detail is considered from the first moment of arrival.',
    amenities: '["King Bed","En-suite Bathroom","LED Smart TV","Mini Bar","Key-card Sensor Lighting","Bladeless Fan","Gas Water Heater","City View"]',
    imageSlug: 'room-comfort-new',
  },
  {
    tier: 2, name: 'The Gallery',
    description: 'Elevated in every dimension — richer finishes, a broader footprint, and a curated aesthetic that feels more like a private art residence than a hotel room. A workspace for the discerning traveller who does not distinguish between work and living well.',
    amenities: '["King Bed","Rainfall Shower","Work Desk","Nespresso Machine","Smart Lighting","Bladeless Fan","Coastal View","Premium Minibar"]',
    imageSlug: 'room-deluxe',
  },
  {
    tier: 3, name: 'The Residence',
    description: 'Conceived for families and those who travel with people they love. Two king beds, generous living space, and a configuration that feels like a private home — not simply a room. Floor-to-ceiling glass frames a coastal panorama that belongs to you alone.',
    amenities: '["Two King Beds","Deep Soaking Tub","Walk-in Shower","Private Balcony","Floor-to-Ceiling Windows","Butler Service","Coastal Panorama","Family Dining Setup"]',
    imageSlug: 'room-superior',
  },
  {
    tier: 4, name: 'The Regent',
    description: 'A complete private residence above the coast. A dedicated living room, formal workspace, master bedroom, and 24-hour butler service — the kind of quiet, absolute attention that once required a personal staff to assemble.',
    amenities: '["Separate Living Room","Dedicated Workspace","Master Bedroom","24hr Butler","Dining for 4","Premium Sound System","Panoramic View","Airport Transfer"]',
    imageSlug: 'room-governor',
  },
  {
    tier: 5, name: "Governor's Lounge",
    description: 'A corner position commanding wraparound coastal views. Two bedrooms, a full private kitchen, personal sommelier, and plunge pool access. Designed for those who do not require more — they simply deserve exactly this.',
    amenities: '["Corner Position","Wraparound Coastal View","Plunge Pool Access","Personal Sommelier","Two Bedrooms","Full Private Kitchen","Private Dining","VIP Arrival"]',
    imageSlug: 'room-governor',
  },
  {
    tier: 6, name: 'Eldorado Flagship Suite',
    description: 'The singular standard of Eldorado — an entire private floor. Five rooms, a private rooftop terrace, dedicated concierge team, private chef on request, and state protocol arrangements. There is nothing above this.',
    amenities: '["Private Floor","Rooftop Terrace","Dedicated Concierge Team","Private Chef","Five Rooms","Helicopter Pad Access","Full Spa Access","State Protocol"]',
    imageSlug: 'eldorado-flagship-suite',
  },
];

// ─── Shared styles ───────────────────────────────────────────────────────────

const sectionHeadStyle: React.CSSProperties = {
  fontSize: '0.6rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  marginBottom: '1rem',
  marginTop: '1.75rem',
  display: 'block',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.68rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(13,27,42,0.55)',
  marginBottom: '0.35rem',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.85rem',
  border: '1px solid rgba(13,27,42,0.18)',
  borderRadius: 3,
  fontSize: '0.85rem',
  fontFamily: "'Jost', sans-serif",
  color: 'var(--navy)',
  background: '#fff',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230D1B2A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.85rem center',
  paddingRight: '2.25rem',
  cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.85rem',
  border: '1px solid rgba(13,27,42,0.18)',
  borderRadius: 3,
  fontSize: '0.85rem',
  fontFamily: "'Jost', sans-serif",
  color: 'var(--navy)',
  background: '#fff',
  boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  lineHeight: 1.65,
};

const dividerStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid rgba(13,27,42,0.1)',
  margin: '1.5rem 0 0.25rem',
};

// ─── Booking Modal ────────────────────────────────────────────────────────────

interface BookingModalProps { room: Room; onClose: () => void; onSuccess: () => void; }

function BookingModal({ room, onClose, onSuccess }: BookingModalProps) {
  const createBooking = useMutation(api.bookings.create);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', checkIn: '', checkOut: '',
    // Arrival Profile
    occasion: '',
    roomMood: '',
    arrivalWelcome: '',
    welcomeStyle: '',
    firstNightPriority: '',
    oneMoreThing: '',
    // Operational
    hasDietary: 'no',
    dietaryDetails: '',
    hasAccessibility: 'no',
    accessibilityDetails: '',
    needsPrayerRoom: 'no',
    prayerFaith: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;

  const today = new Date().toISOString().split('T')[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nights || nights < 1) return alert('Please select valid check-in and check-out dates.');
    if (!form.occasion) return alert('Please let us know what brings you to Eldorado.');
    if (!form.roomMood) return alert('Please tell us how you would like your room to feel.');
    if (!form.arrivalWelcome) return alert('Please tell us what should be waiting for you.');
    if (!form.welcomeStyle) return alert('Please tell us how you prefer to be welcomed.');
    if (!form.firstNightPriority) return alert('Please tell us what matters most for your first night.');

    setLoading(true);
    try {
      const dietaryReq = form.hasDietary === 'yes' ? form.dietaryDetails || 'Yes (details not provided)' : undefined;
      const accessibilityReq = form.hasAccessibility === 'yes' ? form.accessibilityDetails || 'Yes (details not provided)' : undefined;
      let prayerRoomVal: string | undefined = undefined;
      if (form.needsPrayerRoom === 'yes') {
        prayerRoomVal = form.prayerFaith || 'Yes';
      }

      await createBooking({
        guestName: form.name,
        guestEmail: form.email,
        guestPhone: form.phone,
        roomTier: room.tier,
        roomName: room.name,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        nights,
        totalNGN: 0,
        occasion: form.occasion,
        roomMood: form.roomMood,
        arrivalWelcome: form.arrivalWelcome,
        welcomeStyle: form.welcomeStyle,
        firstNightPriority: form.firstNightPriority,
        oneMoreThing: form.oneMoreThing || undefined,
        dietaryRequirements: dietaryReq,
        accessibilityNeeds: accessibilityReq,
        prayerRoom: prayerRoomVal,
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(13,27,42,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <div style={{ background: 'var(--ivory)', maxWidth: 580, width: '100%', borderRadius: 4, overflow: 'hidden', maxHeight: '92vh', overflowY: 'auto' }}>

        {/* Modal header */}
        <div style={{ background: 'var(--navy)', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>Tier {room.tier} — Booking Enquiry</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', color: 'var(--ivory)' }}>{room.name}</div>
          </div>
          <span onClick={onClose} style={{ color: 'var(--ivory)', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.55, lineHeight: 1 }}>✕</span>
        </div>

        <form onSubmit={submit} style={{ padding: '2rem' }}>

          {/* ── Contact details ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
            </div>
          </div>

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={labelStyle}>Phone Number</label>
            <input style={inputStyle} required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 xxx xxxx xxx" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
            <div>
              <label style={labelStyle}>Check-In</label>
              <input style={inputStyle} type="date" required min={today} value={form.checkIn} onChange={e => set('checkIn', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Check-Out</label>
              <input style={inputStyle} type="date" required min={form.checkIn || today} value={form.checkOut} onChange={e => set('checkOut', e.target.value)} />
            </div>
          </div>

          {nights > 0 && (
            <div style={{ background: 'var(--navy)', color: 'var(--ivory)', padding: '0.875rem 1rem', borderRadius: 3, marginBottom: '0.875rem', fontSize: '0.82rem' }}>
              {nights} night{nights > 1 ? 's' : ''} &nbsp;·&nbsp; {room.name}
            </div>
          )}

          {/* ── Guest Arrival Profile ── */}
          <hr style={dividerStyle} />
          <span style={sectionHeadStyle}>Before You Arrive</span>
          <p style={{ fontSize: '0.8rem', color: 'rgba(13,27,42,0.55)', lineHeight: 1.65, marginBottom: '1.25rem', marginTop: '-0.25rem' }}>
            A few details help us prepare your stay before you reach the door.
          </p>

          {/* 1. Occasion */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>What brings you to Eldorado? *</label>
            <select style={selectStyle} required value={form.occasion} onChange={e => set('occasion', e.target.value)}>
              <option value="">Select one…</option>
              <option>Returning Home</option>
              <option>Rest &amp; Escape</option>
              <option>Business</option>
              <option>Wedding</option>
              <option>Anniversary</option>
              <option>Birthday</option>
              <option>Romantic Stay</option>
              <option>Family Time</option>
              <option>Other Celebration</option>
              <option>Prefer Not to Say</option>
            </select>
          </div>

          {/* 2. Room mood */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>How would you like your room to feel when you arrive? *</label>
            <select style={selectStyle} required value={form.roomMood} onChange={e => set('roomMood', e.target.value)}>
              <option value="">Select one…</option>
              <option>Cool &amp; Calm</option>
              <option>Warm &amp; Welcoming</option>
              <option>Bright &amp; Airy</option>
              <option>Soft &amp; Restful</option>
              <option>Surprise Me</option>
            </select>
          </div>

          {/* 3. Arrival welcome */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>What should be waiting for you? *</label>
            <select style={selectStyle} required value={form.arrivalWelcome} onChange={e => set('arrivalWelcome', e.target.value)}>
              <option value="">Select one…</option>
              <option>Chilled Water</option>
              <option>Fresh Juice</option>
              <option>Tea</option>
              <option>Coffee</option>
              <option>Something Local</option>
              <option>A Light Bite</option>
              <option>Nothing, Thank You</option>
              <option>Surprise Me</option>
            </select>
          </div>

          {/* 4. Welcome style */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>How do you prefer to be welcomed? *</label>
            <select style={selectStyle} required value={form.welcomeStyle} onChange={e => set('welcomeStyle', e.target.value)}>
              <option value="">Select one…</option>
              <option>Quietly &amp; Discreetly</option>
              <option>Warmly &amp; Personally</option>
              <option>I Enjoy a Little Celebration</option>
              <option>Let Eldorado Decide</option>
            </select>
          </div>

          {/* 5. First night priority */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>What matters most for your first night? *</label>
            <select style={selectStyle} required value={form.firstNightPriority} onChange={e => set('firstNightPriority', e.target.value)}>
              <option value="">Select one…</option>
              <option>Deep Sleep</option>
              <option>Quiet</option>
              <option>Food After Arrival</option>
              <option>Work Ready</option>
              <option>Romance</option>
              <option>Family Comfort</option>
              <option>Recovery After Travel</option>
              <option>Surprise Me</option>
            </select>
          </div>

          {/* One More Thing */}
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ ...labelStyle, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'none', color: 'var(--navy)', fontWeight: 600 }}>One More Thing</label>
            <p style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.5)', marginBottom: '0.5rem', lineHeight: 1.6 }}>What would make this stay feel especially yours?</p>
            <textarea
              style={textareaStyle}
              rows={3}
              value={form.oneMoreThing}
              onChange={e => set('oneMoreThing', e.target.value)}
              placeholder="A favourite drink, a small tradition, something you are celebrating, something your child loves, or anything else we should know…"
            />
          </div>

          {/* ── Operational fields ── */}
          <hr style={dividerStyle} />
          <span style={sectionHeadStyle}>Dietary &amp; Accessibility</span>

          {/* Dietary */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Do you have dietary requirements?</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: form.hasDietary === 'yes' ? '0.75rem' : 0 }}>
              {['no', 'yes'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--navy)' }}>
                  <input type="radio" name="dietary" value={opt} checked={form.hasDietary === opt} onChange={() => set('hasDietary', opt)} style={{ accentColor: 'var(--navy)' }} />
                  {opt === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
            {form.hasDietary === 'yes' && (
              <textarea
                style={{ ...textareaStyle, marginTop: '0.5rem' }}
                rows={2}
                value={form.dietaryDetails}
                onChange={e => set('dietaryDetails', e.target.value)}
                placeholder="Please describe your dietary needs (e.g. vegan, halal, nut allergy)…"
              />
            )}
          </div>

          {/* Accessibility */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Do you have accessibility needs?</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: form.hasAccessibility === 'yes' ? '0.75rem' : 0 }}>
              {['no', 'yes'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--navy)' }}>
                  <input type="radio" name="accessibility" value={opt} checked={form.hasAccessibility === opt} onChange={() => set('hasAccessibility', opt)} style={{ accentColor: 'var(--navy)' }} />
                  {opt === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
            {form.hasAccessibility === 'yes' && (
              <textarea
                style={{ ...textareaStyle, marginTop: '0.5rem' }}
                rows={2}
                value={form.accessibilityDetails}
                onChange={e => set('accessibilityDetails', e.target.value)}
                placeholder="Please describe what would make your stay more comfortable…"
              />
            )}
          </div>

          {/* Prayer room */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={labelStyle}>Would you like a prayer room arranged?</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: form.needsPrayerRoom === 'yes' ? '0.75rem' : 0 }}>
              {['no', 'yes'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--navy)' }}>
                  <input type="radio" name="prayer" value={opt} checked={form.needsPrayerRoom === opt} onChange={() => set('needsPrayerRoom', opt)} style={{ accentColor: 'var(--navy)' }} />
                  {opt === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
            {form.needsPrayerRoom === 'yes' && (
              <select style={{ ...selectStyle, marginTop: '0.5rem' }} value={form.prayerFaith} onChange={e => set('prayerFaith', e.target.value)}>
                <option value="">Select faith tradition…</option>
                <option>Christian</option>
                <option>Muslim</option>
                <option>Other</option>
              </select>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'var(--navy)',
              color: 'var(--gold)',
              border: 'none',
              borderRadius: 3,
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: "'Jost', sans-serif",
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Submitting…' : 'Submit Booking Enquiry'}
          </button>
          <p style={{ fontSize: '0.7rem', color: 'rgba(13,27,42,0.42)', textAlign: 'center', marginTop: '0.75rem', lineHeight: 1.65 }}>
            This submits an enquiry. Our reservations team will contact you within 24 hours to confirm availability.
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Rooms page ───────────────────────────────────────────────────────────────

interface RoomsProps { onToast: (msg: string) => void; }

export default function Rooms({ onToast }: RoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', height: '60vh', minHeight: 400, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/eldorado-flagship-suite.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(13,27,42,0.92) 0%,rgba(13,27,42,0.3) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '4rem clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>Accommodations</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: 'var(--ivory)' }}>Rooms &amp; Suites</h1>
        </div>
      </div>

      {/* Rooms grid */}
      <section className="section section-ivory">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.15rem', fontStyle: 'italic', color: 'rgba(13,27,42,0.65)', maxWidth: 640, margin: '0 auto' }}>
            From The Manor to the Eldorado Flagship Suite — six distinct accommodations, each representing a different philosophy of living well. Every tier begins where other hotels end.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
          {ROOMS.map(room => {
            const amenities: string[] = JSON.parse(room.amenities);
            return (
              <div key={room.tier} className="room-card">
                <div style={{ position: 'relative' }}>
                  <img src={`/assets/${room.imageSlug}.jpg`} alt={room.name} className="room-card-img" />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--navy)', color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0.35rem 0.75rem', borderRadius: 2 }}>Tier {room.tier}</div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', fontWeight: 500 }}>{room.name}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.25rem' }}>Enquire for Rates</div>
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.75, color: 'rgba(13,27,42,0.7)', marginBottom: '1rem' }}>{room.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {amenities.slice(0, 4).map(a => (
                      <span key={a} style={{ fontSize: '0.62rem', letterSpacing: '0.08em', padding: '0.3rem 0.6rem', border: '1px solid var(--linen)', borderRadius: 2, color: 'rgba(13,27,42,0.6)' }}>{a}</span>
                    ))}
                    {amenities.length > 4 && <span style={{ fontSize: '0.62rem', color: 'var(--gold)', padding: '0.3rem 0.3rem' }}>+{amenities.length - 4} more</span>}
                  </div>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setSelectedRoom(room)}>
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
          onSuccess={() => onToast("Thank you. We'll take it from here.")}
        />
      )}
    </div>
  );
}
