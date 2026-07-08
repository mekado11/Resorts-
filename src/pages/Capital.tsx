import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const PILLARS = [
  {
    n: '01',
    title: 'A Real Asset',
    desc: 'Land acquired and registered in Akwa Ibom State. Eldorado is a permanent hospitality asset rising along one of Nigeria\'s most strategically positioned development corridors — the Lagos–Calabar Coastal Road.',
  },
  {
    n: '02',
    title: 'A Distinctive Market Position',
    desc: 'Not another generic hotel. Eldorado is designed around luxury hospitality, cultural weddings, international conferences, destination dining, wellness, and signature Nigerian experiences. There is nothing like it in the region.',
  },
  {
    n: '03',
    title: 'Multiple Revenue Engines',
    desc: 'Room revenue is only one part of the business. Weddings, corporate events, The Grand Ballroom, The Still Room spa, Gaffer\'s Club, fine dining, private celebrations, and partnership packages create multiple independent income streams.',
  },
  {
    n: '04',
    title: 'Radical Transparency',
    desc: 'Investors will see exactly where the project stands, how capital is deployed, and what milestone comes next. The progress tracker on this site is the public version. Investors receive detailed monthly construction reports, drone footage, quantity surveyor updates, and financial statements.',
  },
];

const STRUCTURE_ROWS = [
  { label: 'Structure',   value: 'Project Debt — no equity dilution' },
  { label: 'Term',        value: 'Fixed duration (3–5 years)' },
  { label: 'Return',      value: 'Contractually defined — see Investment Memorandum' },
  { label: 'Repayment',   value: 'Scheduled payments or maturity-based' },
  { label: 'Security',    value: 'Defined in investment documentation' },
  { label: 'Reporting',   value: 'Monthly project and financial updates' },
  { label: 'Governance',  value: 'Independent project oversight & escrow' },
];

const TIERS = [
  { name: 'Founding Investor',   min: '₦25 million',  perks: ['Priority reservation access', 'Annual complimentary stays', 'Name in the Founders\' Book', 'Private opening weekend invitation'] },
  { name: 'Principal Investor',  min: '₦50 million',  perks: ['All Founding benefits', 'Suite upgrades for life', 'Preferred event & dining reservations', 'Quarterly investor briefings'] },
  { name: 'Landmark Investor',   min: '₦100 million', perks: ['All Principal benefits', 'Named recognition within Eldorado', 'Dedicated relationship manager', 'Private investor dashboard access'] },
  { name: 'Institutional',       min: 'Negotiated',   perks: ['Bespoke terms', 'Board advisory consideration', 'Full due diligence room access', 'Direct founder engagement'] },
];

const MILESTONES_PROGRESS = [
  { label: 'Land Acquired',         done: true },
  { label: 'Architecture & Design', done: true },
  { label: 'Survey',                active: true },
  { label: 'Permitting & Approvals',active: true },
  { label: 'Fencing',               done: false },
  { label: 'Construction',          done: false },
  { label: 'Interior Fit-Out',      done: false },
  { label: 'Grand Opening',         done: false },
];

export default function Capital() {
  const submitEnquiry = useMutation(api.enquiries.submit);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    investorType: '', range: '', experience: '', message: '',
  });
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Private Capital Enquiry — ${form.range} — ${form.investorType}`,
        message: `Company: ${form.company || 'N/A'}\nInvestor type: ${form.investorType}\nIndicative range: ${form.range}\nExperience: ${form.experience}\n\n${form.message}`,
      });
      setStep('success');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0A1A2E', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/eldorado-flagship-suite.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,26,46,0.97) 0%, rgba(10,26,46,0.55) 55%, rgba(10,26,46,0.2) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(3rem,8vw,7rem) clamp(1.5rem,6vw,6rem)', maxWidth: 760 }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', marginBottom: '1.25rem' }}>
            Private Capital
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3rem,6.5vw,5.5rem)',
            fontWeight: 300, color: '#FAF8F2',
            lineHeight: 1.08, marginBottom: '1.5rem',
          }}>
            Build Something<br />That Will Outlive Us.
          </h1>
          <p style={{
            fontSize: 'clamp(1rem,1.6vw,1.15rem)', fontWeight: 300,
            color: 'rgba(250,248,242,0.65)', maxWidth: 540,
            lineHeight: 1.9, marginBottom: '2.5rem',
          }}>
            Eldorado is rising along the Lagos–Calabar Coastal Road as a new landmark of Nigerian hospitality. We are opening select opportunities for qualified private investors to participate in its development through structured project financing.
          </p>
          <a href="#memorandum" onClick={e => { e.preventDefault(); document.getElementById('memorandum')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{ display: 'inline-block' }}>
            <button className="btn-primary" style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>
              Request Investment Memorandum
            </button>
          </a>
          <p style={{ fontSize: '0.7rem', color: 'rgba(250,248,242,0.25)', marginTop: '1rem', maxWidth: 480, lineHeight: 1.7 }}>
            Investment opportunities are subject to eligibility, due diligence, definitive agreements, and applicable regulatory requirements. This page does not constitute a public offer or solicitation of securities.
          </p>
        </div>
      </section>

      {/* ── WHY ELDORADO ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '0.85rem' }}>The Opportunity</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,4.5vw,3.5rem)', fontWeight: 300, color: '#FAF8F2' }}>
              Why Eldorado
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem' }}>
            {PILLARS.map(p => (
              <div key={p.n} style={{
                padding: '2rem',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 4,
                background: 'rgba(201,168,76,0.03)',
                transition: 'border-color 0.3s, background 0.3s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.35)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.15)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.03)'; }}
              >
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem', color: 'rgba(201,168,76,0.5)', marginBottom: '0.85rem' }}>{p.n}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 400, color: '#FAF8F2', marginBottom: '0.85rem' }}>{p.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'rgba(250,248,242,0.55)', lineHeight: 1.85 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRESS ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,6rem)', borderTop: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '0.85rem' }}>Eldorado Is Already in Motion</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 300, color: '#FAF8F2', marginBottom: '2.5rem' }}>
            Investment capital is deployed against defined project milestones,<br />
            <em>not abstract promises.</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {MILESTONES_PROGRESS.map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: m.done ? 'var(--gold)' : 'done' in m && !m.done && 'active' in m && m.active ? 'transparent' : 'transparent',
                  border: m.done ? '2px solid var(--gold)' : 'active' in m && m.active ? '2px solid rgba(250,248,242,0.6)' : '2px solid rgba(250,248,242,0.2)',
                  boxShadow: m.done ? '0 0 8px rgba(201,168,76,0.5)' : 'none',
                }} />
                <span style={{
                  fontSize: '0.88rem',
                  color: m.done ? 'var(--gold)' : 'active' in m && m.active ? 'rgba(250,248,242,0.85)' : 'rgba(250,248,242,0.3)',
                  fontFamily: m.done ? "'Cormorant Garamond', serif" : 'inherit',
                  fontStyle: m.done ? 'normal' : 'normal',
                }}>
                  {m.done ? '✓ ' : 'active' in m && m.active ? '● ' : '○ '}{m.label}
                </span>
                {'active' in m && m.active && (
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(250,248,242,0.4)', background: 'rgba(250,248,242,0.07)', padding: '0.2rem 0.5rem', borderRadius: 2 }}>
                    In Progress
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTMENT STRUCTURE ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '0.85rem' }}>The Structure</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#FAF8F2', marginBottom: '1.25rem' }}>
              A Structured<br />Private Investment
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(250,248,242,0.55)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
              Eldorado is considering a limited number of private debt participation opportunities for qualified investors. Debt is clean — you lend the project a defined amount, we owe you a defined return, on a defined schedule, with defined security. You retain no equity. We retain the hotel.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'rgba(250,248,242,0.38)', lineHeight: 1.8, fontStyle: 'italic' }}>
              Full terms, interest rates, repayment schedules, and security documentation are contained in the Investment Memorandum — available upon request and NDA.
            </p>
          </div>
          <div>
            {STRUCTURE_ROWS.map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', padding: '0.85rem 0', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                <span style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(250,248,242,0.35)', flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontSize: '0.88rem', color: 'rgba(250,248,242,0.75)', textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
            <div style={{ marginTop: '1.5rem' }}>
              <a href="#memorandum" onClick={e => { e.preventDefault(); document.getElementById('memorandum')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Request Full Terms</button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── INVESTOR TIERS ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,6rem)', background: 'rgba(201,168,76,0.03)', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '0.85rem' }}>Participation Levels</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#FAF8F2', marginBottom: '0.75rem' }}>The Founders' Circle</h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(250,248,242,0.45)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
              A lender does not need ownership to feel like they were part of history.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: '1.25rem' }}>
            {TIERS.map((t, i) => (
              <div key={t.name} style={{
                padding: '2rem 1.5rem',
                border: `1px solid ${i === 2 ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.15)'}`,
                borderRadius: 4,
                background: i === 2 ? 'rgba(201,168,76,0.07)' : 'transparent',
                position: 'relative',
              }}>
                {i === 2 && (
                  <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: '#0A1A2E', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.2rem 0.75rem', borderRadius: '0 0 3px 3px', whiteSpace: 'nowrap' }}>
                    Most Impactful
                  </div>
                )}
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', marginBottom: '0.5rem' }}>{t.name}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'var(--gold)', fontWeight: 300, marginBottom: '1.25rem' }}>{t.min}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {t.perks.map(p => (
                    <li key={p} style={{ fontSize: '0.82rem', color: 'rgba(250,248,242,0.55)', marginBottom: '0.5rem', paddingLeft: '1rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--gold)', fontSize: '0.6rem' }}>✦</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem', padding: '1.5rem', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 4, maxWidth: 600, margin: '2.5rem auto 0' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.15rem', color: 'rgba(250,248,242,0.5)', lineHeight: 1.75 }}>
              "Imagine the hotel lobby having a leather-bound book — <em>The Founders' Book: Those who believed before the doors opened.</em>"
            </p>
          </div>
        </div>
      </section>

      {/* ── ENQUIRY FORM ── */}
      <section id="memorandum" style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '0.85rem' }}>Next Step</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#FAF8F2', marginBottom: '0.85rem' }}>
              Request the Investment Memorandum
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.45)', lineHeight: 1.85 }}>
              Complete this form to begin the conversation. After review: NDA → Investment Memorandum → Due Diligence → Investor Call → Definitive Agreement → Funding.
            </p>
          </div>

          {step === 'success' ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 4 }}>
              <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>✦</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, color: '#FAF8F2', marginBottom: '0.75rem' }}>Enquiry Received</h3>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.5)', lineHeight: 1.8 }}>
                The Eldorado team will review your enquiry and be in contact within 48 hours. We look forward to the conversation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Full Name *</label>
                  <input className="form-input" required style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: '#FAF8F2' }}
                    placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Email Address *</label>
                  <input className="form-input" type="email" required style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: '#FAF8F2' }}
                    placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Phone / WhatsApp *</label>
                  <input className="form-input" required style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: '#FAF8F2' }}
                    placeholder="+234 xxx xxxx xxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Company / Organisation</label>
                  <input className="form-input" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: '#FAF8F2' }}
                    placeholder="Optional" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Investor Type *</label>
                  <select required className="form-input" style={{ background: '#0A1A2E', borderColor: 'rgba(201,168,76,0.2)', color: form.investorType ? '#FAF8F2' : 'rgba(250,248,242,0.35)' }}
                    value={form.investorType} onChange={e => setForm({ ...form, investorType: e.target.value })}>
                    <option value="">Select</option>
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Family Office">Family Office</option>
                    <option value="Institutional">Institutional</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Indicative Range *</label>
                  <select required className="form-input" style={{ background: '#0A1A2E', borderColor: 'rgba(201,168,76,0.2)', color: form.range ? '#FAF8F2' : 'rgba(250,248,242,0.35)' }}
                    value={form.range} onChange={e => setForm({ ...form, range: e.target.value })}>
                    <option value="">Select</option>
                    <option value="₦25M–₦49M">₦25M – ₦49M (Founding)</option>
                    <option value="₦50M–₦99M">₦50M – ₦99M (Principal)</option>
                    <option value="₦100M+">₦100M+ (Landmark)</option>
                    <option value="Institutional">Institutional / Negotiated</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Investment Experience</label>
                <input className="form-input" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: '#FAF8F2' }}
                  placeholder="Brief summary of prior investment activity (optional)" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
              </div>
              <div>
                <label className="form-label" style={{ color: 'rgba(250,248,242,0.45)' }}>Message</label>
                <textarea className="form-input" rows={4} style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: '#FAF8F2', resize: 'vertical' }}
                  placeholder="Any questions or additional context for the Eldorado team" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}
                style={{ justifyContent: 'center', fontSize: '0.72rem', letterSpacing: '0.18em', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Submitting…' : 'Request Investment Memorandum'}
              </button>
              <p style={{ fontSize: '0.7rem', color: 'rgba(250,248,242,0.2)', textAlign: 'center', lineHeight: 1.7 }}>
                This enquiry is confidential. Submission does not constitute a binding commitment or public offer. Investment opportunities are subject to eligibility, due diligence, and applicable Nigerian regulatory requirements.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
