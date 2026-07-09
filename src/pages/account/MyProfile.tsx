import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import AccountLayout from './AccountLayout';

const field: React.CSSProperties = { width: '100%', padding: '0.7rem 0.85rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.88rem', fontFamily: "'Jost',sans-serif", color: '#0D1B2A', background: '#fff', boxSizing: 'border-box' };
const label: React.CSSProperties = { display: 'block', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', marginBottom: '0.35rem' };

export default function MyProfile({ setPage, onToast }: { setPage: (p: string) => void; onToast: (m: string) => void }) {
  const { user, token } = useAuth();
  const updateProfile = useMutation(api.auth.updateProfile);

  const [form, setForm] = useState({ firstName: '', lastName: '', preferredName: '', mobile: '', country: '', dateOfBirth: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      preferredName: user.preferredName || '',
      mobile: user.mobile || '',
      country: user.country || '',
      dateOfBirth: user.dateOfBirth || '',
    });
  }, [user?._id]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    const result = await updateProfile({ token, ...form, preferredName: form.preferredName || undefined, mobile: form.mobile || undefined, country: form.country || undefined, dateOfBirth: form.dateOfBirth || undefined });
    setLoading(false);
    if (result.success) onToast('Profile updated.');
  };

  return (
    <AccountLayout current="my-profile" setPage={setPage}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--navy)', marginBottom: '0.4rem' }}>Personal Details</h2>
      <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.5)', marginBottom: '2rem', lineHeight: 1.7 }}>Your information, exactly as you would like us to use it.</p>

      <form onSubmit={submit} style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.75rem', maxWidth: 560 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
          <div><label style={label}>First Name</label><input style={field} value={form.firstName} onChange={e => set('firstName', e.target.value)} /></div>
          <div><label style={label}>Last Name</label><input style={field} value={form.lastName} onChange={e => set('lastName', e.target.value)} /></div>
        </div>

        <div style={{ marginBottom: '0.875rem' }}>
          <label style={label}>Preferred Name <span style={{ textTransform: 'none', opacity: 0.6 }}>(how you like to be greeted)</span></label>
          <input style={field} value={form.preferredName} onChange={e => set('preferredName', e.target.value)} placeholder="e.g. Mike" />
        </div>

        <div style={{ marginBottom: '0.875rem' }}>
          <label style={label}>Email Address</label>
          <input style={{ ...field, background: 'rgba(13,27,42,0.04)', color: 'rgba(13,27,42,0.4)' }} value={user?.email || ''} disabled />
          <div style={{ fontSize: '0.7rem', color: 'rgba(13,27,42,0.35)', marginTop: '0.3rem' }}>To change your email address, please contact Eldorado directly.</div>
        </div>

        <div style={{ marginBottom: '0.875rem' }}>
          <label style={label}>Mobile Number</label>
          <input style={field} type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="+234 xxx xxxx xxx" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={label}>Country</label>
            <input style={field} value={form.country} onChange={e => set('country', e.target.value)} placeholder="Nigeria" />
          </div>
          <div>
            <label style={label}>Date of Birth <span style={{ textTransform: 'none', opacity: 0.6 }}>(optional)</span></label>
            <input style={field} type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={loading} style={{
          padding: '0.75rem 2rem', background: 'var(--navy)', color: 'var(--gold)', border: 'none', borderRadius: 3,
          fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif",
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
        }}>
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </AccountLayout>
  );
}
