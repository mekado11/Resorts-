import { useEffect, useRef, useState } from 'react';

// ── Milestone data ─────────────────────────────────────────────────────────────
interface Milestone {
  num: string;
  title: string;
  status: 'complete' | 'active' | 'upcoming';
  statusLabel: string;
  desc: string;
  icon: string;
  journal?: string;
}

const MILESTONES: Milestone[] = [
  {
    num: '01', title: 'Land Acquired', status: 'complete', statusLabel: 'Complete',
    icon: '◈',
    desc: 'The home of Eldorado has been secured in Akwa Ibom State. The vision now has a place to stand.',
    journal: 'A defining moment. The land that will carry this legacy is ours.',
  },
  {
    num: '02', title: 'Architecture & Design', status: 'complete', statusLabel: 'Complete',
    icon: '⬡',
    desc: 'The architecture, guest experience, interiors and all signature spaces — The Grand Ballroom, The Still Room, Ekom Iban Pavilion and the Flagship Suite — are fully designed.',
    journal: 'Every room, every corridor, every view has been considered. The vision is drawn.',
  },
  {
    num: '03', title: 'Survey & Site Definition', status: 'active', statusLabel: 'In Progress',
    icon: '◎',
    desc: 'Boundary surveys underway. The physical limits of the estate are being precisely established, measured and documented.',
  },
  {
    num: '04', title: 'Permitting & Approvals', status: 'active', statusLabel: 'In Progress',
    icon: '◉',
    desc: 'Development permits, engineering sign-offs and all required regulatory approvals are being processed with the Akwa Ibom State authorities.',
  },
  {
    num: '05', title: 'Borehole & Water Infrastructure', status: 'active', statusLabel: 'In Progress',
    icon: '◌',
    desc: 'A dedicated borehole is being drilled and water storage infrastructure installed on site. Reliable, independent water supply is foundational to the operation of a world-class hotel.',
    journal: 'No hotel of this calibre can depend on inconsistent supply. This infrastructure is being built to last.',
  },
  {
    num: '06', title: 'Fencing & Site Security', status: 'upcoming', statusLabel: 'Upcoming',
    icon: '▣',
    desc: 'The estate perimeter is secured. Fencing marks the first visible presence of Eldorado on the land — the boundary of what will be built.',
  },
  {
    num: '07', title: 'Property Registration', status: 'upcoming', statusLabel: 'Upcoming',
    icon: '▤',
    desc: 'Formal title documentation and official registration of the property, completing the legal foundation of the Eldorado estate.',
  },
  {
    num: '08', title: 'Site Preparation', status: 'upcoming', statusLabel: 'Upcoming',
    icon: '▦',
    desc: 'Clearing, grading, temporary site infrastructure and full construction mobilization. The land is prepared to receive the building.',
  },
  {
    num: '09', title: 'Construction Begins', status: 'upcoming', statusLabel: 'Upcoming',
    icon: '▧',
    desc: 'The first physical phase of Eldorado rises from the ground. Foundation, superstructure, and the first floors of the six-storey tower.',
  },
  {
    num: '10', title: 'Structure Complete', status: 'upcoming', statusLabel: 'Upcoming',
    icon: '▨',
    desc: 'Main buildings, roofing and core infrastructure completed. The silhouette of Eldorado stands on the Lagos-Calabar coastal road.',
  },
  {
    num: '11', title: 'Interior Fit-Out', status: 'upcoming', statusLabel: 'Upcoming',
    icon: '▩',
    desc: 'Ninety rooms and suites, The Still Room spa, Gaffer\'s Club cinema, The Grand Ballroom, fine dining restaurants and all public spaces come to life.',
  },
  {
    num: '12', title: 'Landscaping & Grounds', status: 'upcoming', statusLabel: 'Upcoming',
    icon: '◇',
    desc: 'Tropical gardens, arrival roads, resort lighting, the ceremonial entrance and the full outdoor resort grounds — the setting that frames Eldorado.',
  },
  {
    num: '13', title: 'Team Recruitment', status: 'upcoming', statusLabel: 'Upcoming',
    icon: '◆',
    desc: 'The people who will define the Eldorado experience are carefully selected and trained to the standard this hotel demands.',
  },
  {
    num: '14', title: 'Soft Opening', status: 'upcoming', statusLabel: 'Upcoming',
    icon: '○',
    desc: 'A private opening period for testing, refinement and invited guests. The hotel breathes for the first time before the world is welcomed in.',
  },
  {
    num: '15', title: 'Grand Opening', status: 'upcoming', statusLabel: 'Coming Soon',
    icon: '★',
    desc: 'Eldorado opens its doors. A new standard of hospitality arrives on the Lagos-Calabar coastal road.',
  },
];

const TOTAL = MILESTONES.length;
const COMPLETE_COUNT = MILESTONES.filter(m => m.status === 'complete').length;
const ACTIVE_COUNT   = MILESTONES.filter(m => m.status === 'active').length;
const PROGRESS = Math.round((COMPLETE_COUNT / TOTAL) * 100);

// ── Colour helpers ─────────────────────────────────────────────────────────────
const NODE_STYLE = {
  complete: {
    fill: '#C9A84C',
    stroke: '#C9A84C',
    glow: 'drop-shadow(0 0 10px rgba(201,168,76,0.9))',
    textColor: '#0D1B2A',
    badge: 'rgba(201,168,76,0.15)',
    badgeBorder: 'rgba(201,168,76,0.5)',
    badgeText: '#C9A84C',
  },
  active: {
    fill: 'rgba(250,248,242,0.12)',
    stroke: '#FAF8F2',
    glow: 'drop-shadow(0 0 12px rgba(250,248,242,0.55))',
    textColor: '#FAF8F2',
    badge: 'rgba(250,248,242,0.08)',
    badgeBorder: 'rgba(250,248,242,0.4)',
    badgeText: '#FAF8F2',
  },
  upcoming: {
    fill: 'rgba(250,248,242,0.04)',
    stroke: 'rgba(250,248,242,0.2)',
    glow: 'none',
    textColor: 'rgba(250,248,242,0.35)',
    badge: 'transparent',
    badgeBorder: 'rgba(250,248,242,0.15)',
    badgeText: 'rgba(250,248,242,0.35)',
  },
};

// ── Animated arc progress ──────────────────────────────────────────────────────
function AnimatedArc({ pct, r, cx, cy }: { pct: number; r: number; cx: number; cy: number }) {
  const [drawn, setDrawn] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  const circumference = 2 * Math.PI * r;
  const dashoffset = circumference * (1 - drawn / 100);
  // Start at top (−90°) going clockwise
  const startAngle = -90;
  const rad = (startAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad);
  const y1 = cy + r * Math.sin(rad);

  return (
    <circle
      cx={cx} cy={cy} r={r}
      fill="none"
      stroke="url(#goldGrad)"
      strokeWidth={3}
      strokeDasharray={circumference}
      strokeDashoffset={dashoffset}
      strokeLinecap="round"
      transform={`rotate(-90 ${cx} ${cy})`}
      style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)' }}
    />
  );
}

// ── Pulse ring for active nodes ────────────────────────────────────────────────
function PulseRing({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <circle cx={cx} cy={cy} r={r + 6} fill="none"
      stroke="rgba(250,248,242,0.18)" strokeWidth={1.5}
      style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
  );
}

// ── Detail card (shown below circle when node selected) ────────────────────────
function DetailCard({ m, onClose }: { m: Milestone; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const style = NODE_STYLE[m.status];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVis(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      background: 'rgba(250,248,242,0.03)',
      border: `1px solid ${m.status === 'complete' ? 'rgba(201,168,76,0.3)' : m.status === 'active' ? 'rgba(250,248,242,0.15)' : 'rgba(250,248,242,0.07)'}`,
      borderRadius: 6,
      padding: 'clamp(1.5rem,4vw,2.5rem)',
      maxWidth: 680,
      margin: '0 auto',
      position: 'relative',
      boxShadow: m.status === 'complete' ? '0 8px 48px rgba(201,168,76,0.08)' : 'none',
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position: 'absolute', top: '1rem', right: '1rem',
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'rgba(250,248,242,0.3)', fontSize: '1.1rem', lineHeight: 1,
        padding: '0.25rem 0.5rem',
        transition: 'color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,248,242,0.3)')}>
        ✕
      </button>

      {/* Number + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: style.fill,
          border: `2px solid ${style.stroke}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: m.status !== 'upcoming' ? `0 0 20px ${m.status === 'complete' ? 'rgba(201,168,76,0.4)' : 'rgba(250,248,242,0.2)'}` : 'none',
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.9rem', fontWeight: 600,
            color: m.status === 'complete' ? '#0D1B2A' : style.textColor,
          }}>{m.num}</span>
        </div>

        <div>
          <span style={{
            display: 'inline-block',
            fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            padding: '0.2rem 0.6rem',
            background: style.badge,
            border: `1px solid ${style.badgeBorder}`,
            borderRadius: 2,
            color: style.badgeText,
            marginBottom: '0.35rem',
          }}>{m.statusLabel}</span>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 300, color: 'var(--ivory)',
            lineHeight: 1.15,
          }}>{m.title}</h3>
        </div>
      </div>

      {/* Gold rule */}
      <div style={{ height: 1, background: 'rgba(201,168,76,0.12)', marginBottom: '1.25rem' }} />

      <p style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '0.92rem', lineHeight: 1.95,
        color: m.status === 'upcoming' ? 'rgba(250,248,242,0.4)' : 'rgba(250,248,242,0.68)',
      }}>{m.desc}</p>

      {m.journal && (
        <div style={{
          marginTop: '1.25rem',
          padding: '1rem 1.25rem',
          background: 'rgba(201,168,76,0.05)',
          borderLeft: '2px solid rgba(201,168,76,0.35)',
          borderRadius: '0 4px 4px 0',
        }}>
          <span style={{
            fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.55)', display: 'block', marginBottom: '0.4rem',
          }}>Field Note</span>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic', fontSize: '1.05rem',
            color: 'rgba(201,168,76,0.85)', lineHeight: 1.75,
          }}>"{m.journal}"</p>
        </div>
      )}
    </div>
  );
}

// ── Mobile vertical list ───────────────────────────────────────────────────────
function MobileTimeline({ selected, onSelect }: {
  selected: number | null;
  onSelect: (i: number | null) => void;
}) {
  return (
    <div style={{ padding: '2rem 1.25rem', maxWidth: 560, margin: '0 auto' }}>
      <div style={{ position: 'relative' }}>
        {/* Vertical rail */}
        <div style={{
          position: 'absolute', left: 19, top: 4, bottom: 4, width: 1,
          background: 'linear-gradient(to bottom, #C9A84C 15%, rgba(201,168,76,0.15) 60%, transparent)',
        }} />

        {MILESTONES.map((m, i) => {
          const style = NODE_STYLE[m.status];
          const isSelected = selected === i;
          return (
            <div key={m.num}>
              <div
                onClick={() => onSelect(isSelected ? null : i)}
                style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  marginBottom: '0.35rem', cursor: 'pointer',
                  opacity: m.status === 'upcoming' ? 0.55 : 1,
                  padding: '0.4rem 0',
                }}
              >
                {/* Node dot */}
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: style.fill,
                  border: `2px solid ${style.stroke}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: m.status !== 'upcoming' ? `0 0 14px ${m.status === 'complete' ? 'rgba(201,168,76,0.5)' : 'rgba(250,248,242,0.25)'}` : 'none',
                  transition: 'transform 0.2s ease',
                  transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.75rem', fontWeight: 600,
                    color: m.status === 'complete' ? '#0D1B2A' : style.textColor,
                  }}>{m.num}</span>
                </div>

                <div style={{ paddingTop: '0.5rem', flex: 1 }}>
                  <div style={{
                    fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: style.badgeText, marginBottom: '0.2rem',
                  }}>{m.statusLabel}</div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
                    fontWeight: 400, color: isSelected ? 'var(--gold)' : style.textColor,
                    lineHeight: 1.2, transition: 'color 0.2s',
                  }}>{m.title}</div>
                </div>

                <div style={{
                  paddingTop: '0.6rem', flexShrink: 0,
                  color: 'rgba(201,168,76,0.5)', fontSize: '0.75rem',
                  transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}>▾</div>
              </div>

              {/* Expanded detail */}
              {isSelected && (
                <div style={{ marginLeft: 50, marginBottom: '1rem', marginTop: '0.25rem' }}>
                  <DetailCard m={m} onClose={() => onSelect(null)} />
                </div>
              )}

              {i < MILESTONES.length - 1 && (
                <div style={{ height: '0.6rem' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Journey page ──────────────────────────────────────────────────────────
export default function Journey() {
  const [selected, setSelected] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [svgSize, setSvgSize] = useState(580);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && containerRef.current) {
        const w = containerRef.current.clientWidth;
        setSvgSize(Math.min(Math.max(w * 0.88, 420), 640));
      }
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // Circle geometry
  const CX = svgSize / 2;
  const CY = svgSize / 2;
  const TRACK_R   = svgSize * 0.40;  // outer track
  const LABEL_R   = svgSize * 0.485; // label ring
  const CENTER_R  = svgSize * 0.155; // center emblem
  const NODE_R    = svgSize * 0.032; // node circle radius

  // Position each milestone around the clock (start at top, clockwise)
  const nodePositions = MILESTONES.map((_, i) => {
    const angle = (360 / TOTAL) * i - 90; // start at 12 o'clock
    const rad = (angle * Math.PI) / 180;
    return {
      x: CX + TRACK_R * Math.cos(rad),
      y: CY + TRACK_R * Math.sin(rad),
      lx: CX + LABEL_R * Math.cos(rad),
      ly: CY + LABEL_R * Math.sin(rad),
      angle,
    };
  });

  // How much of the arc to fill (complete + active partial)
  const arcPct = Math.round(((COMPLETE_COUNT + ACTIVE_COUNT * 0.5) / TOTAL) * 100);

  const handleSelect = (i: number) => {
    setSelected(prev => prev === i ? null : i);
  };

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse-ring {
          0%   { r: 14px; opacity: 0.55; }
          70%  { r: 22px; opacity: 0; }
          100% { r: 22px; opacity: 0; }
        }
        @keyframes node-glow {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        .journey-node { cursor: pointer; transition: filter 0.25s ease; }
        .journey-node:hover { filter: brightness(1.25); }
      `}</style>

      {/* ── Hero header ── */}
      <div style={{
        padding: 'clamp(4rem,10vw,9rem) clamp(1.25rem,5vw,5rem) clamp(1.5rem,4vw,3rem)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <div style={{ maxWidth: 820, margin: isMobile ? '0 auto' : 0 }}>
          <div style={{
            fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.65)', marginBottom: '1rem',
          }}>The Road to Eldorado</div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
            fontWeight: 300, color: 'var(--ivory)',
            lineHeight: 1.1, marginBottom: '1rem',
          }}>From Vision<br />to Destination</h1>

          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
            fontWeight: 300, color: 'rgba(250,248,242,0.55)',
            maxWidth: 500, lineHeight: 1.85, marginBottom: '2rem',
          }}>
            Follow the journey as Eldorado comes to life — from the first piece of land to the grand opening. Every milestone, every decision, every step toward something extraordinary.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 'clamp(1.5rem,4vw,3rem)',
            flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start',
          }}>
            {[
              { value: `${COMPLETE_COUNT}`, label: 'Milestones Complete' },
              { value: `${ACTIVE_COUNT}`, label: 'In Progress' },
              { value: `${TOTAL - COMPLETE_COUNT - ACTIVE_COUNT}`, label: 'Upcoming' },
              { value: `${PROGRESS}%`, label: 'Overall Progress' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: isMobile ? 'center' : 'left' }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                  fontWeight: 300, color: 'var(--gold)', lineHeight: 1,
                }}>{s.value}</div>
                <div style={{
                  fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(250,248,242,0.35)', marginTop: '0.3rem',
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Circular diagram (desktop) / Mobile list ── */}
      {!isMobile ? (
        <div ref={containerRef} style={{
          padding: 'clamp(2rem,4vw,4rem) clamp(1rem,3vw,3rem)',
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(2rem,4vw,4rem)',
          alignItems: 'start',
        }}>

          {/* Left: SVG circle */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg
              width={svgSize}
              height={svgSize}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              style={{ overflow: 'visible', maxWidth: '100%' }}
            >
              <defs>
                {/* Gold gradient for progress arc */}
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#C9A84C" stopOpacity="1" />
                  <stop offset="100%" stopColor="#E8C96A" stopOpacity="0.85" />
                </linearGradient>
                {/* Subtle inner glow */}
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(201,168,76,0.08)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                {/* Filter for node glow */}
                <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer decorative ring */}
              <circle cx={CX} cy={CY} r={TRACK_R + NODE_R + 14}
                fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth={1} />

              {/* Track ring */}
              <circle cx={CX} cy={CY} r={TRACK_R}
                fill="none" stroke="rgba(201,168,76,0.10)" strokeWidth={1.5} />

              {/* Animated progress arc */}
              <AnimatedArc pct={arcPct} r={TRACK_R} cx={CX} cy={CY} />

              {/* Center glow disc */}
              <circle cx={CX} cy={CY} r={CENTER_R * 1.8} fill="url(#centerGlow)" />

              {/* Center emblem circle */}
              <circle cx={CX} cy={CY} r={CENTER_R}
                fill="rgba(13,27,42,0.95)"
                stroke="rgba(201,168,76,0.25)" strokeWidth={1.5} />

              {/* Center text */}
              <text x={CX} y={CY - 14} textAnchor="middle"
                fontFamily="'Cormorant Garamond', serif"
                fontSize={svgSize * 0.072} fontWeight="300"
                fill="#C9A84C">{PROGRESS}%</text>
              <text x={CX} y={CY + 6} textAnchor="middle"
                fontFamily="'Jost', sans-serif"
                fontSize={svgSize * 0.025} fill="rgba(250,248,242,0.45)"
                letterSpacing="3">COMPLETE</text>
              <text x={CX} y={CY + 22} textAnchor="middle"
                fontFamily="'Jost', sans-serif"
                fontSize={svgSize * 0.02} fill="rgba(250,248,242,0.28)"
                letterSpacing="2">OF THE JOURNEY</text>

              {/* Inner decorative ring */}
              <circle cx={CX} cy={CY} r={CENTER_R + 10}
                fill="none" stroke="rgba(201,168,76,0.08)" strokeWidth={1} />

              {/* Milestone nodes */}
              {MILESTONES.map((m, i) => {
                const pos = nodePositions[i];
                const style = NODE_STYLE[m.status];
                const isSelected = selected === i;

                return (
                  <g
                    key={m.num}
                    className="journey-node"
                    onClick={() => handleSelect(i)}
                    style={{ filter: isSelected ? 'brightness(1.3)' : style.glow }}
                  >
                    {/* Pulse ring for active */}
                    {m.status === 'active' && (
                      <PulseRing cx={pos.x} cy={pos.y} r={NODE_R} />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={pos.x} cy={pos.y} r={isSelected ? NODE_R * 1.4 : NODE_R}
                      fill={style.fill}
                      stroke={isSelected ? '#C9A84C' : style.stroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      style={{ transition: 'r 0.25s ease, stroke 0.25s ease' }}
                    />

                    {/* Number label */}
                    <text
                      x={pos.x} y={pos.y + (svgSize * 0.012)}
                      textAnchor="middle"
                      fontFamily="'Cormorant Garamond', serif"
                      fontSize={svgSize * 0.028}
                      fontWeight={m.status === 'complete' ? '700' : '400'}
                      fill={m.status === 'complete' ? '#0D1B2A' : style.textColor}
                    >{m.num}</text>

                    {/* Outer label — title (short) */}
                    {(() => {
                      // Keep labels short — truncate at first word or 12 chars
                      const words = m.title.split(' ');
                      const short = words.length > 2
                        ? words.slice(0, 2).join(' ')
                        : m.title;
                      // Decide anchor based on position
                      const anchor = pos.lx > CX + 4 ? 'start' : pos.lx < CX - 4 ? 'end' : 'middle';
                      const dx = pos.lx > CX + 4 ? 6 : pos.lx < CX - 4 ? -6 : 0;
                      return (
                        <text
                          x={pos.lx + dx}
                          y={pos.ly + (svgSize * 0.01)}
                          textAnchor={anchor}
                          fontFamily="'Jost', sans-serif"
                          fontSize={svgSize * 0.022}
                          letterSpacing="1"
                          fill={isSelected ? '#C9A84C' : style.textColor}
                          style={{ transition: 'fill 0.25s ease', textTransform: 'uppercase' }}
                        >
                          {short}
                        </text>
                      );
                    })()}
                  </g>
                );
              })}

              {/* Legend — bottom center */}
              {[
                { color: '#C9A84C',                    label: 'Complete' },
                { color: 'rgba(250,248,242,0.75)',      label: 'In Progress' },
                { color: 'rgba(250,248,242,0.2)',       label: 'Upcoming' },
              ].map((leg, i) => (
                <g key={leg.label} transform={`translate(${CX - 90 + i * 65},${svgSize - 18})`}>
                  <circle cx={0} cy={0} r={4} fill={leg.color} />
                  <text x={8} y={4}
                    fontFamily="'Jost', sans-serif"
                    fontSize={svgSize * 0.019}
                    fill="rgba(250,248,242,0.4)"
                    letterSpacing="1">
                    {leg.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Right: Detail card or instruction */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            paddingTop: '2rem',
          }}>
            {selected !== null ? (
              <DetailCard m={MILESTONES[selected]} onClose={() => setSelected(null)} />
            ) : (
              <div style={{
                border: '1px dashed rgba(201,168,76,0.18)',
                borderRadius: 6,
                padding: '2.5rem 2rem',
                textAlign: 'center',
                width: '100%',
              }}>
                <div style={{
                  fontSize: '1.6rem', marginBottom: '1rem',
                  color: 'rgba(201,168,76,0.4)',
                }}>◎</div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: 'rgba(250,248,242,0.3)',
                  lineHeight: 1.8,
                }}>
                  Select any milestone on the<br />circle to read its story.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Mobile: vertical accordion list */
        <MobileTimeline selected={selected} onSelect={setSelected} />
      )}

      {/* ── Footer note ── */}
      <div style={{
        padding: 'clamp(2rem,4vw,3rem) clamp(1.25rem,5vw,5rem)',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 24, height: 24, margin: '0 auto 1.25rem',
          opacity: 0.35,
        }}>
          {/* Crown mark */}
          <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1">
            <path d="M3 18h18M3 18L6 8l6 5 4-8 4 8 3-3-4 8" />
          </svg>
        </div>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          color: 'rgba(250,248,242,0.3)',
          lineHeight: 1.85,
          maxWidth: 520, margin: '0 auto',
        }}>
          "A defining moment. The legacy we build today will welcome generations tomorrow."
        </p>
        <p style={{
          fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(250,248,242,0.2)', marginTop: '1.25rem',
        }}>
          This page is updated as each milestone is reached.
        </p>
      </div>
    </div>
  );
}
