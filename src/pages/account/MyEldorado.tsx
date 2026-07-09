import { useAuth } from '../../context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import AccountLayout from './AccountLayout';

// ─── Tier display helpers ─────────────────────────────────────────────────────
const TIER_LABELS: Record<string, string> = {
  member:  'Member',
  reserve: 'Reserve',
  estate:  'Estate',
  pinnacle: 'Pinnacle',
};
const TIER_COLORS: Record<string, string> = {
  member:  'rgba(201,168,76,0.75)',
  reserve: '#C9A84C',
  estate:  '#20808D',
  pinnacle: '#8B2035',
};
const TIER_THRESHOLDS: Record<string, { nights: number; spend: number; spendLabel: string }> = {
  member:  { nights: 5,  spend: 1_250_000, spendLabel: '₦1.25M' },
  reserve: { nights: 12, spend: 3_500_000, spendLabel: '₦3.5M' },
  estate:  { nights: 25, spend: 8_000_000, spendLabel: '₦8M' },
};

function formatNGN(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

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

// ─── Membership progress card component ────────────────────────────────────────
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  return (
    <div style={{ background: 'rgba(13,27,42,0.08)', borderRadius: 2, height: 4, overflow: 'hidden', marginTop: '0.25rem' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.5s ease' }} />
    </div>
  );
}

function MembershipCard({ token, setPage, createdAt }: { token: string | null; setPage: (p: string) => void; createdAt?: number }) {
  const status = useQuery(api.memberships.getMyStatus, token ? { token } : 'skip');

  // status === undefined → loading; null → no active membership or not signed in
  const accentColor = status ? (TIER_COLORS[status.tier] ?? 'var(--gold)') : 'var(--gold)';

  return (
    <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem' }} data-testid="card-membership-progress">
      <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>The Eldorado Circle</div>

      {status === undefined && (
        // loading skeleton
        <div style={{ height: 60, background: 'rgba(13,27,42,0.04)', borderRadius: 3, marginBottom: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
      )}

      {status === null && (
        // no active membership
        <>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.05rem', fontStyle: 'italic', color: 'rgba(13,27,42,0.5)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            Discover the privileges reserved for Eldorado Circle members.
          </p>
          <button className="btn-primary" onClick={() => setPage('membership')}>Explore The Eldorado Circle</button>
        </>
      )}

      {status && (
        <>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.35rem', fontWeight: 500, color: 'var(--navy)', marginBottom: '0.25rem' }}>
            {TIER_LABELS[status.tier] ?? status.tier}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(13,27,42,0.4)', marginBottom: '1rem' }}>
            Member since {new Date(createdAt ?? Date.now()).getFullYear()}
          </div>

          {/* Pinnacle: no progress, no bars */}
          {status.isPinnacle ? (
            <div style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.5)', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.65 }}>
              Your membership is by invitation — a distinction we extend to very few.
            </div>
          ) : (
            <>
              {/* Nights progress */}
              {status.thresholds && (
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(13,27,42,0.55)' }}>Nights this year</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)' }}>
                      {status.qualifyingNights} / {status.thresholds.nights}
                    </span>
                  </div>
                  <ProgressBar value={status.qualifyingNights} max={status.thresholds.nights} color={accentColor} />
                </div>
              )}

              {/* Spend progress */}
              {status.thresholds && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(13,27,42,0.55)' }}>Spend for this year</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)' }}>
                      {formatNGN(status.spendForYear)} / {status.thresholds.spendLabel}
                    </span>
                  </div>
                  <ProgressBar value={status.spendForYear} max={status.thresholds.spend} color={accentColor} />
                </div>
              )}

              {/* Closest path hint */}
              {status.closestPath && (
                <div style={{ fontSize: '0.72rem', color: 'rgba(13,27,42,0.5)', lineHeight: 1.65, marginBottom: '1.1rem', fontStyle: 'italic' }}>
                  {status.closestPath}
                </div>
              )}

              {status.nextTier && (
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: accentColor, marginBottom: '1.1rem' }}>
                  Next: {TIER_LABELS[status.nextTier] ?? status.nextTier} Status
                </div>
              )}
            </>
          )}

          <button className="btn-primary" onClick={() => setPage('membership')}>View Membership</button>
        </>
      )}
    </div>
  );
}

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

        {/* ── Membership progress card ── */}
        <MembershipCard token={token} setPage={setPage} createdAt={user?.createdAt} />

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
