import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const field: React.CSSProperties = {
  width: '100%', padding: '0.85rem 1rem',
  border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3,
  fontSize: '0.95rem', fontFamily: "'Jost',sans-serif", color: '#0D1B2A',
  background: '#fff', boxSizing: 'border-box', outline: 'none',
};
const label: React.CSSProperties = {
  display: 'block', fontSize: '0.65rem', letterSpacing: '0.14em',
  textTransform: 'uppercase', color: 'rgba(13,27,42,0.5)', marginBottom: '0.4rem',
};

export default function SignIn({ setPage, onToast }: { setPage: (p: string) => void; onToast: (m: string) => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.success) {
      onToast('Welcome back.');
      setPage('my-eldorado');
    } else {
      setError(result.error || 'Something went wrong.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img src="/assets/logo-white.png" alt="Heights of Eldorado" style={{ height: 72, marginBottom: '1.5rem' }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--ivory)', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(250,248,242,0.55)', lineHeight: 1.7 }}>
            Sign in to manage your stays, preferences, and everything Eldorado remembers for you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ background: 'var(--ivory)', borderRadius: 4, padding: '2rem' }}>
          {error && (
            <div style={{ background: 'rgba(161,44,123,0.08)', border: '1px solid rgba(161,44,123,0.25)', borderRadius: 3, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.83rem', color: '#A12C7B' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.1rem' }}>
            <label style={label}>Email Address</label>
            <input style={field} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={label}>Password</label>
            <input style={field} type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.9rem', background: 'var(--navy)', color: 'var(--gold)',
            border: 'none', borderRadius: 3, fontSize: '0.7rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', fontFamily: "'Jost',sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
          }}>
            {loading ? 'Signing In…' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button type="button" onClick={() => setPage('forgot-password')} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'rgba(13,27,42,0.5)', cursor: 'pointer', textDecoration: 'underline' }}>
              Forgot Password
            </button>
            <span style={{ fontSize: '0.82rem', color: 'rgba(13,27,42,0.5)' }}>
              New to Eldorado?{' '}
              <button type="button" onClick={() => setPage('signup')} style={{ background: 'none', border: 'none', fontSize: '0.82rem', color: 'var(--navy)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0 }}>
                Create an Account
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
