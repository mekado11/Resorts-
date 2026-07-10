import { useAuth } from '../../context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import AccountLayout from './AccountLayout';

// ─── Tier helpers ──────────────────────────────────────────────────────────────
const TIER_LABELS: Record<string, string> = {
  member:   'Member',
  reserve:  'Reserve',
  estate:   'Estate',
  pinnacle: 'Pinnacle',
};
const TIER_COLORS: Record<string, string> = {
  member:   '#C9A84C',
  reserve:  '#C9A84C',
  estate:   '#20808D',
  pinnacle: '#8B2035',
};
// Next-tier thresholds (what the guest is progressing toward)
const NEXT_THRESHOLDS: Record<string, { nights: number; stays: number }> = {
  member:  { nights: 5,  stays: 2 },
  reserve: { nights: 12, stays: 3 },
  estate:  { nights: 0,  stays: 0 },
};

function formatNGN(n: number): string {
  if (n >= 1_000_000) return `\u20a6${(n / 1_000_000).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  if (n >= 1_000)     return `\u20a6${(n / 1_000).toFixed(0)}K`;
  return `\u20a6${n.toLocaleString()}`;
}

// Dining reservation status colourways (shared shape with MyStays/StaffView).
const DINING_STATUS_STYLES: Record<string, { bg: string; fg: string }> = {
  pending:   { bg: 'rgba(201,168,76,0.15)', fg: '#8a6d2f' },
  confirmed: { bg: 'rgba(67,122,34,0.1)',   fg: '#437A22' },
  completed: { bg: 'rgba(32,128,141,0.1)',  fg: '#20808D' },
  declined:  { bg: 'rgba(139,32,53,0.08)',  fg: '#8B2035' },
};

function formatNGNFull(n: number): string {
  return `\u20a6${n.toLocaleString('en-NG')}`;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  return (
    <div style={{ background: 'rgba(250,248,242,0.12)', borderRadius: 2, height: 4, overflow: 'hidden', marginTop: '0.3rem' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
    </div>
  );
}

// ─── Tier badge SVG icon ───────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: string }) {
  const color = TIER_COLORS[tier] ?? '#C9A84C';
  return (
    <div style={{
      width: 52, height: 52, borderRadius: '50%',
      border: `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(201,168,76,0.08)', flexShrink: 0,
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Membership status card (dark, hero-style) ────────────────────────────────
function MembershipCard({ token, setPage, createdAt, memberId }: { token: string | null; setPage: (p: string) => void; createdAt?: number; memberId?: string }) {
  const status = useQuery(api.memberships.getMyStatus, token ? { token } : 'skip');
  const accentColor = status ? (TIER_COLORS[status.tier] ?? '#C9A84C') : '#C9A84C';
  const thresholds = status && !status.isPinnacle ? NEXT_THRESHOLDS[status.tier] : null;

  return (
    <div data-testid="card-membership-progress" style={{
      background: 'var(--navy)',
      borderRadius: 8,
      padding: '1.75rem',
      gridColumn: '1 / -1',
    }}>
      {status === undefined && (
        <div style={{ height: 120, background: 'rgba(250,248,242,0.05)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
      )}

      {status === null && (
        <div>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.8)', marginBottom: '0.5rem' }}>The Eldorado Circle</div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(250,248,242,0.55)', marginBottom: '1.25rem', lineHeight: 1.65 }}>
            Discover the privileges reserved for Eldorado Circle members.
          </p>
          <div style={{ fontSize: '0.82rem', color: 'rgba(250,248,242,0.6)', marginBottom: '1.25rem' }}>
            Your Member ID:{' '}
            {memberId
              ? <span style={{ color: 'var(--gold)', letterSpacing: '0.08em' }}>{memberId}</span>
              : <span style={{ fontStyle: 'italic', color: 'rgba(250,248,242,0.3)' }}>Pending assignment</span>}
          </div>
          <button className="btn-primary" onClick={() => setPage('membership')}>Explore The Eldorado Circle</button>
        </div>
      )}

      {status && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Left: tier + member since + CTA */}
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.8)', marginBottom: '0.75rem' }}>Your Current Tier</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.4rem' }}>
              <TierBadge tier={status.tier} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ivory)', lineHeight: 1 }}>
                  {TIER_LABELS[status.tier] ?? status.tier}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(250,248,242,0.6)', marginBottom: '1.25rem' }}>
              Member ID{' '}
              {memberId
                ? <span style={{ color: 'var(--gold)', letterSpacing: '0.08em' }}>{memberId}</span>
                : <span style={{ fontStyle: 'italic', color: 'rgba(250,248,242,0.3)' }}>Pending assignment</span>}
              {' '}· Member since {new Date(createdAt ?? Date.now()).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={() => setPage('membership')}
              style={{
                padding: '0.65rem 1.25rem',
                border: `1px solid ${accentColor}`,
                borderRadius: 3,
                background: 'transparent',
                color: accentColor,
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: "'Jost',sans-serif",
                cursor: 'pointer',
              }}
            >
              View Benefits
            </button>
          </div>

          {/* Right: progress */}
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.8)', marginBottom: '0.75rem' }}>
              Your Progress (Rolling 12 Months)
            </div>

            {status.isPinnacle ? (
              <div style={{ fontSize: '0.82rem', color: 'rgba(250,248,242,0.5)', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '1rem' }}>
                Your membership is by invitation — a distinction extended to very few.
              </div>
            ) : thresholds ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {/* Qualifying nights */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="rgba(250,248,242,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,248,242,0.4)' }}>Qualifying Nights</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1 }}>{status.qualifyingNights}</span>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(250,248,242,0.4)' }}>/ {thresholds.nights} nights</span>
                  </div>
                  <ProgressBar value={status.qualifyingNights} max={thresholds.nights} color={accentColor} />
                </div>
                {/* Separate stays */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="rgba(250,248,242,0.4)" strokeWidth="1.5"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke="rgba(250,248,242,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke="rgba(250,248,242,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,248,242,0.4)' }}>Separate Stays</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1 }}>{status.separateStays ?? 0}</span>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(250,248,242,0.4)' }}>/ {thresholds.stays} stays</span>
                  </div>
                  <ProgressBar value={status.separateStays ?? 0} max={thresholds.stays} color={accentColor} />
                </div>
              </div>
            ) : null}

            {/* Hint text */}
            {!status.isPinnacle && status.closestPath && (
              <div style={{ fontSize: '0.72rem', color: 'rgba(250,248,242,0.45)', lineHeight: 1.65, fontStyle: 'italic' }}>
                {status.closestPath}
              </div>
            )}
            {!status.isPinnacle && !status.closestPath && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 0.9rem', background: 'rgba(201,168,76,0.08)',
                borderRadius: 3, marginTop: '0.5rem',
              }}>
                <span style={{ color: accentColor, fontSize: '0.85rem' }}>☆</span>
                <span style={{ fontSize: '0.72rem', color: 'rgba(250,248,242,0.65)' }}>
                  {status.nextTier ? `You're on track to reach ${TIER_LABELS[status.nextTier]} · Keep going!` : 'You qualify · Awaiting review.'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Activity stats strip ─────────────────────────────────────────────────────
function ActivityStrip({ token }: { token: string | null }) {
  const status = useQuery(api.memberships.getMyStatus, token ? { token } : 'skip');
  const bookings = useQuery(api.account.getMyBookings, token ? { token } : 'skip') ?? [];

  const nights = status?.qualifyingNights ?? 0;
  const spend  = status?.spendForYear    ?? 0;

  // Days remaining in rolling window (approximate — 365 from window start)
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const daysRemaining = 365 - dayOfYear;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--linen)',
      borderRadius: 8,
      padding: '1.25rem 1.5rem',
      gridColumn: '1 / -1',
    }}>
      <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.55)', marginBottom: '1rem' }}>
        Your Activity (Rolling 12 Months)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0.5rem' }}>
        {/* Total Nights */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1rem', background: 'var(--ivory)', borderRadius: 5 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="rgba(13,27,42,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="rgba(13,27,42,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1 }}>{nights}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.6)', marginTop: '0.15rem' }}>Total Nights</div>
          </div>
        </div>
        {/* Annual Spend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1rem', background: 'var(--ivory)', borderRadius: 5 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="1" x2="12" y2="23" stroke="rgba(13,27,42,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="rgba(13,27,42,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1 }}>{formatNGNFull(spend)}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.6)', marginTop: '0.15rem' }}>Annual Spend</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(13,27,42,0.45)', marginTop: '0.05rem' }}>Eligible Spend</div>
          </div>
        </div>
        {/* Days Remaining */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1rem', background: 'var(--ivory)', borderRadius: 5 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="rgba(13,27,42,0.3)" strokeWidth="1.5"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="rgba(13,27,42,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="rgba(13,27,42,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1 }}>{daysRemaining}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.6)', marginTop: '0.15rem' }}>Days Remaining</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(13,27,42,0.45)', marginTop: '0.05rem' }}>Until period refresh</div>
          </div>
        </div>
        {/* High-value tip */}
        <div style={{ padding: '0.9rem 1rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 5 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ color: '#C9A84C', fontSize: '0.9rem', lineHeight: 1, flexShrink: 0 }}>☆</span>
            <div style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.75)', lineHeight: 1.6 }}>
              High-value activity like yours may qualify for future tier consideration.
            </div>
          </div>
          <button onClick={() => {}} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.68rem', color: '#C9A84C', cursor: 'pointer', letterSpacing: '0.06em', fontFamily: "'Jost',sans-serif", display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Learn more <span style={{ fontSize: '0.75rem' }}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dining reservations card ─────────────────────────────────────────────────
function DiningCard({ token, setPage }: { token: string | null; setPage: (p: string) => void }) {
  const reservations = useQuery(api.diningReservations.getMyReservations, token ? { token } : 'skip') ?? [];
  const recent = reservations.slice(0, 4);

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--linen)',
      borderRadius: 8,
      padding: '1.25rem 1.5rem',
      gridColumn: '1 / -1',
    }}>
      <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.55)', marginBottom: '1rem' }}>
        Your Dining
      </div>

      {recent.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', fontStyle: 'italic', color: 'rgba(13,27,42,0.45)' }}>
            No dining reservations yet. Your table awaits.
          </p>
          <button onClick={() => setPage('dining')}
            style={{ padding: '0.55rem 1.2rem', border: '1px solid var(--navy)', borderRadius: 3, background: 'transparent', color: 'var(--navy)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: 'pointer' }}>
            Reserve a Table
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recent.map((r: any) => (
            <div key={r._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.85rem', padding: '0.75rem 1rem', background: 'var(--ivory)', borderRadius: 5, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.15rem', fontWeight: 500, color: 'var(--navy)' }}>{r.venueName}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.65)', marginTop: '0.1rem' }}>
                  {new Date(r.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · {r.time} · {r.partySize} guest{r.partySize !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {r.spendNGN != null && (
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', fontWeight: 600, color: 'var(--navy)' }}>{formatNGNFull(r.spendNGN)}</span>
                )}
                <span style={{ fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', borderRadius: 3, background: (DINING_STATUS_STYLES[r.status] ?? DINING_STATUS_STYLES.pending).bg, color: (DINING_STATUS_STYLES[r.status] ?? DINING_STATUS_STYLES.pending).fg }}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Quick actions panel ───────────────────────────────────────────────────────
function QuickActions({ setPage }: { setPage: (p: string) => void }) {
  const actions = [
    { icon: '🏨', label: 'Book a Stay',              page: 'rooms' },
    { icon: '🚗', label: 'Request Airport Pickup',    page: 'contact' },
    { icon: '🍽', label: 'Make a Dining Reservation', page: 'dining' },
    { icon: '✦',  label: 'Explore Experiences',       page: 'experiences' },
  ];
  return (
    <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 8, padding: '1.25rem 1.5rem' }}>
      <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.55)', marginBottom: '1rem' }}>Quick Actions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {actions.map((a, i) => (
          <button key={a.label} onClick={() => setPage(a.page)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 0',
            background: 'none', border: 'none',
            borderBottom: i < actions.length - 1 ? '1px solid rgba(13,27,42,0.06)' : 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.95rem', width: 20, textAlign: 'center', flexShrink: 0 }}>{a.icon}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--navy)', fontFamily: "'Jost',sans-serif" }}>{a.label}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(13,27,42,0.3)' }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Eldorado Cares sidebar widget ────────────────────────────────────────────
function CaresWidget({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div style={{
      background: 'rgba(13,27,42,0.04)', border: '1px solid rgba(13,27,42,0.08)',
      borderRadius: 8, padding: '1.25rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.5)', fontFamily: "'Jost',sans-serif" }}>Eldorado Cares</span>
      </div>
      <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.7)', lineHeight: 1.65, marginBottom: '0.85rem' }}>
        Every stay helps us create opportunity for our community.
      </p>
      <button onClick={() => setPage('eldorado-cares')} style={{
        background: 'none', border: 'none', padding: 0,
        fontSize: '0.78rem', color: '#C9A84C', cursor: 'pointer',
        fontFamily: "'Jost',sans-serif", letterSpacing: '0.06em',
        display: 'flex', alignItems: 'center', gap: '0.3rem',
      }}>
        Learn more <span style={{ fontSize: '0.8rem' }}>→</span>
      </button>
    </div>
  );
}

// ─── Upcoming stay card ────────────────────────────────────────────────────────
function UpcomingStayCard({ setPage }: { setPage: (p: string) => void }) {
  const { token } = useAuth();
  const bookings = useQuery(api.account.getMyBookings, token ? { token } : 'skip') ?? [];
  const now = Date.now();
  const upcoming = bookings.filter(b => new Date(b.checkIn).getTime() > now);
  const next = upcoming[0];

  return (
    <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 8, overflow: 'hidden' }}>
      {next ? (
        <>
          {/* Room image placeholder */}
          <div style={{
            height: 140, background: 'linear-gradient(135deg, rgba(13,27,42,0.85) 0%, rgba(13,27,42,0.5) 100%)',
            display: 'flex', alignItems: 'flex-start', padding: '0.75rem',
            backgroundImage: "url('/assets/lobby.jpg')", backgroundSize: 'cover', backgroundPosition: 'center',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,42,0.35)' }} />
            <div style={{ position: 'relative', fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,248,242,0.95)', background: 'rgba(13,27,42,0.5)', padding: '0.3rem 0.6rem', borderRadius: 2 }}>
              Upcoming Stay
            </div>
          </div>
          <div style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.68rem', color: 'rgba(13,27,42,0.45)', marginBottom: '0.2rem' }}>
              {new Date(next.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} – {new Date(next.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.25rem', fontWeight: 500, color: 'var(--navy)', marginBottom: '0.2rem' }}>{next.roomName}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.6)', marginBottom: '0.25rem' }}>
              {next.nights} night{next.nights > 1 ? 's' : ''}
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }} onClick={() => setPage('my-stays')}>
              View Stay
            </button>
            <button onClick={() => setPage('contact')} style={{
              width: '100%', background: 'none', border: 'none', padding: 0,
              fontSize: '0.68rem', color: '#C9A84C', cursor: 'pointer',
              fontFamily: "'Jost',sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
            }}>
              Manage Stay <span>→</span>
            </button>
          </div>
        </>
      ) : (
        <div style={{ padding: '1.5rem 1.25rem' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.55)', marginBottom: '0.75rem' }}>Upcoming Stay</div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.05rem', fontStyle: 'italic', color: 'rgba(13,27,42,0.55)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            Your next Eldorado story begins here.
          </p>
          <button className="btn-primary" onClick={() => setPage('rooms')}>Reserve a Stay</button>
        </div>
      )}
    </div>
  );
}

// ─── We Remember (preferences) card ──────────────────────────────────────────
function WeRememberCard({ token, setPage }: { token: string | null; setPage: (p: string) => void }) {
  const preferences = useQuery(api.account.getPreferences, token ? { token } : 'skip') ?? [];
  const persistent = preferences.filter(p => p.persistent);

  const prefIcons: Record<string, string> = {
    'Room at 20°C':              '🌡',
    'Firm pillows':              '🛏',
    'Quiet room preferred':      '🔕',
    'Black coffee':              '☕',
    'Airport pickup preferred':  '🚗',
  };

  return (
    <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 8, padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.55)' }}>We Remember</div>
        <button onClick={() => setPage('my-preferences')} style={{
          background: 'none', border: 'none', padding: 0, fontSize: '0.78rem',
          color: '#C9A84C', cursor: 'pointer', fontFamily: "'Jost',sans-serif", letterSpacing: '0.06em',
        }}>
          Edit Preferences
        </button>
      </div>
      {persistent.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {persistent.slice(0, 5).map(p => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', width: 20, textAlign: 'center', flexShrink: 0 }}>
                {prefIcons[p.value] ?? '·'}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--navy)', fontFamily: "'Jost',sans-serif" }}>{p.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p style={{ fontSize: '0.9rem', color: 'rgba(13,27,42,0.6)', lineHeight: 1.65, marginBottom: '1rem' }}>
            Tell us how you like to stay — we'll remember every detail.
          </p>
          <button className="btn-primary" onClick={() => setPage('my-preferences')}>Set My Preferences</button>
        </>
      )}
    </div>
  );
}

// ─── Saved Experiences card ───────────────────────────────────────────────────
function SavedExperiencesCard({ token, setPage }: { token: string | null; setPage: (p: string) => void }) {
  const saved = useQuery(api.account.getSavedExperiences, token ? { token } : 'skip') ?? [];

  return (
    <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 8, padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.55)' }}>Saved Experiences</div>
        {saved.length > 0 && (
          <button onClick={() => setPage('my-experiences')} style={{
            background: 'none', border: 'none', padding: 0, fontSize: '0.78rem',
            color: '#C9A84C', cursor: 'pointer', fontFamily: "'Jost',sans-serif", letterSpacing: '0.06em',
          }}>
            View All
          </button>
        )}
      </div>
      {saved.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
          {saved.slice(0, 3).map(e => (
            <div key={e._id} style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', aspectRatio: '1', background: 'rgba(13,27,42,0.08)', cursor: 'pointer' }}
              onClick={() => setPage('experiences')}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,27,42,0.7) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: '0.4rem', left: '0.4rem', right: '0.4rem' }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(250,248,242,0.9)', fontFamily: "'Jost',sans-serif", lineHeight: 1.3 }}>{e.experienceName}</div>
                <div style={{ fontSize: '0.5rem', color: 'rgba(250,248,242,0.55)', marginTop: '0.1rem' }}>{e.experienceCategory}</div>
              </div>
              {/* Heart */}
              <div style={{ position: 'absolute', top: '0.4rem', right: '0.4rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#C9A84C" stroke="#C9A84C" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p style={{ fontSize: '0.9rem', color: 'rgba(13,27,42,0.6)', lineHeight: 1.65, marginBottom: '1rem' }}>
            Save experiences that catch your eye and return whenever you're ready.
          </p>
          <button className="btn-primary" onClick={() => setPage('experiences')}>Explore Experiences</button>
        </>
      )}
    </div>
  );
}

// ─── Eldorado Cares impact sidebar card ───────────────────────────────────────
function CaresImpactCard({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ height: 130, backgroundImage: "url('/assets/cares-hero.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 20%', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,27,42,0.2) 0%, rgba(13,27,42,0.75) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', right: '1rem' }}>
          <div style={{ fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.95)', marginBottom: '0.2rem' }}>Eldorado Cares Impact</div>
        </div>
      </div>
      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'rgba(13,27,42,0.7)', lineHeight: 1.6, marginBottom: '0.35rem' }}>Together, we've supported</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.25rem' }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1 }}>0</span>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.6)', marginBottom: '0.85rem' }}>Young lives this year</div>
        <button onClick={() => setPage('eldorado-cares')} style={{
          background: 'none', border: 'none', padding: 0,
          fontSize: '0.68rem', color: '#C9A84C', cursor: 'pointer',
          fontFamily: "'Jost',sans-serif", letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
        }}>
          See our impact <span>→</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main MyEldorado page ──────────────────────────────────────────────────────
export default function MyEldorado({ setPage }: { setPage: (p: string) => void }) {
  const { user, token, displayName } = useAuth();

  // Initials for avatar circle
  const initials = displayName
    ? displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'ME';

  return (
    <AccountLayout current="my-eldorado" setPage={setPage}>
      {/* ── Top bar: greeting + notification bell + avatar ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 300, color: 'var(--navy)', marginBottom: '0.25rem', lineHeight: 1.1 }}>
            {greeting()}, {displayName}. <span style={{ fontSize: '1.8rem' }}>👋</span>
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.5)', lineHeight: 1.7 }}>
            Welcome back to My Eldorado.
          </p>
        </div>
        {/* Notification bell + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexShrink: 0 }}>
          {/* Bell */}
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="rgba(13,27,42,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="rgba(13,27,42,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Badge */}
            <div style={{
              position: 'absolute', top: -3, right: -3,
              width: 16, height: 16, borderRadius: '50%',
              background: '#C9A84C', border: '2px solid var(--ivory)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '0.42rem', color: '#fff', fontWeight: 700, fontFamily: "'Jost',sans-serif" }}>2</span>
            </div>
          </div>
          {/* Avatar circle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' }} onClick={() => setPage('my-profile')}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(13,27,42,0.08)', border: '1.5px solid rgba(201,168,76,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.7rem', fontWeight: 600, color: '#C9A84C', letterSpacing: '0.04em' }}>{initials}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.78rem', color: 'var(--navy)', fontWeight: 500 }}>{displayName}</span>
              <span style={{ fontSize: '0.5rem', color: 'rgba(13,27,42,0.35)' }}>▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid: two columns ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Membership hero card — full width */}
          <MembershipCard token={token} setPage={setPage} createdAt={user?.createdAt} memberId={user?.memberId} />

          {/* Activity strip */}
          <ActivityStrip token={token} />

          {/* Dining reservations */}
          <DiningCard token={token} setPage={setPage} />

          {/* Bottom row: We Remember + Saved Experiences */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <WeRememberCard token={token} setPage={setPage} />
            <SavedExperiencesCard token={token} setPage={setPage} />
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <UpcomingStayCard setPage={setPage} />
          <QuickActions setPage={setPage} />
          <CaresImpactCard setPage={setPage} />
          <CaresWidget setPage={setPage} />
        </div>
      </div>
    </AccountLayout>
  );
}
