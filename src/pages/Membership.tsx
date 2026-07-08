import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const TIERS = [
  {
    id: 'member',
    name: 'Member',
    tag: 'Annual Membership',
    accent: 'rgba(201,168,76,0.7)',
    perks: [
      '1 complimentary night per year (Classic Room)',
      '10% discount on room bookings, including guaranteed discounts on all events that require ticketing',
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
    featured: true,
    perks: [
      'Benefits: Member +',
      '2 complimentary nights per year',
      'Room upgrade when available',
      '15% room discount after free nights',
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
    perks: [
      'Benefits: Reserve +',
      '4 complimentary nights per year',
      'Guaranteed upgrade to Executive Room (when available)',
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
    perks: [
      'Benefits: Exclusive',
      '8 complimentary nights over membership term',
      'Guaranteed suite priority',
      'Personal Eldorado Correspondent',
      'Private experiences curated by the resort',
      'VIP invitations to signature Eldorado events',
      'Priority reservations year-round',
      'Annual audience with the CEO',
      'Ability to nominate community projects through Eldorado Cares',
      'Recognition within the Eldorado Circle',
    ],
  },
];

interface MembershipProps { onToast: (msg: string) => void; }

export default function Membership({ onToast }: MembershipProps) {
  const applyMembership = useMutation(api.memberships.apply);
  const [selected, setSelected] = useState<string|null>(null);
  const [form, setForm] = useState({ name:'', email:'', phone:'', organisation:'', notes:'' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    try {
      await applyMembership({ name:form.name, email:form.email, phone:form.phone, tier:selected, organisation:form.organisation||undefined, notes:form.notes||undefined });
      onToast('Your membership application has been received. Our team will be in touch within 48 hours.');
      setForm({ name:'', email:'', phone:'', organisation:'', notes:'' });
      setSelected(null);
    } catch { alert('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ position:'relative', height:'60vh', minHeight:400, display:'flex', alignItems:'flex-end', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/entrance-hero.jpg')", backgroundSize:'cover', backgroundPosition:'center 60%' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(13,27,42,0.95) 0%,rgba(13,27,42,0.3) 100%)' }} />
        <div style={{ position:'relative', zIndex:2, padding:'4rem clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.75rem' }}>Exclusive Membership</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.5rem,5vw,4.5rem)', fontWeight:300, color:'var(--ivory)' }}>The Eldorado Circle</h1>
        </div>
      </div>

      <section className="section section-ivory">
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.15rem', fontStyle:'italic', color:'rgba(13,27,42,0.65)', maxWidth:600, margin:'0 auto' }}>Eldorado membership is more than preferential access — it is permanent belonging. A select community of Nigeria's most discerning individuals, united by an uncompromising standard of living.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:'1.5rem', maxWidth:1160, margin:'0 auto 4rem', alignItems:'start' }}>
          {TIERS.map(t => {
            const isSel = selected === t.id;
            return (
              <div key={t.id} onClick={() => setSelected(t.id)} style={{
                border: isSel ? `2px solid ${t.accent}` : '1px solid var(--linen)',
                borderRadius: 5,
                cursor: 'pointer',
                background: isSel ? `rgba(201,168,76,0.04)` : '#fff',
                transition: 'all 0.25s',
                overflow: 'hidden',
                boxShadow: isSel ? `0 8px 32px rgba(0,0,0,0.08)` : 'none',
              }}>
                {/* Tier header band */}
                <div style={{
                  background: t.accent,
                  padding: '0.85rem 1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: t.id === 'member' ? 'rgba(13,27,42,0.9)' : '#fff',
                  }}>{t.name}</span>
                  <span style={{
                    fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: t.id === 'member' ? 'rgba(13,27,42,0.6)' : 'rgba(255,255,255,0.65)',
                    whiteSpace: 'nowrap',
                  }}>{t.tag}</span>
                </div>

                {/* Benefits list */}
                <div style={{ padding: '1.5rem' }}>
                  <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                    {t.perks.map((p, pi) => (
                      <li key={pi} style={{
                        fontSize: '0.8rem',
                        color: pi === 0 && p.startsWith('Benefits:') ? t.accent : 'rgba(13,27,42,0.7)',
                        fontWeight: pi === 0 && p.startsWith('Benefits:') ? 600 : 400,
                        paddingLeft: pi === 0 && p.startsWith('Benefits:') ? 0 : '1rem',
                        position: 'relative',
                        lineHeight: 1.6,
                      }}>
                        {!(pi === 0 && p.startsWith('Benefits:')) && (
                          <span style={{ position:'absolute', left:0, color: t.accent, fontWeight:700 }}>·</span>
                        )}
                        {p}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={e => { e.stopPropagation(); setSelected(t.id); }}
                    style={{
                      marginTop: '1.25rem', width: '100%',
                      padding: '0.7rem', border: `1px solid ${t.accent}`,
                      borderRadius: 3, background: isSel ? t.accent : 'transparent',
                      color: isSel ? (t.id === 'member' ? '#0D1B2A' : '#fff') : 'rgba(13,27,42,0.75)',
                      fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                      cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Jost',sans-serif",
                    }}
                  >
                    {t.id === 'pinnacle' ? 'Request Consideration' : 'Apply for Membership'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selected && (
          <div style={{ maxWidth:560, margin:'0 auto', background:'#fff', border:'1px solid var(--linen)', borderRadius:4, padding:'2rem' }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.5rem', marginBottom:'1.5rem' }}>
              Apply — {TIERS.find(t=>t.id===selected)?.name}
            </h3>
            <form onSubmit={submit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                <div><label className="form-label">Full Name</label><input className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div><label className="form-label">Email</label><input className="form-input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
              </div>
              <div style={{ marginBottom:'1rem' }}><label className="form-label">Phone</label><input className="form-input" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div style={{ marginBottom:'1rem' }}><label className="form-label">Organisation (optional)</label><input className="form-input" value={form.organisation} onChange={e=>setForm({...form,organisation:e.target.value})} /></div>
              <div style={{ marginBottom:'1.5rem' }}><label className="form-label">Why Eldorado? (optional)</label><textarea className="form-input" rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={{ resize:'vertical' }} /></div>
              <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* Partnerships */}
        <div style={{ textAlign:'center', maxWidth:700, margin:'4rem auto 0' }}>
          <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.5vw,2.5rem)', fontWeight:300, marginBottom:'1rem' }}>Strategic Partnerships</h2>
          <p style={{ color:'rgba(13,27,42,0.65)', lineHeight:1.9, marginBottom:'1.5rem' }}>Eldorado is actively building partnerships with institutions that share our standard of excellence — spanning aviation, hospitality, faith communities, and state government.</p>
          <div style={{ display:'inline-block', padding:'1rem 2.5rem', border:'1px solid var(--gold)', borderRadius:3, fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', color:'var(--gold)', letterSpacing:'0.12em' }}>
            Partnerships — Coming Soon
          </div>
        </div>
      </section>
    </div>
  );
}
