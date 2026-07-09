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
        type: 'investment',
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

      {/* ── OUR INTENTION ── */}
      <section style={{ borderTop: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>

        {/* Opening statement */}
        <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)', maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', marginBottom: '1.5rem' }}>Our Intention</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', fontWeight: 300, color: '#FAF8F2', lineHeight: 1.15, marginBottom: '2.5rem' }}>
            Built to leave more behind<br />than a building.
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem,1.4vw,1.1rem)', color: 'rgba(250,248,242,0.55)', lineHeight: 2, maxWidth: 680, margin: '0 auto' }}>
            Eldorado is not being conceived as another hotel placed upon the land. It is being imagined as something grown from it — from the sun above Akwa Ibom, the hands of its craftsmen, the imagination of Nigerian talent at home and abroad, and the belief that hospitality can be beautiful, ambitious, and responsible at once.
          </p>
          <p style={{ fontSize: 'clamp(0.88rem,1.2vw,1rem)', color: 'rgba(250,248,242,0.35)', lineHeight: 1.9, maxWidth: 580, margin: '1.5rem auto 0', fontStyle: 'italic' }}>
            We are still at the beginning. This is not yet the story of what we have done. It is the promise of how we intend to build.
          </p>
        </div>

        {/* ───── Chapter 1: The Sun ───── */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(4rem,7vw,6rem) clamp(1.5rem,6vw,6rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(3rem,6vw,5rem)', alignItems: 'start' }}>

            {/* Text column */}
            <div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '1rem' }}>The Sun</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 300, color: '#FAF8F2', marginBottom: '1.75rem', lineHeight: 1.2 }}>
                Every morning, the sun rises over Akwa Ibom with enough power to begin again.
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.25rem' }}>
                Eldorado is being designed to operate at near 100% clean energy, using a carefully engineered combination of solar power and battery storage. By day, the property draws energy from the sun. The real story begins when the sun disappears: energy gathered during daylight will be stored and released after dark, powering the halls, the guest rooms, the kitchen, the music — the quiet machinery of hospitality, run as far as possible on sunlight captured hours before.
              </p>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.25rem' }}>
                We do not want sustainability to mean asking guests to sacrifice comfort — we want to prove the opposite. Environmental responsibility should be almost invisible: the guest feels the cool room, sees the warm light, sleeps deeply, and never has to think about the engineering beneath it. Not less luxury. More intelligence.
              </p>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.25rem' }}>
                Nigeria knows the sound of generators — the interruption, the smoke, the dependence, the expectation that reliable power must come with noise. We want Eldorado to tell a quieter story: the sun works by day, the batteries stand watch through the night, and the property moves with a calm confidence of its own.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'rgba(250,248,242,0.38)', lineHeight: 1.9, fontStyle: 'italic' }}>
                This ambition demands serious engineering. So we will not make careless promises. We will measure, engineer, and improve. Our destination is clear — to build one of Nigeria&apos;s most energy-conscious hospitality properties. And when this page changes from what we intend to what we built, we want to show the numbers: how much sunlight captured, how much energy stored, how many hours run on clean power. Not slogans. Proof.
              </p>
            </div>

            {/* Pull quote + image slot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Pull quote */}
              <div style={{
                borderLeft: '3px solid rgba(201,168,76,0.5)',
                paddingLeft: '2rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.5rem,2.5vw,2.2rem)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: '#C9A84C',
                  lineHeight: 1.35,
                  margin: 0,
                }}>
                  We intend to store the Akwa Ibom sun and keep the hotel glowing long after sunset.
                </p>
              </div>
              {/* Image slot */}
              <div style={{ aspectRatio: '4/3', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)' }}>Image Slot</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(250,248,242,0.2)', textAlign: 'center', padding: '0 1.5rem' }}>Sunrise · Solar array · Battery infrastructure</div>
              </div>
            </div>
          </div>
        </div>

        {/* ───── Chapter 2: The Hands ───── */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)', background: 'rgba(255,255,255,0.015)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(4rem,7vw,6rem) clamp(1.5rem,6vw,6rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(3rem,6vw,5rem)', alignItems: 'start' }}>

            {/* Image slot — left on this chapter */}
            <div style={{ aspectRatio: '3/4', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)' }}>Image Slot</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(250,248,242,0.2)', textAlign: 'center', padding: '0 1.5rem' }}>Craftsmen · Artisans · Diaspora professionals · Kitchen</div>
            </div>

            {/* Text column */}
            <div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '1rem' }}>The Hands</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 300, color: '#FAF8F2', marginBottom: '1.75rem', lineHeight: 1.2 }}>
                Eldorado will be built in Akwa Ibom, but the knowledge behind it has no borders.
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.25rem' }}>
                We are bringing together Nigerian professionals from across the country, members of the diaspora, international specialists, and local experts who understand the land, the climate, and the realities of building here — architects, engineers, hospitality professionals, designers, chefs, artisans, technologists, builders.
              </p>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.25rem' }}>
                The goal is not to import excellence and leave. It is to bring expertise together, transfer knowledge, and build capability that remains long after construction ends. A young technician should leave more skilled than when they arrived. A local supplier should leave more capable of serving future clients. A craftsman should be able to point to the work and say: <em style={{ color: 'rgba(250,248,242,0.75)' }}>I built that.</em> The true value of a project is not only what stands when the scaffolding comes down. It is what the people who built it become.
              </p>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.25rem' }}>
                There are things a factory can produce perfectly, and things that should still carry the evidence of a human hand. Eldorado makes room for both: local carpenters shaping pieces that belong to this place, muralists turning walls into stories, Nigerian and international artists contributing work that makes guests stop and look again, chefs interpreting Akwa Ibom and Nigeria with confidence.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'rgba(250,248,242,0.38)', lineHeight: 1.9, fontStyle: 'italic' }}>
                We do not want Eldorado filled with objects that could sit in any hotel, anywhere. We want guests to encounter things they could only find here — some grand, some subtle, some imperfect in the most beautiful way — made by hands whose names may never appear on the building, but who will live inside it.
              </p>
            </div>
          </div>
        </div>

        {/* ───── Chapter 3: The Table ───── */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(4rem,7vw,6rem) clamp(1.5rem,6vw,6rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(3rem,6vw,5rem)', alignItems: 'start' }}>

            {/* Text column */}
            <div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '1rem' }}>The Table</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 300, color: '#FAF8F2', marginBottom: '1.75rem', lineHeight: 1.2 }}>
                A hotel cannot call itself sustainable because it has solar panels.
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.25rem' }}>
                Sustainability is also economic: who gets hired, trained, commissioned, given the contract, given the opportunity. Eldorado intends to spend locally wherever quality, capacity, and practicality allow. That does not mean choosing local for its own sake — excellence remains the standard. It means asking a better question before looking elsewhere: can this be made here, by a local carpenter, a Nigerian company, a Nigerian designer?
              </p>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.25rem' }}>
                Sometimes the answer will be no — for a project this ambitious, some expertise and materials will come from outside Nigeria, and we will not pretend otherwise. But every time the answer can honestly be yes, we want Eldorado to be part of that local economic story. A hotel should not simply occupy a community. It should participate in one.
              </p>
              <p style={{ fontSize: '0.92rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.25rem' }}>
                Through Eldorado Cares, we intend to support boys&apos; and girls&apos; programmes that give young people access to opportunity, mentorship, skills, creativity, sport, and a wider view of what their lives can become. We are not interested in performative generosity — impact matters more than photographs.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'rgba(250,248,242,0.38)', lineHeight: 1.9, fontStyle: 'italic' }}>
                Sometimes the first thing a young person needs is not charity. It is evidence that something extraordinary can be built here.
              </p>
            </div>

            {/* Image slot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ aspectRatio: '4/3', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)' }}>Image Slot</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(250,248,242,0.2)', textAlign: 'center', padding: '0 1.5rem' }}>Local suppliers · Community · Eldorado Cares</div>
              </div>
            </div>
          </div>
        </div>

        {/* ───── Chapter 4: The Future ───── */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)', background: 'rgba(201,168,76,0.02)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.65)', marginBottom: '1rem' }}>The Future</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 300, color: '#FAF8F2', marginBottom: '2rem', lineHeight: 1.2 }}>
              Today, these are intentions.<br /><em style={{ color: 'rgba(250,248,242,0.65)' }}>Over time, this page will change.</em>
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '1.5rem', maxWidth: 680, margin: '0 auto 1.5rem' }}>
              We intend to will become <em>we did.</em> Plans will become photographs. Renderings will become rooms. Craftsmen will leave their marks, artists will finish their walls, chefs will serve their first plates. Solar panels will face the Akwa Ibom sky, and batteries will quietly hold the sun after dark.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(250,248,242,0.55)', lineHeight: 2, marginBottom: '2.5rem', maxWidth: 680, margin: '0 auto 2.5rem' }}>
              Guests will arrive. Young people will be given opportunities. And a building will begin to become something more than a building.
            </p>

            {/* Image slot — renderings to real photos */}
            <div style={{ maxWidth: 680, margin: '0 auto 2.5rem', aspectRatio: '16/7', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)' }}>Image Slot — Updates Over Time</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(250,248,242,0.2)', textAlign: 'center', padding: '0 2rem' }}>Renderings transitioning to real construction photos as the project progresses</div>
            </div>

            <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '2.5rem' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,1.8vw,1.4rem)', color: 'rgba(250,248,242,0.45)', lineHeight: 1.75, maxWidth: 640, margin: '0 auto' }}>
                This is the journey of Eldorado.<br />
                Built in Akwa Ibom. Informed by the world. Powered by possibility.
              </p>
            </div>
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
