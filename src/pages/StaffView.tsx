import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// ── Staff PIN gate ──────────────────────────────────────────────────────────

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'ELDORADO2026') onUnlock();
    else setError('Incorrect staff PIN.');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/assets/logo-white.png" alt="" style={{ height: 56, marginBottom: '1.25rem' }} />
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', color: 'var(--ivory)', fontWeight: 300 }}>Eldorado Staff Portal</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(250,248,242,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.4rem' }}>The Whisperer</div>
        </div>
        <form onSubmit={submit} style={{ background: 'var(--ivory)', borderRadius: 4, padding: '2rem' }}>
          {error && <div style={{ fontSize: '0.82rem', color: '#A12C7B', background: 'rgba(161,44,123,0.06)', padding: '0.65rem 0.85rem', borderRadius: 3, marginBottom: '1rem' }}>{error}</div>}
          <label style={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', marginBottom: '0.4rem' }}>Staff PIN</label>
          <input type="password" value={pin} onChange={e => setPin(e.target.value)} required placeholder="Enter staff PIN" autoComplete="off" style={{ width: '100%', padding: '0.75rem 0.9rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.9rem', fontFamily: "'Jost',sans-serif", boxSizing: 'border-box', marginBottom: '1.25rem' }} />
          <button type="submit" style={{ width: '100%', padding: '0.85rem', background: 'var(--navy)', color: 'var(--gold)', border: 'none', borderRadius: 3, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: 'pointer' }}>
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Guest Profile Card ───────────────────────────────────────────────────────

function GuestProfile({ data }: { data: any }) {
  const { guest, profile, preferences, upcomingBookings, pastBookings, occasions } = data;
  const now = Date.now();

  const prefByCategory = (cat: string) => preferences.filter((p: any) => p.category === cat);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Guest header */}
      <div style={{ background: 'var(--navy)', borderRadius: 4, padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', color: 'var(--ivory)', fontWeight: 300, marginBottom: '0.25rem' }}>
            {guest.preferredName ? `${guest.preferredName} (${guest.name})` : guest.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(250,248,242,0.5)' }}>{guest.email}{guest.mobile ? ` · ${guest.mobile}` : ''}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>{profile?.guestStatus || 'Guest'}</div>
          <div style={{ fontSize: '0.82rem', color: 'rgba(250,248,242,0.6)' }}>{profile?.totalStayCount || 0} previous stays</div>
          {profile?.lastStayDate && <div style={{ fontSize: '0.75rem', color: 'rgba(250,248,242,0.35)' }}>Last stay: {profile.lastStayDate}</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>

        {/* Upcoming bookings */}
        {upcomingBookings.length > 0 && (
          <div style={{ background: '#fff', border: '2px solid var(--gold)', borderRadius: 4, padding: '1.5rem', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Upcoming Stay</div>
            {upcomingBookings.map((b: any) => (
              <div key={b._id} style={{ marginBottom: '1rem' }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>{b.roomName}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.5)', marginBottom: '0.75rem' }}>
                  {new Date(b.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} — {new Date(b.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {b.nights} nights
                </div>
                {/* Arrival profile */}
                <div style={{ background: 'rgba(13,27,42,0.03)', borderRadius: 3, padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.35)', marginBottom: '0.5rem' }}>Arrival Profile</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem 1rem', fontSize: '0.82rem' }}>
                    {b.occasion && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Occasion: </span><strong>{b.occasion}</strong></div>}
                    {b.roomMood && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Room mood: </span><strong>{b.roomMood}</strong></div>}
                    {b.arrivalWelcome && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>On arrival: </span><strong>{b.arrivalWelcome}</strong></div>}
                    {b.welcomeStyle && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Welcome style: </span><strong>{b.welcomeStyle}</strong></div>}
                    {b.firstNightPriority && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>First night: </span><strong>{b.firstNightPriority}</strong></div>}
                    {b.dietaryRequirements && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Dietary: </span><strong>{b.dietaryRequirements}</strong></div>}
                    {b.accessibilityNeeds && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Accessibility: </span><strong>{b.accessibilityNeeds}</strong></div>}
                    {b.prayerRoom && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Prayer room: </span><strong>{b.prayerRoom}</strong></div>}
                  </div>
                  {b.oneMoreThing && (
                    <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', fontStyle: 'italic', color: 'rgba(13,27,42,0.55)', borderTop: '1px solid rgba(13,27,42,0.08)', paddingTop: '0.5rem' }}>
                      "{b.oneMoreThing}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Persistent preferences */}
        {preferences.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Guest Preferences</div>
            {preferences.map((p: any) => (
              <div key={p._id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.5rem', fontSize: '0.83rem' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, marginTop: '0.45rem', display: 'inline-block' }} />
                <span style={{ color: 'rgba(13,27,42,0.45)', fontSize: '0.7rem', marginRight: '0.25rem', textTransform: 'capitalize' }}>{p.preferenceType}:</span>
                <span style={{ color: 'var(--navy)', fontWeight: 500 }}>{p.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Occasions */}
        {occasions.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Important Dates</div>
            {occasions.map((o: any) => (
              <div key={o._id} style={{ fontSize: '0.83rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
                <strong>{o.occasionType}</strong> — {o.occasionDate}{o.label ? ` (${o.label})` : ''}
              </div>
            ))}
          </div>
        )}

        {/* Past stays */}
        {pastBookings.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Stay History</div>
            {pastBookings.slice(0, 5).map((b: any) => (
              <div key={b._id} style={{ fontSize: '0.83rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 500 }}>{b.roomName}</div>
                <div style={{ color: 'rgba(13,27,42,0.4)', fontSize: '0.75rem' }}>
                  {new Date(b.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Staff View ──────────────────────────────────────────────────────────

export default function StaffView() {
  const [unlocked, setUnlocked] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [activeEmail, setActiveEmail] = useState('');

  const result = useQuery(
    api.account.getGuestForStaff,
    activeEmail ? { searchEmail: activeEmail, staffPin: 'ELDORADO2026' } : 'skip'
  );

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveEmail(searchEmail.trim().toLowerCase());
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0EEE8', padding: '2rem' }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', color: 'var(--navy)' }}>The Whisperer</div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.35)', marginTop: '0.2rem' }}>Staff Guest Intelligence Portal</div>
          </div>
          <img src="/assets/logo-gold.png" alt="" style={{ height: 40, opacity: 0.7 }} />
        </div>

        {/* Search */}
        <form onSubmit={submit} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} required
            placeholder="Search by guest email address…"
            style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.9rem', fontFamily: "'Jost',sans-serif", color: 'var(--navy)', background: '#fff' }}
          />
          <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--navy)', color: 'var(--gold)', border: 'none', borderRadius: 3, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Find Guest
          </button>
        </form>
      </div>

      {/* Results */}
      {activeEmail && (
        result === undefined
          ? <div style={{ textAlign: 'center', color: 'rgba(13,27,42,0.4)', padding: '2rem' }}>Searching…</div>
          : (result as any).error
            ? <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem', fontSize: '0.88rem', color: '#A12C7B' }}>{(result as any).error}</div>
            : <GuestProfile data={result} />
      )}

      {!activeEmail && (
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', padding: '3rem', color: 'rgba(13,27,42,0.35)', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontStyle: 'italic' }}>
          Search by guest email to view their arrival profile and preferences.
        </div>
      )}
    </div>
  );
}
