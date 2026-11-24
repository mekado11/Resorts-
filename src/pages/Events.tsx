import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface EventsProps { onToast: (msg: string) => void; }

// ── The season's programme ────────────────────────────────────────────────────
interface SeasonEvent {
  id: string;
  name: string;
  dateLine: string;
  tag: string;
  img: string;
  desc: string;
  details: { label: string; val: string }[];
}

const EVENTS: SeasonEvent[] = [
  {
    id: 'fashion-week',
    name: 'Eldorado Fashion Week',
    dateLine: 'December 2026 · Dates to be announced',
    tag: 'Runway & Culture',
    img: 'hero-theater.jpg',
    desc: 'Nigeria’s designers, on Nigeria’s newest stage. A runway programme celebrating the craft of the South-South and beyond — couture, textiles, and the artisans behind them — staged against the glamour of the Lagos–Calabar coast. Evenings close with champagne on the terrace and conversations that run long past the final look.',
    details: [
      { label: 'Format', val: 'Runway shows · designer showcases · closing soirée' },
      { label: 'Setting', val: 'The Eldorado Ballroom & Terrace, Uyo' },
    ],
  },
  {
    id: 'christmas-street',
    name: 'Eldorado Christmas Street',
    dateLine: 'Throughout December 2026',
    tag: 'Festive Promenade',
    img: 'entrance-hero.jpg',
    desc: 'For one month, the Eldorado promenade becomes a Christmas street — lights strung overhead, local craft and food stalls, choirs in the evening air, and family nights under the stars. Akwa Ibom’s warmest season, celebrated the Eldorado way: generous, glowing, and open to all.',
    details: [
      { label: 'Format', val: 'Evening promenade · craft & food stalls · choir nights · family evenings' },
      { label: 'Setting', val: 'The Eldorado Promenade' },
    ],
  },
  {
    id: 'nye',
    name: 'Eldorado NYE',
    dateLine: '31 December 2026',
    tag: 'The Countdown Gala',
    img: 'aerial-night.jpg',
    desc: 'One night, properly considered. A black-tie countdown gala — dinner composed by the team behind The Table, live performance through the evening, and at midnight, fireworks over the coastal highway. The first new year toasted at Heights of Eldorado; the ones after will be measured against it.',
    details: [
      { label: 'Format', val: 'Black-tie gala dinner · live performances · midnight fireworks' },
      { label: 'Setting', val: 'The Eldorado Ballroom, Uyo' },
    ],
  },
];

// ── RSVP modal ────────────────────────────────────────────────────────────────
function RsvpModal({ event, onClose, onToast }: { event: SeasonEvent; onClose: () => void; onToast: (m: string) => void }) {
  const submit = useMutation(api.enquiries.submit);
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: '2', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submit({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        subject: `RSVP — ${event.name}`,
        message: [
          `Event: ${event.name} (${event.dateLine})`,
          `Guests: ${form.guests}`,
          form.notes ? `Notes: ${form.notes}` : null,
        ].filter(Boolean).join('\n'),
        type: 'event-rsvp',
      });
      onToast(`Your RSVP for ${event.name} has been received. Our events team will confirm by email.`);
      onClose();
    } catch { alert('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const label = { fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: '0.4rem' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,42,0.75)' }} />
      <div style={{ position: 'relative', background: 'var(--ivory)', borderRadius: 4, width: 'min(94vw, 520px)', maxHeight: '90vh', overflowY: 'auto', padding: '2.25rem clamp(1.5rem,4vw,2.5rem)' }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: '1rem', right: '1.1rem', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'rgba(13,27,42,0.5)' }}>×</button>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>RSVP — {event.dateLine}</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', fontWeight: 300, color: 'var(--navy)', marginBottom: '1.5rem' }}>{event.name}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.1rem' }}>
            <div style={label}>Full Name</div>
            <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem' }}>
            <div>
              <div style={label}>Email</div>
              <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
            </div>
            <div>
              <div style={label}>Phone</div>
              <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234 xxx xxxx xxx" />
            </div>
          </div>
          <div style={{ marginBottom: '1.1rem' }}>
            <div style={label}>Number of Guests</div>
            <select className="form-input" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
              {['1','2','3','4','5','6','7','8','9','10','More than 10'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={label}>Notes <span style={{ opacity: 0.6, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></div>
            <textarea className="form-input" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Seating preferences, accessibility, celebrations…" style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Sending…' : 'Submit RSVP'}
          </button>
          <p style={{ fontSize: '0.72rem', color: 'rgba(13,27,42,0.5)', textAlign: 'center', marginTop: '0.9rem', lineHeight: 1.6 }}>
            This submits an RSVP request. Our events team will confirm your places by email.
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Events({ onToast }: EventsProps) {
  const [rsvpEvent, setRsvpEvent] = useState<SeasonEvent | null>(null);

  return (
    <div>
      {/* Header band */}
      <div style={{ position: 'relative', height: '60vh', minHeight: 420, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/eldorado-ballroom.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 55%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(13,27,42,0.92) 0%,rgba(13,27,42,0.25) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '3rem clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>Signature Events</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: 'var(--ivory)' }}>The Eldorado Season</h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(250,248,242,0.75)', maxWidth: 560, marginTop: '0.9rem', lineHeight: 1.8 }}>
            Three signature celebrations to close the year — held on the coastal highway, open for reservations now.
          </p>
        </div>
      </div>

      {/* Event sections */}
      {EVENTS.map((ev, i) => (
        <section key={ev.id} id={ev.id} className={`section ${i % 2 === 0 ? 'section-ivory' : 'section-cream'}`} style={{ scrollMarginTop: 140 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'center', direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>
            <img src={`/assets/${ev.img}`} alt={ev.name} style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 4, direction: 'ltr' }} />
            <div style={{ direction: 'ltr' }}>
              <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">{ev.tag}</span></div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.55)', marginBottom: '0.6rem' }}>{ev.dateLine}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 300, marginBottom: '1.1rem' }}>{ev.name}</h2>
              <p style={{ lineHeight: 1.9, color: 'rgba(13,27,42,0.75)', marginBottom: '1.25rem' }}>{ev.desc}</p>
              {ev.details.map(d => (
                <div key={d.label} style={{ marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginRight: '0.75rem' }}>{d.label}</span>
                  <span style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.7)' }}>{d.val}</span>
                </div>
              ))}
              <button className="btn-primary" onClick={() => setRsvpEvent(ev)} style={{ marginTop: '1.25rem' }} data-testid={`rsvp-${ev.id}`}>
                RSVP
              </button>
            </div>
          </div>
        </section>
      ))}

      {/* Membership note */}
      <section className="section section-navy" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 300, color: 'var(--ivory)', marginBottom: '1rem' }}>Members are seated first</h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(250,248,242,0.65)', lineHeight: 1.9 }}>
            Eldorado Circle members receive priority reservations and VIP invitations to every signature event. Your Member ID with your RSVP is enough.
          </p>
        </div>
      </section>

      {rsvpEvent && <RsvpModal event={rsvpEvent} onClose={() => setRsvpEvent(null)} onToast={onToast} />}
    </div>
  );
}
