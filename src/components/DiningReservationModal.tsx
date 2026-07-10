import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../context/AuthContext';
import DatePicker from './DatePicker';

export type DiningType = 'casual' | 'fine' | 'tea';

interface TimeOption { label: string; value: string; }

interface DiningTypeConfig {
  eyebrow: string;
  venueName: string;
  timeOptions: TimeOption[];
}

const DINING_CONFIG: Record<DiningType, DiningTypeConfig> = {
  casual: {
    eyebrow: 'Casual Dining — Reservation Enquiry',
    venueName: "Oro Lounge & Gaffer's Grill",
    timeOptions: [
      { label: '12:00 PM', value: '12:00' },
      { label: '12:30 PM', value: '12:30' },
      { label: '1:00 PM',  value: '13:00' },
      { label: '1:30 PM',  value: '13:30' },
      { label: '7:00 PM',  value: '19:00' },
      { label: '7:30 PM',  value: '19:30' },
      { label: '8:00 PM',  value: '20:00' },
      { label: '8:30 PM',  value: '20:30' },
      { label: '9:00 PM',  value: '21:00' },
    ],
  },
  fine: {
    eyebrow: 'Fine Dining — Reservation Enquiry',
    venueName: 'The Table',
    timeOptions: [
      { label: '7:00 PM',  value: '19:00' },
      { label: '7:30 PM',  value: '19:30' },
      { label: '8:00 PM',  value: '20:00' },
      { label: '8:30 PM',  value: '20:30' },
      { label: '9:00 PM',  value: '21:00' },
      { label: '9:30 PM',  value: '21:30' },
    ],
  },
  tea: {
    eyebrow: 'Afternoon Tea — Reservation Enquiry',
    venueName: 'Tea at Eldorado',
    timeOptions: [
      { label: '2:00 PM',  value: '14:00' },
      { label: '2:30 PM',  value: '14:30' },
      { label: '3:00 PM',  value: '15:00' },
      { label: '3:30 PM',  value: '15:30' },
      { label: '4:00 PM',  value: '16:00' },
      { label: '4:30 PM',  value: '16:30' },
    ],
  },
};

const OCCASION_OPTIONS = [
  'Just Because', 'Business', 'Date Night', 'Birthday',
  'Anniversary', 'Family Gathering', 'Other Celebration', 'Prefer Not to Say',
];

// ─── Shared styles (mirrors Rooms.tsx's form styling) ─────────────────────────

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

const LARGE_PARTY_VALUE = '11+';

const MEMBER_ID_NOT_FOUND =
  "We couldn't find that Member ID. Please check it in your My Eldorado dashboard, or leave the field blank to continue as a guest.";

// Client copy of the canonical normalizer in convex/auth.ts — keep in sync.
// (Not imported from there: that would pull the Convex server runtime into
// the browser bundle.)
function normalizeMemberId(raw: string): string | null {
  const cleaned = raw.replace(/\s+/g, '').toUpperCase();
  if (cleaned === '') return null;
  const match = cleaned.match(/^(?:ELD-?)?(\d{1,5})$/);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  if (num < 1 || num > 99999) return null;
  return `ELD-${String(num).padStart(5, '0')}`;
}

interface DiningReservationModalProps {
  diningType: DiningType;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DiningReservationModal({ diningType, onClose, onSuccess }: DiningReservationModalProps) {
  const config = DINING_CONFIG[diningType];
  const createReservation = useMutation(api.diningReservations.create);
  const submitEnquiry = useMutation(api.enquiries.submit);
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    memberId: '',
    date: '', time: '',
    partySize: '',
    occasion: '',
    specialRequests: '',
    approxGuests: '',
    eventNotes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const today = new Date().toISOString().split('T')[0];
  const isLargeParty = form.partySize === LARGE_PARTY_VALUE;

  // Signed-in members get their ID pre-filled and locked to their account.
  const memberIdLocked = Boolean(user?.memberId);
  useEffect(() => {
    if (user?.memberId) set('memberId', user.memberId);
  }, [user?.memberId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.date) return alert('Please select a date.');

    if (isLargeParty) {
      if (!form.approxGuests || Number(form.approxGuests) < 11) return alert('Please enter the approximate number of guests (11 or more).');
      if (!form.eventNotes) return alert('Please tell us a little about your event.');
    } else {
      if (!form.time) return alert('Please select a time.');
      if (!form.partySize) return alert('Please select a party size.');
    }

    // Instant format check before the round trip; the server re-validates and
    // also confirms the ID belongs to a real account.
    const memberIdEntered = form.memberId.trim() !== '';
    const normalizedMemberId = memberIdEntered ? normalizeMemberId(form.memberId) : null;
    if (memberIdEntered && !normalizedMemberId) {
      setErrorMsg(MEMBER_ID_NOT_FOUND);
      return;
    }

    setLoading(true);
    try {
      if (isLargeParty) {
        await submitEnquiry({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: `${config.venueName} — Large Party Enquiry (${form.approxGuests} Guests)`,
          message: [
            `Dining Venue: ${config.venueName}`,
            `Preferred Date: ${form.date || 'Not specified'}`,
            `Approximate Party Size: ${form.approxGuests}`,
            `Occasion: ${form.occasion || 'Not specified'}`,
            `Member ID: ${normalizedMemberId || 'Not provided'}`,
            `Notes: ${form.eventNotes}`,
          ].join('\n'),
          type: 'dining-large-party',
        });
      } else {
        const res = await createReservation({
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
          diningType,
          venueName: config.venueName,
          date: form.date,
          time: form.time,
          partySize: Number(form.partySize),
          occasion: form.occasion || undefined,
          specialRequests: form.specialRequests || undefined,
          memberId: normalizedMemberId || undefined,
        });
        if (!res.success) {
          setErrorMsg(res.error);
          return;
        }
      }
      onSuccess();
      onClose();
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
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
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>{config.eyebrow}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', color: 'var(--ivory)' }}>{config.venueName}</div>
          </div>
          <span onClick={onClose} style={{ color: 'var(--ivory)', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.55, lineHeight: 1 }}>✕</span>
        </div>

        <form onSubmit={submit} style={{ padding: '2rem' }}>

          {/* Contact details */}
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

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={labelStyle}>Member ID <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input
              style={memberIdLocked
                ? { ...inputStyle, background: 'rgba(13,27,42,0.04)', color: 'rgba(13,27,42,0.4)' }
                : inputStyle}
              value={form.memberId}
              onChange={e => set('memberId', e.target.value)}
              placeholder="e.g. ELD-00142"
              disabled={memberIdLocked}
            />
            {memberIdLocked && (
              <div style={{ fontSize: '0.7rem', color: 'rgba(13,27,42,0.35)', marginTop: '0.3rem' }}>Linked to your account</div>
            )}
          </div>

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={labelStyle}>Date</label>
            <DatePicker value={form.date} onChange={d => set('date', d)} minDate={today} placeholder="Select a date" />
          </div>

          {!isLargeParty && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
              <div>
                <label style={labelStyle}>Time</label>
                <select style={selectStyle} required value={form.time} onChange={e => set('time', e.target.value)}>
                  <option value="">Select…</option>
                  {config.timeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Party Size</label>
                <select style={selectStyle} required value={form.partySize} onChange={e => set('partySize', e.target.value)}>
                  <option value="">Select…</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                  <option value={LARGE_PARTY_VALUE}>More than 10 Guests…</option>
                </select>
              </div>
            </div>
          )}

          {isLargeParty && (
            <div style={{ marginBottom: '0.875rem' }}>
              <label style={labelStyle}>Party Size</label>
              <select style={selectStyle} required value={form.partySize} onChange={e => set('partySize', e.target.value)}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                ))}
                <option value={LARGE_PARTY_VALUE}>More than 10 Guests…</option>
              </select>
            </div>
          )}

          {isLargeParty ? (
            <>
              <div style={{ marginBottom: '0.875rem' }}>
                <label style={labelStyle}>Approximate Number of Guests</label>
                <input style={inputStyle} type="number" min={11} required value={form.approxGuests} onChange={e => set('approxGuests', e.target.value)} placeholder="e.g. 25" />
              </div>
              <div style={{ marginBottom: '0.875rem' }}>
                <label style={labelStyle}>Occasion</label>
                <select style={selectStyle} value={form.occasion} onChange={e => set('occasion', e.target.value)}>
                  <option value="">Select…</option>
                  {OCCASION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Tell Us About Your Event</label>
                <textarea
                  style={textareaStyle}
                  rows={3}
                  required
                  value={form.eventNotes}
                  onChange={e => set('eventNotes', e.target.value)}
                  placeholder="Preferred time, occasion details, seating configuration, any special requirements…"
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '0.875rem' }}>
                <label style={labelStyle}>Occasion</label>
                <select style={selectStyle} value={form.occasion} onChange={e => set('occasion', e.target.value)}>
                  <option value="">Select…</option>
                  {OCCASION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Special Requests</label>
                <textarea
                  style={textareaStyle}
                  rows={3}
                  value={form.specialRequests}
                  onChange={e => set('specialRequests', e.target.value)}
                  placeholder="Dietary needs, seating preference, celebrations, or anything else we should know…"
                />
              </div>
            </>
          )}

          {errorMsg && (
            <div style={{ background: 'rgba(161,44,123,0.08)', border: '1px solid rgba(161,44,123,0.25)', borderRadius: 3, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.83rem', color: '#A12C7B', lineHeight: 1.6 }}>
              {errorMsg}
            </div>
          )}

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
            {loading ? 'Submitting…' : isLargeParty ? 'Submit Large Party Enquiry' : 'Submit Reservation Enquiry'}
          </button>
          <p style={{ fontSize: '0.7rem', color: 'rgba(13,27,42,0.42)', textAlign: 'center', marginTop: '0.75rem', lineHeight: 1.65 }}>
            This submits an enquiry. Our reservations team will contact you within 24 hours to confirm availability.
          </p>
        </form>
      </div>
    </div>
  );
}
