import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import AccountLayout from './AccountLayout';

export default function MySavedExperiences({ setPage }: { setPage: (p: string) => void }) {
  const { token } = useAuth();
  const saved = useQuery(api.account.getSavedExperiences, token ? { token } : 'skip') ?? [];
  const removeExp = useMutation(api.account.removeSavedExperience);

  const handleRemove = async (name: string) => {
    if (!token) return;
    await removeExp({ token, experienceName: name });
  };

  return (
    <AccountLayout current="my-experiences" setPage={setPage}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--navy)', marginBottom: '0.5rem' }}>Saved Experiences</h2>
      <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.5)', marginBottom: '2rem', lineHeight: 1.7 }}>
        Experiences you have saved. Return to them whenever you are ready to make an enquiry.
      </p>

      {saved.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontStyle: 'italic', color: 'rgba(13,27,42,0.5)', marginBottom: '1.25rem' }}>
            Save the experiences that catch your eye, and return to them whenever you are ready.
          </p>
          <button className="btn-primary" onClick={() => setPage('experiences')}>Explore Experiences</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem' }}>
          {saved.map(exp => (
            <div key={exp._id} style={{ background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.25rem' }}>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', background: 'var(--navy)', display: 'inline-block', padding: '0.25rem 0.55rem', borderRadius: 2, marginBottom: '0.65rem' }}>
                {exp.experienceCategory}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 500, color: 'var(--navy)', marginBottom: '0.5rem' }}>{exp.experienceName}</div>
              {exp.experienceDesc && <p style={{ fontSize: '0.8rem', color: 'rgba(13,27,42,0.55)', lineHeight: 1.65, marginBottom: '1rem' }}>{exp.experienceDesc}</p>}
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => setPage('experiences')}>View</button>
                <button onClick={() => handleRemove(exp.experienceName)} style={{ background: 'none', border: '1px solid rgba(13,27,42,0.2)', borderRadius: 3, padding: '0.45rem 0.9rem', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', color: 'rgba(13,27,42,0.45)', fontFamily: "'Jost',sans-serif" }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
