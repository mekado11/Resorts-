import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface ContactProps { onToast: (msg: string) => void; }

const SUBJECTS = [
  { value:'room',        label:'Room Reservation (Pre-Opening)' },
  { value:'membership',  label:'Membership Application' },
  { value:'wedding',     label:'Wedding & Events — Ekom Iban' },
  { value:'corporate',   label:'Corporate Account' },
  { value:'partnership', label:'Partnership Enquiry' },
  { value:'church',      label:'Church / Convention Hosting' },
  { value:'government',  label:'Government Protocol' },
  { value:'general',     label:'General Enquiry' },
];

export default function Contact({ onToast }: ContactProps) {
  const submit = useMutation(api.enquiries.submit);
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'', type:'general' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selected = SUBJECTS.find(s => s.label === form.subject);
      await submit({ name:form.name, email:form.email, phone:form.phone||undefined, subject:form.subject, message:form.message, type: selected?.value || 'general' });
      onToast('Your message has been received. We will respond within 24 hours.');
      setForm({ name:'', email:'', phone:'', subject:'', message:'', type:'general' });
    } catch { alert('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ position:'relative', height:'50vh', minHeight:350, display:'flex', alignItems:'flex-end', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/entrance-hero.jpg')", backgroundSize:'cover', backgroundPosition:'center 50%' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(13,27,42,0.92) 0%,rgba(13,27,42,0.3) 100%)' }} />
        <div style={{ position:'relative', zIndex:2, padding:'4rem clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.75rem' }}>Get in Touch</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:300, color:'var(--ivory)' }}>Contact Eldorado</h1>
        </div>
      </div>

      <section className="section section-ivory">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:'5rem', maxWidth:1100, margin:'0 auto' }}>
          <div>
            <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">Reach Us</span></div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:300, marginBottom:'1.5rem' }}>We are at your service</h2>
            {[
              { label:'Address', val:'Lagos-Calabar Coastal Road\nNung Ette, Ibesikpo Asutan\nUyo, Akwa Ibom State, Nigeria' },
              { label:'Email', val:'info@obadear.com' },
              { label:'Development Enquiries', val:'Heights of Eldorado Luxury Hotels & Resorts Ltd\nCAC Registered · Nigeria' },
              { label:'Opening', val:'Accepting pre-opening reservations\nand enquiries now' },
            ].map(i => (
              <div key={i.label} style={{ marginBottom:'1.75rem' }}>
                <div style={{ fontSize:'0.6rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.35rem' }}>{i.label}</div>
                <p style={{ fontSize:'0.9rem', lineHeight:1.9, color:'rgba(13,27,42,0.75)', whiteSpace:'pre-line' }}>{i.val}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="gold-divider"><div className="gold-divider-line" /><span className="gold-divider-label">Send a Message</span></div>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                <div><label className="form-label">Full Name</label><input className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div><label className="form-label">Email</label><input className="form-input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
              </div>
              <div style={{ marginBottom:'1rem' }}><label className="form-label">Phone (optional)</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div style={{ marginBottom:'1rem' }}>
                <label className="form-label">Subject</label>
                <select className="form-input" required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                  <option value="">Select a subject…</option>
                  {SUBJECTS.map(s => <option key={s.value} value={s.label}>{s.label}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:'1.5rem' }}><label className="form-label">Message</label><textarea className="form-input" rows={5} required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us how we can assist you…" style={{ resize:'vertical' }} /></div>
              <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
