import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface Props {
  onClose: () => void;
}

type ListType = 'waitlist' | 'newsletter' | 'both';

export default function SubscribePopup({ onClose }: Props) {
  const subscribe = useMutation(api.subscribers.subscribe);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [listType, setListType] = useState<ListType>('waitlist');
  const [step, setStep] = useState<'form' | 'confirm-close' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ease = 'cubic-bezier(0.16,1,0.3,1)';

  const handleDismiss = () => {
    if (step === 'form') {
      setStep('confirm-close');
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await subscribe({ name, email, listType });
      setStep('success');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      onClick={handleDismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(13,27,42,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0F2035',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 6,
          padding: 'clamp(2rem,5vw,3.5rem)',
          maxWidth: 520,
          width: '100%',
          position: 'relative',
          animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(250,248,242,0.35)', fontSize: '1.3rem', lineHeight: 1,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,248,242,0.35)')}
          aria-label="Close"
        >
          ×
        </button>

        {step === 'confirm-close' ? (
          /* Confirm close screen */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', justifyContent: 'center' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.3)', maxWidth: 60 }} />
              <div style={{ width: 6, height: 6, background: 'var(--gold)', transform: 'rotate(45deg)' }} />
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.3)', maxWidth: 60 }} />
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.6rem,3.5vw,2.2rem)',
              fontWeight: 300, color: '#FAF8F2',
              lineHeight: 1.2, marginBottom: '1.1rem',
            }}>
              Are you sure you want to leave?
            </h2>
            <p style={{
              fontSize: '0.98rem', fontWeight: 300,
              color: 'rgba(250,248,242,0.55)', lineHeight: 1.85,
              marginBottom: '2.25rem', maxWidth: 360, margin: '0 auto 2.25rem',
            }}>
              You may miss your chance to be among the first to experience Eldorado. Priority access goes fast — and once the list closes, it closes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center' }}>
              <button
                className="btn-primary"
                onClick={() => setStep('form')}
                style={{ width: '100%', maxWidth: 320, justifyContent: 'center' }}
              >
                Take Me Back — I'm In
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.75rem', letterSpacing: '0.15em',
                  color: 'rgba(250,248,242,0.25)',
                  textTransform: 'uppercase', padding: '0.5rem',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,248,242,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,248,242,0.25)')}
              >
                No thanks, I'll take my chances
              </button>
            </div>
          </div>
        ) : step === 'form' ? (
          <>
            {/* Gold ornament line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.3)' }} />
              <div style={{ width: 6, height: 6, background: 'var(--gold)', transform: 'rotate(45deg)' }} />
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.3)' }} />
            </div>

            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', marginBottom: '0.75rem' }}>
              Be Part of the Story
            </div>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem,4vw,2.6rem)',
              fontWeight: 300, color: '#FAF8F2',
              lineHeight: 1.15, marginBottom: '0.85rem',
            }}>
              Eldorado Opens Its Doors.<br />Be First Through Them.
            </h2>

            <p style={{
              fontSize: '0.95rem', fontWeight: 300,
              color: 'rgba(250,248,242,0.55)', lineHeight: 1.8,
              marginBottom: '2rem',
            }}>
              Join the waiting list for priority room reservations, or stay informed as Eldorado rises — milestone by milestone.
            </p>

            {/* List type selector */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              {([
                { val: 'waitlist',   label: 'Priority Waiting List', sub: 'First access to rooms' },
                { val: 'newsletter', label: 'Stay Informed',         sub: 'Journey updates only' },
                { val: 'both',       label: 'Both',                  sub: 'Everything' },
              ] as { val: ListType; label: string; sub: string }[]).map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setListType(opt.val)}
                  style={{
                    flex: 1, minWidth: 120,
                    padding: '0.85rem 1rem',
                    background: listType === opt.val ? 'rgba(201,168,76,0.12)' : 'transparent',
                    border: `1px solid ${listType === opt.val ? 'var(--gold)' : 'rgba(250,248,242,0.12)'}`,
                    borderRadius: 3, cursor: 'pointer',
                    transition: `all 0.2s ${ease}`,
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', color: listType === opt.val ? 'var(--gold)' : 'rgba(250,248,242,0.75)', marginBottom: '0.2rem' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(250,248,242,0.35)' }}>{opt.sub}</div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Your Name</label>
                <input
                  className="form-input"
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: '#FAF8F2' }}
                  placeholder="First & last name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: '#FAF8F2' }}
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p style={{ fontSize: '0.82rem', color: '#e06b6b' }}>{error}</p>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ marginTop: '0.5rem', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Submitting…' : listType === 'waitlist' ? 'Reserve My Place' : listType === 'newsletter' ? 'Keep Me Informed' : 'Join Both Lists'}
              </button>

              <p style={{ fontSize: '0.72rem', color: 'rgba(250,248,242,0.25)', textAlign: 'center', lineHeight: 1.6 }}>
                No spam. No obligation. You may unsubscribe at any time.
              </p>
            </form>
          </>
        ) : (
          /* Success state */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>✦</div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', marginBottom: '0.75rem' }}>
              You're On the List
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem,4vw,2.4rem)',
              fontWeight: 300, color: '#FAF8F2',
              lineHeight: 1.2, marginBottom: '1rem',
            }}>
              Eldorado Welcomes You
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(250,248,242,0.5)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 360, margin: '0 auto 2rem' }}>
              {listType === 'waitlist'
                ? "You'll be among the first to receive room reservation access when we open. Watch for a confirmation from the Eldorado team."
                : listType === 'newsletter'
                ? "We'll keep you informed as each milestone is reached. Every update, directly from us."
                : "You'll receive both priority reservation access and milestone updates from the Eldorado team."}
            </p>
            <button className="btn-ghost" onClick={onClose}>
              Continue Exploring →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
