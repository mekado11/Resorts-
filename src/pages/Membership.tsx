import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const TIERS = [
  { id:'elite',         name:'Member Elite',         price:'Coming soon', perks:['Priority booking access','15% dining discount','Early access to events','Member concierge line'] },
  { id:'commissioner',  name:"Commissioner's Circle", price:'Coming soon', perks:['All Elite benefits','Guaranteed room availability','25% F&B discount','Monthly suite upgrade','Guest privileges for 2'] },
  { id:'legacy',        name:'Premium Legacy',        price:'Coming soon', perks:['All Commissioner benefits','Dedicated relationship manager','35% all-service discount','Annual gala invitation','Airport protocol service'] },
  { id:'patrone',       name:'The Patroné',           price:'Price on Request', perks:['All Legacy benefits','Private floor access','Unlimited complimentary nights','Board of Patrons invitation','Legacy naming opportunity'] },
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

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.5rem', maxWidth:1100, margin:'0 auto 4rem' }}>
          {TIERS.map(t => (
            <div key={t.id} onClick={() => setSelected(t.id)} style={{
              border: selected===t.id ? '2px solid var(--gold)' : '1px solid var(--linen)',
              borderRadius:4, padding:'1.75rem', cursor:'pointer',
              background: selected===t.id ? 'rgba(201,168,76,0.05)' : '#fff',
              transition:'all 0.2s',
            }}>
              <div style={{ fontSize:'0.62rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>{t.id === 'patrone' ? 'Ultra-Premium' : 'Annual'}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.35rem', marginBottom:'0.35rem' }}>{t.name}</div>
              <div style={{ fontSize:'0.82rem', color:'var(--gold)', marginBottom:'1.25rem', fontWeight:500 }}>{t.price}</div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {t.perks.map(p => (
                  <li key={p} style={{ fontSize:'0.8rem', color:'rgba(13,27,42,0.7)', paddingLeft:'1rem', position:'relative' }}>
                    <span style={{ position:'absolute', left:0, color:'var(--gold)' }}>·</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
