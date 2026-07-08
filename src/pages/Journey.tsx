interface Milestone {
  num: string;
  title: string;
  status: 'complete' | 'active' | 'upcoming';
  statusLabel: string;
  desc: string;
  journal?: string;
}

const MILESTONES: Milestone[] = [
  // ── COMPLETE ──────────────────────────────────────────────
  {
    num: '01',
    title: 'Land Acquired',
    status: 'complete',
    statusLabel: 'Complete',
    desc: 'The home of Eldorado has been secured in Akwa Ibom State. The vision now has a place to stand.',
    journal: 'A defining moment. The land that will carry this legacy is ours.',
  },
  {
    num: '02',
    title: 'Architecture & Design',
    status: 'complete',
    statusLabel: 'Complete',
    desc: 'The architecture, guest experience, interiors and all signature spaces — The Grand Ballroom, The Still Room, Ekom Iban Pavilion and the Flagship Suite — are fully designed.',
    journal: 'Every room, every corridor, every view has been considered. The vision is drawn.',
  },
  // ── IN PROGRESS ───────────────────────────────────────────
  {
    num: '03',
    title: 'Survey',
    status: 'active',
    statusLabel: 'In Progress',
    desc: 'Boundary surveys underway. The physical limits of the estate are being precisely established, measured and documented.',
  },
  {
    num: '04',
    title: 'Permitting & Approvals',
    status: 'active',
    statusLabel: 'In Progress',
    desc: 'Development permits, engineering sign-offs and all required regulatory approvals are being processed with the Akwa Ibom State authorities.',
  },
  // ── UPCOMING ──────────────────────────────────────────────
  {
    num: '05',
    title: 'Fencing',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    desc: 'The estate perimeter is secured. Fencing marks the first physical presence of Eldorado on the land — the boundary of what will be built.',
  },
  {
    num: '06',
    title: 'Property Registration',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    desc: 'Formal title documentation and official registration of the property, completing the legal foundation of the Eldorado estate.',
  },
  {
    num: '07',
    title: 'Site Preparation',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    desc: 'Clearing, grading, temporary site infrastructure and full construction mobilization. The land is prepared to receive the building.',
  },
  {
    num: '08',
    title: 'Construction Begins',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    desc: 'The first physical phase of Eldorado rises from the ground. Foundation, superstructure, and the first floors of the six-storey tower.',
  },
  {
    num: '09',
    title: 'Structure Complete',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    desc: 'Main buildings, roofing and core infrastructure completed. The silhouette of Eldorado stands on the Lagos-Calabar coastal road.',
  },
  {
    num: '10',
    title: 'Interior Fit-Out',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    desc: 'Ninety rooms and suites, The Still Room spa, Gaffer\'s Club cinema, The Grand Ballroom, fine dining restaurants and all public spaces come to life.',
  },
  {
    num: '11',
    title: 'Landscaping & Outdoor Experience',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    desc: 'Tropical gardens, arrival roads, resort lighting, the ceremonial entrance and the full outdoor resort grounds — the setting that frames Eldorado.',
  },
  {
    num: '12',
    title: 'Team Recruitment & Training',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    desc: 'The people who will define the Eldorado experience are carefully selected and trained to the standard this hotel demands. Every role, every touchpoint.',
  },
  {
    num: '13',
    title: 'Soft Opening',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    desc: 'A private opening period for testing, refinement and invited guests. The hotel breathes for the first time before the world is welcomed in.',
  },
  {
    num: '14',
    title: 'Grand Opening',
    status: 'upcoming',
    statusLabel: 'Coming Soon',
    desc: 'Eldorado opens its doors. A new standard of hospitality arrives on the Lagos-Calabar coastal road.',
  },
];

const PROGRESS = 25;
const PROGRESS_SUMMARY = 'Land acquired. Architecture complete. Survey and permitting underway.';

const STATUS_COLORS: Record<string, { dot: string; badge: string; label: string }> = {
  complete: { dot: '#C9A84C', badge: 'rgba(201,168,76,0.12)', label: '#C9A84C' },
  active:   { dot: '#FAF8F2', badge: 'rgba(250,248,242,0.1)',  label: '#FAF8F2' },
  upcoming: { dot: 'rgba(250,248,242,0.2)', badge: 'transparent', label: 'rgba(250,248,242,0.35)' },
};

export default function Journey() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        padding: 'clamp(6rem,12vw,10rem) clamp(1.5rem,5vw,5rem) clamp(3rem,6vw,5rem)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
      }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{
            fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.7)', marginBottom: '1.25rem',
          }}>
            The Road to Eldorado
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
            fontWeight: 300, color: 'var(--ivory)', lineHeight: 1.1,
            marginBottom: '1.25rem',
          }}>
            From Vision<br />to Destination
          </h1>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '1rem', fontWeight: 300,
            color: 'rgba(250,248,242,0.6)', maxWidth: 480,
            lineHeight: 1.85, marginBottom: '2.5rem',
          }}>
            Follow the journey as Eldorado comes to life — from the first piece of land to the grand opening. Every milestone, every decision, every step toward something extraordinary.
          </p>

          {/* Progress bar */}
          <div style={{ maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)' }}>Overall Progress</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'var(--gold)', fontWeight: 300 }}>{PROGRESS}%</span>
            </div>
            <div style={{ height: 2, background: 'rgba(201,168,76,0.15)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${PROGRESS}%`, background: 'var(--gold)', borderRadius: 2, transition: 'width 1s ease' }} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(250,248,242,0.45)', marginTop: '0.75rem', lineHeight: 1.7, fontStyle: 'italic' }}>
              {PROGRESS_SUMMARY}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,5rem)', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 'clamp(28px,3vw,36px)',
            top: 8,
            bottom: 8,
            width: 1,
            background: 'linear-gradient(to bottom, var(--gold) 0%, rgba(201,168,76,0.25) 40%, rgba(250,248,242,0.08) 100%)',
          }} />

          {MILESTONES.map((m, i) => {
            const colors = STATUS_COLORS[m.status];
            const isLast = i === MILESTONES.length - 1;
            return (
              <div key={m.num} style={{
                display: 'flex',
                gap: 'clamp(1.5rem,3vw,2.5rem)',
                alignItems: 'flex-start',
                marginBottom: isLast ? 0 : 'clamp(2.5rem,5vw,3.5rem)',
                position: 'relative',
              }}>
                {/* Dot */}
                <div style={{
                  flexShrink: 0,
                  width: 'clamp(56px,6vw,72px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: 4,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <div style={{
                    width: 14, height: 14,
                    borderRadius: '50%',
                    background: m.status === 'complete' ? 'var(--gold)' : 'transparent',
                    border: `2px solid ${colors.dot}`,
                    boxShadow: m.status === 'complete' ? '0 0 12px rgba(201,168,76,0.4)' : 'none',
                    marginBottom: '0.5rem',
                  }} />
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.9rem',
                    color: m.status === 'complete' ? 'var(--gold)' : 'rgba(250,248,242,0.2)',
                    fontWeight: 500,
                  }}>{m.num}</span>
                </div>

                {/* Content */}
                <div style={{
                  flex: 1,
                  padding: '1.25rem 1.5rem',
                  background: m.status === 'upcoming' ? 'rgba(250,248,242,0.02)' : 'rgba(201,168,76,0.04)',
                  border: `1px solid ${m.status === 'upcoming' ? 'rgba(250,248,242,0.06)' : 'rgba(201,168,76,0.15)'}`,
                  borderRadius: 4,
                  opacity: m.status === 'upcoming' ? 0.65 : 1,
                }}>
                  {/* Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <span style={{
                      fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                      padding: '0.25rem 0.65rem',
                      background: colors.badge,
                      border: `1px solid ${colors.dot}`,
                      borderRadius: 2,
                      color: colors.label,
                    }}>{m.statusLabel}</span>
                  </div>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.3rem,2.5vw,1.7rem)',
                    fontWeight: 400,
                    color: m.status === 'complete' ? 'var(--ivory)' : m.status === 'active' ? 'var(--ivory)' : 'rgba(250,248,242,0.55)',
                    marginBottom: '0.6rem',
                    lineHeight: 1.2,
                  }}>{m.title}</h3>

                  <p style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.85,
                    color: m.status === 'upcoming' ? 'rgba(250,248,242,0.35)' : 'rgba(250,248,242,0.65)',
                    marginBottom: m.journal ? '1rem' : 0,
                  }}>{m.desc}</p>

                  {/* Journal entry — shown for completed milestones */}
                  {m.journal && (
                    <div style={{
                      borderTop: '1px solid rgba(201,168,76,0.15)',
                      paddingTop: '0.85rem',
                      marginTop: '0.25rem',
                    }}>
                      <span style={{
                        fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                        color: 'rgba(201,168,76,0.5)', display: 'block', marginBottom: '0.4rem',
                      }}>Field Note</span>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontStyle: 'italic',
                        fontSize: '1rem',
                        color: 'rgba(201,168,76,0.75)',
                        lineHeight: 1.75,
                      }}>"{m.journal}"</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: 'rgba(250,248,242,0.35)',
            lineHeight: 1.8,
            maxWidth: 500,
            margin: '0 auto',
          }}>
            This page is updated as each milestone is reached.<br />Photography, dates and field notes will be added as Eldorado rises.
          </p>
        </div>
      </div>
    </div>
  );
}
