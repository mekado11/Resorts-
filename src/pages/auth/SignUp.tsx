import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';

const field: React.CSSProperties = {
  width: '100%', padding: '0.85rem 1rem',
  border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3,
  fontSize: '0.95rem', fontFamily: "'Jost',sans-serif", color: '#0D1B2A',
  background: '#fff', boxSizing: 'border-box',
};
const label: React.CSSProperties = {
  display: 'block', fontSize: '0.65rem', letterSpacing: '0.14em',
  textTransform: 'uppercase', color: 'rgba(13,27,42,0.5)', marginBottom: '0.4rem',
};

export default function SignUp({ setPage, onToast }: { setPage: (p: string) => void; onToast: (m: string) => void }) {
  const { signIn } = useAuth();
  const signUpMutation = useMutation(api.auth.signUp);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    mobile: '', termsAccepted: false, marketingConsent: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.termsAccepted) { setError('Please accept the Terms and Privacy Policy to continue.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    const result = await signUpMutation({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      mobile: form.mobile || undefined,
      marketingConsent: form.marketingConsent,
    });
    if (result.success) {
      // Auto sign in after signup
      await signIn(form.email, form.password);
      onToast('Welcome to Eldorado. Your account has been created.');
      setPage('my-eldorado');
    } else {
      setError(result.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/assets/logo-white.png" alt="Heights of Eldorado" style={{ height: 64, marginBottom: '1.25rem' }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--ivory)', marginBottom: '0.5rem' }}>Create Your Eldorado Account</h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(250,248,242,0.5)', lineHeight: 1.7 }}>Your stays, your preferences, remembered.</p>
        </div>

        <form onSubmit={submit} style={{ background: 'var(--ivory)', borderRadius: 4, padding: '2rem' }}>
          {error && (
            <div style={{ background: 'rgba(161,44,123,0.08)', border: '1px solid rgba(161,44,123,0.25)', borderRadius: 3, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.83rem', color: '#A12C7B' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
            <div>
              <label style={label}>First Name</label>
              <input style={field} required value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First name" />
            </div>
            <div>
              <label style={label}>Last Name</label>
              <input style={field} required value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Last name" />
            </div>
          </div>

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={label}>Email Address</label>
            <input style={field} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" autoComplete="email" />
          </div>

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={label}>Mobile Number <span style={{ textTransform: 'none', fontSize: '0.7rem', opacity: 0.6 }}>(optional)</span></label>
            <input style={field} type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="+234 xxx xxxx xxx" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={label}>Password</label>
              <input style={field} type="password" required value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" autoComplete="new-password" />
            </div>
            <div>
              <label style={label}>Confirm Password</label>
              <input style={field} type="password" required value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat password" />
            </div>
          </div>

          {/* Required terms */}
          <label style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', marginBottom: '0.875rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.termsAccepted} onChange={e => set('termsAccepted', e.target.checked)} style={{ marginTop: '0.2rem', accentColor: 'var(--navy)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(13,27,42,0.65)', lineHeight: 1.6 }}>
              I agree to the <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms and Privacy Policy</span>
            </span>
          </label>

          {/* Optional marketing — separate from terms */}
          <label style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', marginBottom: '1.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.marketingConsent} onChange={e => set('marketingConsent', e.target.checked)} style={{ marginTop: '0.2rem', accentColor: 'var(--navy)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(13,27,42,0.5)', lineHeight: 1.6 }}>
              I would like to receive news, offers, and invitations from Eldorado
            </span>
          </label>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.9rem', background: 'var(--navy)', color: 'var(--gold)',
            border: 'none', borderRadius: 3, fontSize: '0.7rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', fontFamily: "'Jost',sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
          }}>
            {loading ? 'Creating Account…' : 'Create My Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.5)' }}>
              Already have an account?{' '}
              <button type="button" onClick={() => setPage('signin')} style={{ background: 'none', border: 'none', fontSize: '0.82rem', color: 'var(--navy)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0 }}>
                Sign In
              </button>
            </span>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button type="button" onClick={() => setPage('home')} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'rgba(250,248,242,0.4)', cursor: 'pointer', letterSpacing: '0.08em' }}>
            ← Return to Eldorado
          </button>
        </div>
      </div>
    </div>
  );
}
