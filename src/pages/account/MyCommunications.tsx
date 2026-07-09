import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import AccountLayout from './AccountLayout';

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.9rem 0', borderBottom: '1px solid rgba(13,27,42,0.07)' }}>
      <div style={{ paddingRight: '1rem' }}>
        <div style={{ fontSize: '0.88rem', color: 'var(--navy)', fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: '0.75rem', color: 'rgba(13,27,42,0.45)', marginTop: '0.2rem', lineHeight: 1.5 }}>{desc}</div>}
      </div>
      <button type="button" onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 12, background: value ? 'var(--navy)' : 'rgba(13,27,42,0.18)',
        border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s',
      }}>
        <span style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, left: value ? 23 : 3, transition: 'left 0.2s' }} />
      </button>
    </div>
  );
}

export default function MyCommunications({ setPage, onToast }: { setPage: (p: string) => void; onToast: (m: string) => void }) {
  const { token } = useAuth();
  const commPrefs = useQuery(api.account.getCommPrefs, token ? { token } : 'skip');
  const updatePrefs = useMutation(api.account.updateCommPrefs);

  const [prefs, setPrefs] = useState({ marketingEmail: false, marketingSMS: false, eventInvitations: false, preferredStayContact: 'none' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (commPrefs) setPrefs({ marketingEmail: commPrefs.marketingEmail, marketingSMS: commPrefs.marketingSMS, eventInvitations: commPrefs.eventInvitations, preferredStayContact: commPrefs.preferredStayContact });
  }, [commPrefs?._id]);

  const set = (k: string, v: any) => setPrefs(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!token) return;
    setLoading(true);
    await updatePrefs({ token, ...prefs });
    setLoading(false);
    onToast('Communication preferences saved.');
  };

  return (
    <AccountLayout current="my-communications" setPage={setPage}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--navy)', marginBottom: '0.4rem' }}>Communication Preferences</h2>
      <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.5)', marginBottom: '2rem', lineHeight: 1.7 }}>You are in control of how Eldorado communicates with you.</p>

      {/* Service — always on */}
      <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Service Communications</div>
        <p style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.5)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          These are required to manage your account and bookings. They cannot be disabled.
        </p>
        <Toggle label="Booking confirmations and updates" value={true} onChange={() => {}} />
        <Toggle label="Password reset and security alerts" value={true} onChange={() => {}} />
        <Toggle label="Stay-related notifications" value={true} onChange={() => {}} />
      </div>

      {/* Marketing — optional */}
      <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Marketing Communications</div>
        <Toggle label="Email offers and promotions" desc="News, rates, and occasional Eldorado offers." value={prefs.marketingEmail} onChange={v => set('marketingEmail', v)} />
        <Toggle label="SMS updates" desc="Occasional messages to your mobile number." value={prefs.marketingSMS} onChange={v => set('marketingSMS', v)} />
        <Toggle label="Event invitations" desc="Exclusive events, openings, and curated experiences." value={prefs.eventInvitations} onChange={v => set('eventInvitations', v)} />
      </div>

      {/* In-stay contact */}
      <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>During Your Stay</div>
        <p style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.5)', marginBottom: '0.75rem' }}>How would you prefer Eldorado to reach you during a stay?</p>
        <select value={prefs.preferredStayContact} onChange={e => set('preferredStayContact', e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.85rem', fontFamily: "'Jost',sans-serif", color: 'var(--navy)', background: '#fff' }}>
          <option value="none">No preference</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
          <option value="phone">Phone Call</option>
        </select>
      </div>

      <button onClick={save} disabled={loading} style={{ padding: '0.75rem 2rem', background: 'var(--navy)', color: 'var(--gold)', border: 'none', borderRadius: 3, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Saving…' : 'Save Preferences'}
      </button>
    </AccountLayout>
  );
}
