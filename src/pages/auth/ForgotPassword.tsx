import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

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

export default function ForgotPassword({ setPage, onToast }: { setPage: (p: string) => void; onToast: (m: string) => void }) {
  const requestReset = useMutation(api.auth.requestPasswordReset);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await requestReset({ email });
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/assets/logo-white.png" alt="Heights of Eldorado" style={{ height: 64, marginBottom: '1.25rem' }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--ivory)', marginBottom: '0.5rem' }}>
            {sent ? 'Check Your Email' : 'Reset Your Password'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(250,248,242,0.5)', lineHeight: 1.7 }}>
            {sent
              ? `If an account exists for ${email}, you will receive a reset link shortly.`
              : 'Enter your email address and we will send you a reset link.'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={submit} style={{ background: 'var(--ivory)', borderRadius: 4, padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={label}>Email Address</label>
              <input style={field} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.9rem', background: 'var(--navy)', color: 'var(--gold)',
              border: 'none', borderRadius: 3, fontSize: '0.7rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', fontFamily: "'Jost',sans-serif",
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            }}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div style={{ background: 'var(--ivory)', borderRadius: 4, padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
            <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.65)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              We have sent a password reset link to your email address. Please check your inbox.
            </p>
            <button type="button" onClick={() => setPage('signin')} style={{
              width: '100%', padding: '0.9rem', background: 'var(--navy)', color: 'var(--gold)',
              border: 'none', borderRadius: 3, fontSize: '0.7rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', fontFamily: "'Jost',sans-serif", cursor: 'pointer',
            }}>
              Return to Sign In
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button type="button" onClick={() => setPage('signin')} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'rgba(250,248,242,0.4)', cursor: 'pointer', letterSpacing: '0.08em' }}>
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
