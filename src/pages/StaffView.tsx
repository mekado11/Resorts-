import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

// ─── Shared style tokens ──────────────────────────────────────────────────────
const NAVY   = 'var(--navy)';
const GOLD   = 'var(--gold)';
const IVORY  = 'var(--ivory)';
const LINEN  = 'var(--linen)';

const TIER_COLORS: Record<string, string> = {
  member:   'rgba(201,168,76,0.85)',
  reserve:  '#C9A84C',
  estate:   '#20808D',
  pinnacle: '#8B2035',
};
const TIER_LABELS: Record<string, string> = {
  member:   'Member',
  reserve:  'Reserve',
  estate:   'Estate',
  pinnacle: 'Pinnacle',
};

// ─── PIN Gate ─────────────────────────────────────────────────────────────────
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin]     = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'ELDORADO2026') onUnlock();
    else setError('Incorrect staff PIN.');
  };

  return (
    <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/assets/logo-white.png" alt="" style={{ height: 56, marginBottom: '1.25rem' }} />
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', color: IVORY, fontWeight: 300 }}>Eldorado Staff Portal</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(250,248,242,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.4rem' }}>The Whisperer</div>
        </div>
        <form onSubmit={submit} style={{ background: IVORY, borderRadius: 4, padding: '2rem' }}>
          {error && <div style={{ fontSize: '0.82rem', color: '#A12C7B', background: 'rgba(161,44,123,0.06)', padding: '0.65rem 0.85rem', borderRadius: 3, marginBottom: '1rem' }}>{error}</div>}
          <label style={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', marginBottom: '0.4rem' }}>Staff PIN</label>
          <input data-testid="input-staff-pin" type="password" value={pin} onChange={e => setPin(e.target.value)} required placeholder="Enter staff PIN" autoComplete="off"
            style={{ width: '100%', padding: '0.75rem 0.9rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.9rem', fontFamily: "'Jost',sans-serif", boxSizing: 'border-box', marginBottom: '1.25rem' }} />
          <button data-testid="button-pin-submit" type="submit"
            style={{ width: '100%', padding: '0.85rem', background: NAVY, color: GOLD, border: 'none', borderRadius: 3, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: 'pointer' }}>
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Guest Profile Card ───────────────────────────────────────────────────────
function GuestProfile({ data }: { data: any }) {
  const { guest, preferences, upcomingBookings, pastBookings, occasions } = data;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Guest header */}
      <div style={{ background: NAVY, borderRadius: 4, padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', color: IVORY, fontWeight: 300, marginBottom: '0.25rem' }}>
            {guest.preferredName ? `${guest.preferredName} (${guest.name})` : guest.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(250,248,242,0.5)' }}>{guest.email}{guest.mobile ? ` · ${guest.mobile}` : ''}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.2rem' }}>{data.profile?.guestStatus || 'Guest'}</div>
          <div style={{ fontSize: '0.82rem', color: 'rgba(250,248,242,0.6)' }}>{data.profile?.totalStayCount || 0} previous stays</div>
          {data.profile?.lastStayDate && <div style={{ fontSize: '0.75rem', color: 'rgba(250,248,242,0.35)' }}>Last stay: {data.profile.lastStayDate}</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>

        {upcomingBookings.length > 0 && (
          <div style={{ background: '#fff', border: `2px solid ${GOLD}`, borderRadius: 4, padding: '1.5rem', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>Upcoming Stay</div>
            {upcomingBookings.map((b: any) => (
              <div key={b._id} style={{ marginBottom: '1rem' }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', color: NAVY, marginBottom: '0.25rem' }}>{b.roomName}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.5)', marginBottom: '0.75rem' }}>
                  {new Date(b.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} — {new Date(b.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {b.nights} nights
                </div>
                <div style={{ background: 'rgba(13,27,42,0.03)', borderRadius: 3, padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.35)', marginBottom: '0.5rem' }}>Arrival Profile</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem 1rem', fontSize: '0.82rem' }}>
                    {b.occasion          && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Occasion: </span><strong>{b.occasion}</strong></div>}
                    {b.roomMood          && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Room mood: </span><strong>{b.roomMood}</strong></div>}
                    {b.arrivalWelcome    && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>On arrival: </span><strong>{b.arrivalWelcome}</strong></div>}
                    {b.welcomeStyle      && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Welcome style: </span><strong>{b.welcomeStyle}</strong></div>}
                    {b.firstNightPriority && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>First night: </span><strong>{b.firstNightPriority}</strong></div>}
                    {b.dietaryRequirements && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Dietary: </span><strong>{b.dietaryRequirements}</strong></div>}
                    {b.accessibilityNeeds  && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Accessibility: </span><strong>{b.accessibilityNeeds}</strong></div>}
                    {b.prayerRoom          && <div><span style={{ color: 'rgba(13,27,42,0.4)' }}>Prayer room: </span><strong>{b.prayerRoom}</strong></div>}
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

        {preferences.length > 0 && (
          <div style={{ background: '#fff', border: `1px solid ${LINEN}`, borderRadius: 4, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>Guest Preferences</div>
            {preferences.map((p: any) => (
              <div key={p._id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.5rem', fontSize: '0.83rem' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD, flexShrink: 0, marginTop: '0.45rem', display: 'inline-block' }} />
                <span style={{ color: 'rgba(13,27,42,0.45)', fontSize: '0.7rem', marginRight: '0.25rem', textTransform: 'capitalize' }}>{p.preferenceType}:</span>
                <span style={{ color: NAVY, fontWeight: 500 }}>{p.value}</span>
              </div>
            ))}
          </div>
        )}

        {occasions.length > 0 && (
          <div style={{ background: '#fff', border: `1px solid ${LINEN}`, borderRadius: 4, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>Important Dates</div>
            {occasions.map((o: any) => (
              <div key={o._id} style={{ fontSize: '0.83rem', color: NAVY, marginBottom: '0.5rem' }}>
                <strong>{o.occasionType}</strong> — {o.occasionDate}{o.label ? ` (${o.label})` : ''}
              </div>
            ))}
          </div>
        )}

        {pastBookings.length > 0 && (
          <div style={{ background: '#fff', border: `1px solid ${LINEN}`, borderRadius: 4, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>Stay History</div>
            {pastBookings.slice(0, 5).map((b: any) => (
              <div key={b._id} style={{ fontSize: '0.83rem', color: NAVY, marginBottom: '0.5rem' }}>
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

// ─── Membership Applications Panel ───────────────────────────────────────────
type AppStatus = 'pending' | 'active' | 'declined';

function statusPill(status: string) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    pending:  { bg: 'rgba(201,168,76,0.15)', color: '#8B6914', label: 'Pending' },
    active:   { bg: 'rgba(67,122,34,0.12)',  color: '#437A22', label: 'Approved' },
    declined: { bg: 'rgba(161,44,123,0.10)', color: '#A12C7B', label: 'Declined' },
    expired:  { bg: 'rgba(13,27,42,0.07)',   color: 'rgba(13,27,42,0.4)', label: 'Expired' },
  };
  const s = map[status] ?? { bg: 'rgba(13,27,42,0.07)', color: 'rgba(13,27,42,0.4)', label: status };
  return (
    <span style={{ fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', background: s.bg, color: s.color, padding: '0.2rem 0.55rem', borderRadius: 2, fontWeight: 700 }}>
      {s.label}
    </span>
  );
}

function MembershipApplications() {
  const applications = useQuery(api.memberships.listAll) ?? [];
  const adminGrant   = useMutation(api.memberships.adminGrant);

  const [filter, setFilter]       = useState<AppStatus | 'all'>('pending');
  const [staffName, setStaffName] = useState('');
  const [acting, setActing]       = useState<string | null>(null); // membershipId being actioned
  const [confirmId, setConfirmId] = useState<string | null>(null); // decline confirm dialog
  const [toast, setToast]         = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const filtered = filter === 'all'
    ? applications
    : applications.filter((a: any) => a.status === filter);

  const pendingCount = applications.filter((a: any) => a.status === 'pending').length;

  const handleApprove = async (app: any) => {
    if (!staffName.trim()) { showToast('Enter your name before approving.'); return; }
    setActing(app._id);
    try {
      await adminGrant({
        staffPin:     'ELDORADO2026',
        membershipId: app._id as Id<'memberships'>,
        newTier:      app.tier,
        newStatus:    'active',
        approvedBy:   staffName.trim(),
      });
      showToast(`${app.name} approved as ${TIER_LABELS[app.tier] ?? app.tier}.`);
    } catch (err: any) {
      showToast('Error: ' + (err?.message ?? 'Unknown error'));
    } finally {
      setActing(null);
    }
  };

  const handleDecline = async (app: any) => {
    if (!staffName.trim()) { showToast('Enter your name before declining.'); return; }
    setActing(app._id);
    setConfirmId(null);
    try {
      await adminGrant({
        staffPin:     'ELDORADO2026',
        membershipId: app._id as Id<'memberships'>,
        newTier:      app.tier,
        newStatus:    'declined',
        approvedBy:   staffName.trim(),
      });
      showToast(`${app.name}'s application has been declined.`);
    } catch (err: any) {
      showToast('Error: ' + (err?.message ?? 'Unknown error'));
    } finally {
      setActing(null);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: NAVY, color: IVORY, padding: '0.85rem 1.5rem', borderRadius: 4, fontSize: '0.82rem', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', maxWidth: '90vw', textAlign: 'center' }}>
          {toast}
        </div>
      )}

      {/* Decline confirmation dialog */}
      {confirmId && (() => {
        const app = applications.find((a: any) => a._id === confirmId);
        if (!app) return null;
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
            <div style={{ background: '#fff', borderRadius: 4, padding: '2rem', maxWidth: 400, width: '100%' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', color: NAVY, marginBottom: '0.75rem' }}>Decline application?</div>
              <p style={{ fontSize: '0.84rem', color: 'rgba(13,27,42,0.6)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                You are about to decline <strong>{app.name}</strong>'s application for <strong>{TIER_LABELS[app.tier] ?? app.tier}</strong> membership. This action is recorded with your name.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  data-testid="button-decline-confirm"
                  onClick={() => handleDecline(app)}
                  style={{ flex: 1, padding: '0.75rem', background: '#A12C7B', color: '#fff', border: 'none', borderRadius: 3, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: 'pointer' }}>
                  Decline Application
                </button>
                <button
                  data-testid="button-decline-cancel"
                  onClick={() => setConfirmId(null)}
                  style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: NAVY, border: '1px solid rgba(13,27,42,0.2)', borderRadius: 3, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Staff name field */}
      <div style={{ background: '#fff', border: `1px solid ${LINEN}`, borderRadius: 4, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.4)', flexShrink: 0 }}>Acting as</div>
        <input
          data-testid="input-staff-name"
          type="text"
          placeholder="Your name (required to approve or decline)"
          value={staffName}
          onChange={e => setStaffName(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '0.55rem 0.8rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.85rem', fontFamily: "'Jost',sans-serif", color: NAVY }}
        />
      </div>

      {/* Filter tabs + count */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['pending', 'active', 'declined', 'all'] as const).map(f => (
          <button
            key={f}
            data-testid={`tab-filter-${f}`}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.45rem 1rem',
              border: filter === f ? `1px solid ${NAVY}` : `1px solid rgba(13,27,42,0.15)`,
              borderRadius: 3,
              background: filter === f ? NAVY : 'transparent',
              color: filter === f ? GOLD : 'rgba(13,27,42,0.55)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: "'Jost',sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : f === 'active' ? 'Approved' : 'Declined'}
            {f === 'pending' && pendingCount > 0 && (
              <span style={{ background: '#C9A84C', color: '#0D1B2A', borderRadius: 10, fontSize: '0.6rem', fontWeight: 700, padding: '0 0.4rem', lineHeight: '1.4' }}>{pendingCount}</span>
            )}
          </button>
        ))}
        <span style={{ fontSize: '0.72rem', color: 'rgba(13,27,42,0.35)', marginLeft: 'auto' }}>{filtered.length} application{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(13,27,42,0.35)', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontStyle: 'italic' }}>
          {filter === 'pending' ? 'No pending applications.' : 'No applications in this category.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((app: any) => {
            const tierColor = TIER_COLORS[app.tier] ?? GOLD;
            const isActing  = acting === app._id;
            const isPending = app.status === 'pending';

            return (
              <div
                key={app._id}
                data-testid={`card-application-${app._id}`}
                style={{
                  background: '#fff',
                  border: isPending ? `1px solid ${LINEN}` : `1px solid ${LINEN}`,
                  borderLeft: `4px solid ${tierColor}`,
                  borderRadius: 4,
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'start',
                }}
              >
                {/* Left: applicant info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', color: NAVY, fontWeight: 500 }}>{app.name}</span>
                    <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: tierColor, color: app.tier === 'member' ? '#0D1B2A' : '#fff', padding: '0.2rem 0.6rem', borderRadius: 2, fontWeight: 600 }}>
                      {TIER_LABELS[app.tier] ?? app.tier}
                    </span>
                    {statusPill(app.status)}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.55)', marginBottom: '0.25rem' }}>{app.email}</div>
                  {app.phone && <div style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.4)', marginBottom: '0.25rem' }}>{app.phone}</div>}
                  {app.organisation && (
                    <div style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.4)', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'rgba(13,27,42,0.3)' }}>Organisation: </span>{app.organisation}
                    </div>
                  )}
                  {app.notes && (
                    <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(13,27,42,0.03)', borderRadius: 3, fontSize: '0.8rem', color: 'rgba(13,27,42,0.6)', fontStyle: 'italic', lineHeight: 1.65 }}>
                      "{app.notes}"
                    </div>
                  )}

                  <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'rgba(13,27,42,0.3)' }}>
                    Submitted {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {app.approvedBy && (
                      <span> · {app.status === 'active' ? 'Approved' : 'Reviewed'} by <strong style={{ color: 'rgba(13,27,42,0.5)' }}>{app.approvedBy}</strong>
                        {app.approvedAt ? ` on ${new Date(app.approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: action buttons (only for pending) */}
                {isPending && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 130 }}>
                    <button
                      data-testid={`button-approve-${app._id}`}
                      onClick={() => handleApprove(app)}
                      disabled={isActing}
                      style={{
                        padding: '0.65rem 1rem',
                        background: isActing ? 'rgba(67,122,34,0.4)' : 'rgba(67,122,34,0.1)',
                        color: '#437A22',
                        border: '1px solid rgba(67,122,34,0.3)',
                        borderRadius: 3,
                        fontSize: '0.6rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: "'Jost',sans-serif",
                        cursor: isActing ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                    >
                      {isActing ? '…' : '✓  Approve'}
                    </button>
                    <button
                      data-testid={`button-decline-${app._id}`}
                      onClick={() => setConfirmId(app._id)}
                      disabled={isActing}
                      style={{
                        padding: '0.65rem 1rem',
                        background: 'transparent',
                        color: '#A12C7B',
                        border: '1px solid rgba(161,44,123,0.25)',
                        borderRadius: 3,
                        fontSize: '0.6rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: "'Jost',sans-serif",
                        cursor: isActing ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                    >
                      ✕  Decline
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Staff View ──────────────────────────────────────────────────────────
type TabId = 'guests' | 'membership';

export default function StaffView() {
  const [unlocked,    setUnlocked]    = useState(false);
  const [activeTab,   setActiveTab]   = useState<TabId>('guests');
  const [searchEmail, setSearchEmail] = useState('');
  const [activeEmail, setActiveEmail] = useState('');

  const pendingApps = useQuery(
    api.memberships.listAll,
    unlocked ? {} : 'skip'
  ) ?? [];
  const pendingCount = (pendingApps as any[]).filter((a: any) => a.status === 'pending').length;

  const result = useQuery(
    api.account.getGuestForStaff,
    unlocked && activeEmail ? { searchEmail: activeEmail, staffPin: 'ELDORADO2026' } : 'skip'
  );

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveEmail(searchEmail.trim().toLowerCase());
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0EEE8', padding: '2rem' }}>
      {/* ── Header ── */}
      <div style={{ maxWidth: 900, margin: '0 auto 1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', color: NAVY }}>The Whisperer</div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.35)', marginTop: '0.2rem' }}>Staff Guest Intelligence Portal</div>
          </div>
          <img src="/assets/logo-gold.png" alt="" style={{ height: 40, opacity: 0.7 }} />
        </div>

        {/* ── Tab nav ── */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid rgba(13,27,42,0.1)', marginBottom: '1.75rem' }}>
          {([
            { id: 'guests',     label: 'Guest Search' },
            { id: 'membership', label: 'Membership Applications', badge: pendingCount },
          ] as { id: TabId; label: string; badge?: number }[]).map(tab => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.6rem 1.4rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${NAVY}` : '2px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: "'Jost',sans-serif",
                color: activeTab === tab.id ? NAVY : 'rgba(13,27,42,0.4)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
              {tab.badge != null && tab.badge > 0 && (
                <span style={{ background: '#C9A84C', color: '#0D1B2A', borderRadius: 10, fontSize: '0.6rem', fontWeight: 700, padding: '0 0.4rem', lineHeight: '1.4' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Guest search tab ── */}
        {activeTab === 'guests' && (
          <form onSubmit={submitSearch} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              data-testid="input-guest-search"
              type="email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} required
              placeholder="Search by guest email address…"
              style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.9rem', fontFamily: "'Jost',sans-serif", color: NAVY, background: '#fff' }}
            />
            <button data-testid="button-find-guest" type="submit"
              style={{ padding: '0.75rem 1.5rem', background: NAVY, color: GOLD, border: 'none', borderRadius: 3, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Find Guest
            </button>
          </form>
        )}
      </div>

      {/* ── Tab content ── */}
      {activeTab === 'guests' && (
        <>
          {activeEmail && (
            result === undefined
              ? <div style={{ textAlign: 'center', color: 'rgba(13,27,42,0.4)', padding: '2rem' }}>Searching…</div>
              : (result as any).error
                ? <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', border: `1px solid ${LINEN}`, borderRadius: 4, padding: '1.5rem', fontSize: '0.88rem', color: '#A12C7B' }}>{(result as any).error}</div>
                : <GuestProfile data={result} />
          )}
          {!activeEmail && (
            <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', padding: '3rem', color: 'rgba(13,27,42,0.35)', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontStyle: 'italic' }}>
              Search by guest email to view their arrival profile and preferences.
            </div>
          )}
        </>
      )}

      {activeTab === 'membership' && <MembershipApplications />}
    </div>
  );
}
