import { useAuth } from '../../context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import AccountLayout from './AccountLayout';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem',
};
const cardTitle: React.CSSProperties = {
  fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem',
};
const sectionHead: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond',serif", fontSize: '1.35rem', fontWeight: 500, color: 'var(--navy)', marginBottom: '0.5rem',
};

export default function MyEldorado({ setPage }: { setPage: (p: string) => void }) {
  const { user, token, displayName } = useAuth();

  const bookings = useQuery(api.account.getMyBookings, token ? { token } : 'skip') ?? [];
  const preferences = useQuery(api.account.getPreferences, token ? { token } : 'skip') ?? [];
  const savedExperiences = useQuery(api.account.getSavedExperiences, token ? { token } : 'skip') ?? [];

  const now = Date.now();
  const upcoming = bookings.filter(b => new Date(b.checkIn).getTime() > now);
  const past = bookings.filter(b => new Date(b.checkOut).getTime() <= now);
  const persistentPrefs = preferences.filter(p => p.persistent);

  const nextStay = upcoming[0];

  return (
    <AccountLayout current="my-eldorado" setPage={setPage}>
      {/* Greeting */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 300, color: 'var(--navy)', marginBottom: '0.4rem' }}>
          {greeting()}, {displayName}.
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(13,27,42,0.5)', lineHeight: 1.7 }}>
          Everything for your Eldorado stay, in one place.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem' }}>

        {/* Upcoming Stay */}
        <div style={{ ...card, gridColumn: nextStay ? '1 / -1' : undefined }}>
          <div style={cardTitle}>Your Next Stay</div>
          {nextStay ? (
            <>
              <div style={sectionHead}>{nextStay.roomName}</div>
              <div style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.65)', marginBottom: '0.35rem' }}>
                {new Date(nextStay.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} — {new Date(nextStay.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(13,27,42,0.45)', marginBottom: '1.25rem' }}>
                {nextStay.nights} night{nextStay.nights > 1 ? 's' : ''} &nbsp;·&nbsp; Status: {nextStay.status}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => setPage('my-stays')}>View Stay</button>
                <button onClick={() => setPage('contact')} style={{ background: 'none', border: '1px solid var(--navy)', borderRadius: 3, padding: '0.55rem 1.1rem', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--navy)', fontFamily: "'Jost',sans-serif" }}>
                  Contact Eldorado
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(13,27,42,0.55)', marginBottom: '1.25rem' }}>
                Your next Eldorado story begins here.
              </p>
              <button className="btn-primary" onClick={() => setPage('rooms')}>Book a Stay</button>
            </>
          )}
        </div>

        {/* Preferences summary */}
        <div style={card}>
          <div style={cardTitle}>My Preferences</div>
          {persistentPrefs.length > 0 ? (
            <>
              <div style={{ fontSize: '0.75rem', color: 'rgba(13,27,42,0.45)', marginBottom: '0.75rem', letterSpacing: '0.06em' }}>We remember:</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {persistentPrefs.slice(0, 5).map(p => (
                  <li key={p._id} style={{ fontSize: '0.84rem', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, display: 'inline-block' }} />
                    {p.value}
                  </li>
                ))}
                {persistentPrefs.length > 5 && (
                  <li style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>+{persistentPrefs.length - 5} more</li>
                )}
              </ul>
              <button className="btn-primary" onClick={() => setPage('my-preferences')}>Edit My Preferences</button>
            </>
          ) : (
            <>
              <p style={{ fontSize: '0.84rem', color: 'rgba(13,27,42,0.5)', lineHeight: 1.65, marginBottom: '1.25rem' }}>Tell us how you like to stay.</p>
              <button className="btn-primary" onClick={() => setPage('my-preferences')}>Set My Preferences</button>
            </>
          )}
        </div>

        {/* Saved Experiences */}
        <div style={card}>
          <div style={cardTitle}>Saved Experiences</div>
          {savedExperiences.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {savedExperiences.slice(0, 3).map(e => (
                  <div key={e._id} style={{ fontSize: '0.84rem', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', background: 'var(--navy)', color: 'var(--gold)', padding: '0.18rem 0.45rem', borderRadius: 2, letterSpacing: '0.1em', flexShrink: 0 }}>{e.experienceCategory}</span>
                    {e.experienceName}
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setPage('my-experiences')}>View All</button>
            </>
          ) : (
            <>
              <p style={{ fontSize: '0.84rem', color: 'rgba(13,27,42,0.5)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                Save the experiences that catch your eye, and return to them whenever you are ready.
              </p>
              <button className="btn-primary" onClick={() => setPage('experiences')}>Explore Experiences</button>
            </>
          )}
        </div>

        {/* Membership */}
        <div style={card}>
          <div style={cardTitle}>Your Membership</div>
          <div style={sectionHead}>Member</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(13,27,42,0.45)', marginBottom: '1.25rem' }}>
            Member since {new Date(user?.createdAt ?? Date.now()).getFullYear()}
          </div>
          <button className="btn-primary" onClick={() => setPage('membership')}>View Membership</button>
        </div>

        {/* Past Stays */}
        {past.length > 0 && (
          <div style={card}>
            <div style={cardTitle}>Past Stays</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {past.slice(0, 3).map(b => (
                <div key={b._id} style={{ fontSize: '0.84rem', color: 'var(--navy)' }}>
                  <div style={{ fontWeight: 500 }}>{b.roomName}</div>
                  <div style={{ color: 'rgba(13,27,42,0.45)', fontSize: '0.78rem' }}>
                    {new Date(b.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => setPage('my-stays')}>View All Stays</button>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
