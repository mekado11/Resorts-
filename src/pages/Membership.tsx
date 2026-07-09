import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../context/AuthContext';

// ─── Tier definitions ─────────────────────────────────────────────────────────
const TIERS = [
  {
    id: 'member',
    name: 'Member',
    tag: 'Annual Membership',
    accent: 'rgba(201,168,76,0.75)',
    accentSolid: '#C9A84C',
    textOnAccent: 'rgba(13,27,42,0.9)',
    cta: 'Join My Eldorado',
    ctaActive: true,
    qualification: {
      nights: 5,
      spend: '₦1.25M',
      stays: 2,
      window: 'rolling 12 months',
    },
    perks: [
      '1 complimentary night upon annual status renewal',
      '10% discount on room bookings',
      'Guaranteed discount on all ticketed events',
      'Priority restaurant reservations',
      'Invitations to Eldorado Circle social events',
      'Early access to cultural events and shows',
      'Access to Eldorado Cares volunteer projects',
    ],
  },
  {
    id: 'reserve',
    name: 'Reserve',
    tag: 'Annual Membership',
    accent: '#C9A84C',
    accentSolid: '#C9A84C',
    textOnAccent: '#fff',
    featured: true,
    cta: 'Earn Reserve Status',
    ctaActive: true,
    qualification: {
      nights: 12,
      spend: '₦3.5M',
      stays: 3,
      window: 'rolling 12 months',
    },
    perks: [
      'Member benefits, plus:',
      '2 complimentary nights upon annual status renewal',
      'Room upgrade when available',
      '15% room discount after complimentary nights',
      '10% dining discount',
      'Priority booking for major events and holidays',
      'Invitations to Reserve-level member dinners',
      '2 guest passes per year for Eldorado Circle events',
    ],
  },
  {
    id: 'estate',
    name: 'Estate',
    tag: 'Annual Membership',
    accent: '#20808D',
    accentSolid: '#20808D',
    textOnAccent: '#fff',
    cta: 'Earn Estate Status',
    ctaActive: true,
    qualification: {
      nights: 25,
      spend: '₦8M',
      stays: 5,
      window: 'rolling 12 months',
    },
    perks: [
      'Reserve benefits, plus:',
      '4 complimentary nights upon annual status renewal',
      'Suite-category priority booking',
      '20% room discount after complimentary nights',
      'Complimentary airport transfers (2 per year)',
      'Priority reservations during peak periods',
      'Dedicated Eldorado Correspondent',
      'Invitations to Estate-level experiences and private dinners',
    ],
  },
  {
    id: 'pinnacle',
    name: 'Pinnacle',
    tag: 'By Invitation Only',
    accent: '#8B2035',
    accentSolid: '#8B2035',
    textOnAccent: '#fff',
    cta: 'By Invitation Only',
    ctaActive: false,
    qualification: null,
    perks: [
      'Estate benefits, plus:',
      '8 complimentary nights over membership term',
      'Guaranteed suite priority',
      'Personal Eldorado Correspondent',
      'Private experiences curated by the resort',
      'VIP invitations to all signature Eldorado events',
      'Priority reservations, year-round',
      'Annual audience with the CEO',
      'Ability to nominate projects through Eldorado Cares',
      'Permanent recognition within the Eldorado Circle',
    ],
  },
];

// ─── Spend explainer data ─────────────────────────────────────────────────────
const SPEND_RULES = [
  {
    label: '100% credited',
    color: '#437A22',
    items: [
      'Room & suite charges (direct bookings)',
      'Dining charged to your guest profile',
      'Spa & wellness (The Still Room)',
      'Experiences & activities',
      'Airport transfers',
      'Ticketed events',
    ],
  },
  {
    label: '25% credited',
    color: '#C9A84C',
    items: [
      'Qualifying event spend (e.g. weddings, private functions)',
      'Example: ₦20M wedding → ₦5M credited to your spend total',
    ],
  },
  {
    label: 'Not credited',
    color: '#A13544',
    items: [
      'Taxes and service charges',
      'Refunded or cancelled stays',
      'Third-party commissions (Travelocity, Booking.com, etc.)',
      'Complimentary stays',
      "Charges billed to another guest's account",
    ],
  },
];

// ─── Live approved member count component ───────────────────────────────────────
function MemberCount() {
  const count = useQuery(api.memberships.getApprovedCount);
  if (!count) return null; // hide when 0 or loading
  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 1.75rem',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 3,
        background: 'rgba(201,168,76,0.04)',
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 500, color: '#C9A84C', lineHeight: 1 }}>
          {count}
        </span>
        <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)' }}>
          founding member{count !== 1 ? 's' : ''} recognised
        </span>
      </div>
    </div>
  );
}

interface MembershipProps { onToast: (msg: string) => void; }

export default function Membership({ onToast }: MembershipProps) {
  const { token } = useAuth();
  const applyOrExpress = useMutation(api.memberships.applyOrExpress);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', organisation: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [spendOpen, setSpendOpen] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || selected === 'pinnacle') return;
    setLoading(true);
    try {
      await applyOrExpress({
        name: form.name,
        email: form.email,
        phone: form.phone,
        tier: selected,
        organisation: form.organisation || undefined,
        notes: form.notes || undefined,
        token: token ?? undefined,
      });
      onToast('Your expression of interest has been received. Our team will be in touch within 48 hours.');
      setForm({ name: '', email: '', phone: '', organisation: '', notes: '' });
      setSelected(null);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: '60vh', minHeight: 400, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/entrance-hero.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 60%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(13,27,42,0.95) 0%,rgba(13,27,42,0.3) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '4rem clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>Exclusive Membership</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: 'var(--ivory)' }}>The Eldorado Circle</h1>
        </div>
      </div>

      {/* ── Intro ── */}
      <section className="section section-ivory">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.15rem', fontStyle: 'italic', color: 'rgba(13,27,42,0.65)', maxWidth: 620, margin: '0 auto' }}>
            Eldorado membership is more than preferential access — it is permanent belonging. A select community of Nigeria's most discerning individuals, united by an uncompromising standard of living.
          </p>
        </div>

        {/* ── Live member count ── */}
        <MemberCount />

        {/* ── Tier cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem', maxWidth: 1200, margin: '0 auto 1.5rem', alignItems: 'start' }}>
          {TIERS.map(t => {
            const isSel = selected === t.id;
            return (
              <div
                key={t.id}
                data-testid={`card-tier-${t.id}`}
                onClick={() => t.ctaActive && setSelected(t.id)}
                style={{
                  border: isSel ? `2px solid ${t.accentSolid}` : '1px solid var(--linen)',
                  borderRadius: 5,
                  cursor: t.ctaActive ? 'pointer' : 'default',
                  background: isSel ? `rgba(201,168,76,0.04)` : '#fff',
                  transition: 'all 0.25s',
                  overflow: 'hidden',
                  boxShadow: isSel ? `0 8px 32px rgba(0,0,0,0.10)` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header band */}
                <div style={{ background: t.accent, padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textOnAccent }}>{t.name}</span>
                  <span style={{ fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: t.id === 'member' ? 'rgba(13,27,42,0.55)' : 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>{t.tag}</span>
                </div>

                {/* Qualification block */}
                <div style={{ padding: '1rem 1.5rem 0', borderBottom: '1px solid var(--linen)', flexShrink: 0 }}>
                  {t.qualification ? (
                    <>
                      <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.4)', marginBottom: '0.5rem' }}>How to qualify — {t.qualification.window}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 600, color: t.accentSolid }}>{t.qualification.nights} nights</span>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(13,27,42,0.45)' }}>or</span>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 600, color: t.accentSolid }}>{t.qualification.spend} spend</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(13,27,42,0.5)', marginBottom: '0.9rem' }}>
                        Minimum {t.qualification.stays} separate stays required
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '0.6rem 0 0.9rem' }}>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(13,27,42,0.5)', lineHeight: 1.65 }}>
                        Extended evaluation period.<br />
                        Membership is extended by personal invitation only.
                      </div>
                    </div>
                  )}
                </div>

                {/* Benefits list */}
                <div style={{ padding: '1.25rem 1.5rem', flex: 1 }}>
                  <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.4)', marginBottom: '0.65rem' }}>Member Benefits</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {t.perks.map((p, pi) => {
                      const isHeader = pi === 0 && (p.includes('benefits') || p.includes('Benefits'));
                      return (
                        <li key={pi} style={{
                          fontSize: '0.78rem',
                          color: isHeader ? t.accentSolid : 'rgba(13,27,42,0.7)',
                          fontWeight: isHeader ? 600 : 400,
                          paddingLeft: isHeader ? 0 : '1rem',
                          position: 'relative',
                          lineHeight: 1.6,
                        }}>
                          {!isHeader && (
                            <span style={{ position: 'absolute', left: 0, color: t.accentSolid, fontWeight: 700 }}>·</span>
                          )}
                          {p}
                        </li>
                      );
                    })}
                  </ul>

                  {/* CTA button */}
                  <button
                    data-testid={`button-cta-${t.id}`}
                    onClick={e => { e.stopPropagation(); if (t.ctaActive) setSelected(t.id); }}
                    disabled={!t.ctaActive}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: t.ctaActive ? `1px solid ${t.accentSolid}` : '1px solid rgba(13,27,42,0.2)',
                      borderRadius: 3,
                      background: isSel ? t.accentSolid : 'transparent',
                      color: isSel
                        ? (t.id === 'member' ? '#0D1B2A' : '#fff')
                        : t.ctaActive ? 'rgba(13,27,42,0.75)' : 'rgba(13,27,42,0.35)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      cursor: t.ctaActive ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      fontFamily: "'Jost',sans-serif",
                    }}
                  >
                    {t.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Booking source note ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto 2.5rem', padding: '0 0.25rem' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(13,27,42,0.45)', lineHeight: 1.8, textAlign: 'center' }}>
            Direct bookings made on this site earn full night and spend credit.
            Third-party bookings (Travelocity, Booking.com, etc.) earn 25% spend credit and 1 courtesy qualifying night.
            All membership status changes require staff review and approval.
          </p>
        </div>

        {/* ── Eligible spend explainer ── */}
        <div style={{ maxWidth: 760, margin: '0 auto 3.5rem' }}>
          <button
            data-testid="button-spend-explainer"
            onClick={() => setSpendOpen(o => !o)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              background: '#fff',
              border: '1px solid var(--linen)',
              borderRadius: spendOpen ? '4px 4px 0 0' : 4,
              cursor: 'pointer',
              fontFamily: "'Jost',sans-serif",
            }}
          >
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.75)' }}>What counts toward your spend?</span>
            <span style={{ fontSize: '1rem', color: 'var(--gold)', transition: 'transform 0.2s', display: 'inline-block', transform: spendOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
          </button>

          {spendOpen && (
            <div style={{ background: '#fff', border: '1px solid var(--linen)', borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
              {SPEND_RULES.map(rule => (
                <div key={rule.label}>
                  <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: rule.color, fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: rule.color, display: 'inline-block', flexShrink: 0 }} />
                    {rule.label}
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {rule.items.map((item, i) => (
                      <li key={i} style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.65)', lineHeight: 1.55, paddingLeft: '0.9rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: rule.color }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Application form ── */}
        {selected && selected !== 'pinnacle' && (
          <div style={{ maxWidth: 580, margin: '0 auto 3.5rem', background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '2rem 2.25rem' }}>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Expression of Interest</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', fontWeight: 400, marginBottom: '0.4rem', color: 'var(--navy)' }}>
              {TIERS.find(t => t.id === selected)?.name} Membership
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'rgba(13,27,42,0.5)', marginBottom: '1.75rem', lineHeight: 1.65 }}>
              Submit your details and our team will be in touch within 48 hours to discuss your application.
            </p>
            <form onSubmit={submit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input data-testid="input-name" className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input data-testid="input-email" className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Phone</label>
                <input data-testid="input-phone" className="form-input" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Organisation (optional)</label>
                <input data-testid="input-organisation" className="form-input" value={form.organisation} onChange={e => setForm({ ...form, organisation: e.target.value })} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Why Eldorado? (optional)</label>
                <textarea data-testid="input-notes" className="form-input" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <button data-testid="button-submit" type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Expression of Interest'}
              </button>
            </form>
          </div>
        )}

        {/* ── Strategic Partnerships ── */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 0' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 300, marginBottom: '1rem' }}>Strategic Partnerships</h2>
          <p style={{ color: 'rgba(13,27,42,0.65)', lineHeight: 1.9, marginBottom: '1.5rem' }}>Eldorado is actively building partnerships with institutions that share our standard of excellence — spanning aviation, hospitality, faith communities, and state government.</p>
          <div style={{ display: 'inline-block', padding: '1rem 2.5rem', border: '1px solid var(--gold)', borderRadius: 3, fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', color: 'var(--gold)', letterSpacing: '0.12em' }}>
            Partnerships — Coming Soon
          </div>
        </div>
      </section>
    </div>
  );
}
