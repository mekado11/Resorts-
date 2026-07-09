import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import AccountLayout from './AccountLayout';

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem',
};

export default function MyStays({ setPage }: { setPage: (p: string) => void }) {
  const { token } = useAuth();
  const bookings = useQuery(api.account.getMyBookings, token ? { token } : 'skip') ?? [];
  const linkBooking = useMutation(api.account.linkBooking);

  const now = Date.now();
  const upcoming = bookings.filter(b => new Date(b.checkIn).getTime() > now);
  const past = bookings.filter(b => new Date(b.checkOut).getTime() <= now);

  // Link form
  const [linkForm, setLinkForm] = useState({ ref: '', lastName: '', email: '' });
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState(false);
  const setF = (k: string, v: string) => setLinkForm(f => ({ ...f, [k]: v }));

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError('');
    setLinkLoading(true);
    const result = await linkBooking({ token: token!, confirmationRef: linkForm.ref, lastName: linkForm.lastName, email: linkForm.email });
    setLinkLoading(false);
    if (result.success) setLinkSuccess(true);
    else setLinkError(result.error || 'Could not find that booking.');
  };

  const BookingCard = ({ b, upcoming }: { b: any; upcoming: boolean }) => (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 500, color: 'var(--navy)' }}>{b.roomName}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(13,27,42,0.45)', marginTop: '0.2rem' }}>
            {new Date(b.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} — {new Date(b.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.4)', marginTop: '0.2rem' }}>{b.nights} night{b.nights !== 1 ? 's' : ''}</div>
        </div>
        <span style={{
          fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
          padding: '0.3rem 0.65rem', borderRadius: 2,
          background: b.status === 'confirmed' ? 'rgba(67,122,34,0.1)' : 'rgba(201,168,76,0.12)',
          color: b.status === 'confirmed' ? '#437A22' : '#6E522B',
        }}>
          {b.status}
        </span>
      </div>

      {/* Arrival profile summary */}
      {upcoming && (b.occasion || b.roomMood || b.arrivalWelcome) && (
        <div style={{ background: 'rgba(13,27,42,0.03)', borderRadius: 3, padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'rgba(13,27,42,0.6)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {b.occasion && <span>Occasion: <strong>{b.occasion}</strong></span>}
          {b.roomMood && <span>· Room mood: <strong>{b.roomMood}</strong></span>}
          {b.arrivalWelcome && <span>· On arrival: <strong>{b.arrivalWelcome}</strong></span>}
        </div>
      )}

      {upcoming && (
        <button onClick={() => setPage('contact')} style={{
          background: 'none', border: '1px solid var(--navy)', borderRadius: 3,
          padding: '0.55rem 1.1rem', fontSize: '0.7rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', cursor: 'pointer', color: 'var(--navy)',
          fontFamily: "'Jost',sans-serif",
        }}>
          Contact Eldorado
        </button>
      )}
    </div>
  );

  return (
    <AccountLayout current="my-stays" setPage={setPage}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--navy)', marginBottom: '2rem' }}>My Stays</h2>

      {/* Upcoming */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Upcoming</div>
        {upcoming.length > 0
          ? <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{upcoming.map(b => <BookingCard key={b._id} b={b} upcoming={true} />)}</div>
          : <div style={card}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(13,27,42,0.5)', marginBottom: '1.25rem' }}>Your next Eldorado story begins here.</p>
              <button className="btn-primary" onClick={() => setPage('rooms')}>Book a Stay</button>
            </div>
        }
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Past Stays</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{past.map(b => <BookingCard key={b._id} b={b} upcoming={false} />)}</div>
        </section>
      )}

      {/* Link a reservation */}
      <section>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Add a Stay</div>
        <div style={card}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(13,27,42,0.55)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            If you made a booking before creating your account, connect it here.
          </p>
          {linkSuccess ? (
            <p style={{ color: '#437A22', fontSize: '0.88rem', fontWeight: 500 }}>✓ Your booking has been added to My Stays.</p>
          ) : (
            <form onSubmit={handleLink} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {linkError && <div style={{ fontSize: '0.82rem', color: '#A12C7B', background: 'rgba(161,44,123,0.06)', padding: '0.65rem 0.85rem', borderRadius: 3 }}>{linkError}</div>}
              <div>
                <label style={{ display: 'block', fontSize: '0.63rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', marginBottom: '0.35rem' }}>Confirmation Reference</label>
                <input value={linkForm.ref} onChange={e => setF('ref', e.target.value)} required placeholder="e.g. ELD-20260318" style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.88rem', fontFamily: "'Jost',sans-serif", boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.63rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', marginBottom: '0.35rem' }}>Last Name on Booking</label>
                  <input value={linkForm.lastName} onChange={e => setF('lastName', e.target.value)} required placeholder="Last name" style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.88rem', fontFamily: "'Jost',sans-serif", boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.63rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', marginBottom: '0.35rem' }}>Email Used for Booking</label>
                  <input type="email" value={linkForm.email} onChange={e => setF('email', e.target.value)} required placeholder="your@email.com" style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.88rem', fontFamily: "'Jost',sans-serif", boxSizing: 'border-box' }} />
                </div>
              </div>
              <button type="submit" disabled={linkLoading} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                {linkLoading ? 'Searching…' : 'Find My Stay'}
              </button>
            </form>
          )}
        </div>
      </section>
    </AccountLayout>
  );
}
