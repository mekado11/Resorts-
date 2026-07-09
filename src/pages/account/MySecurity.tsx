import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import AccountLayout from './AccountLayout';

const field: React.CSSProperties = { width: '100%', padding: '0.7rem 0.85rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3, fontSize: '0.88rem', fontFamily: "'Jost',sans-serif", color: '#0D1B2A', background: '#fff', boxSizing: 'border-box' };
const label: React.CSSProperties = { display: 'block', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', marginBottom: '0.35rem' };

export default function MySecurity({ setPage, onToast }: { setPage: (p: string) => void; onToast: (m: string) => void }) {
  const { user, token, signOut } = useAuth();
  const changePassword = useMutation(api.auth.changePassword);
  const signOutAll = useMutation(api.auth.signOutAll);

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPw !== pwForm.confirm) { setPwError('New passwords do not match.'); return; }
    if (pwForm.newPw.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    if (!token) return;
    setPwLoading(true);
    const result = await changePassword({ token, currentPassword: pwForm.current, newPassword: pwForm.newPw });
    setPwLoading(false);
    if (result.success) {
      onToast('Password changed successfully.');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } else {
      setPwError(result.error || 'Something went wrong.');
    }
  };

  const handleSignOutAll = async () => {
    if (!token) return;
    await signOutAll({ token });
    await signOut();
    setPage('home');
  };

  return (
    <AccountLayout current="my-security" setPage={setPage}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--navy)', marginBottom: '0.4rem' }}>Security</h2>
      <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.5)', marginBottom: '2rem', lineHeight: 1.7 }}>Manage your account security settings.</p>

      {/* Last login */}
      {user?.lastLoginAt && (
        <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.25rem 1.5rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'rgba(13,27,42,0.5)' }}>
          Last signed in: {new Date(user.lastLoginAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {/* Change password */}
      <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem', marginBottom: '1.25rem', maxWidth: 480 }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>Change Password</div>
        <form onSubmit={handlePasswordChange}>
          {pwError && <div style={{ fontSize: '0.82rem', color: '#A12C7B', background: 'rgba(161,44,123,0.06)', padding: '0.65rem 0.85rem', borderRadius: 3, marginBottom: '1rem' }}>{pwError}</div>}
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={label}>Current Password</label>
            <input style={field} type="password" required value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="••••••••" />
          </div>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={label}>New Password</label>
            <input style={field} type="password" required value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} placeholder="Min. 8 characters" />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={label}>Confirm New Password</label>
            <input style={field} type="password" required value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat new password" />
          </div>
          <button type="submit" disabled={pwLoading} style={{ padding: '0.65rem 1.5rem', background: 'var(--navy)', color: 'var(--gold)', border: 'none', borderRadius: 3, fontSize: '0.67rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: pwLoading ? 'not-allowed' : 'pointer', opacity: pwLoading ? 0.6 : 1 }}>
            {pwLoading ? 'Changing…' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Sign out all sessions */}
      <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>Active Sessions</div>
        <p style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.5)', marginBottom: '1rem', lineHeight: 1.65 }}>
          This will sign you out of all devices, including this one.
        </p>
        <button onClick={handleSignOutAll} style={{ padding: '0.65rem 1.5rem', background: 'none', border: '1px solid rgba(161,44,123,0.4)', borderRadius: 3, fontSize: '0.67rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: 'pointer', color: '#A12C7B' }}>
          Sign Out of All Sessions
        </button>
      </div>

      {/* Account deletion note */}
      <div style={{ background: 'rgba(13,27,42,0.03)', border: '1px solid rgba(13,27,42,0.08)', borderRadius: 4, padding: '1.25rem 1.5rem' }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.35)', marginBottom: '0.5rem' }}>Account Deletion</div>
        <p style={{ fontSize: '0.8rem', color: 'rgba(13,27,42,0.45)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
          To request account deletion, please contact Eldorado directly. Your booking and transaction records may be retained as required by applicable law, but your preferences, saved experiences, and profile information will be removed.
        </p>
        <button onClick={() => setPage('contact')} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.78rem', color: 'rgba(13,27,42,0.5)', textDecoration: 'underline', cursor: 'pointer' }}>
          Contact Eldorado
        </button>
      </div>
    </AccountLayout>
  );
}
