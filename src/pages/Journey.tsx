import { useEffect, useRef, useState } from 'react';

// ── Data ───────────────────────────────────────────────────────────────────────
interface Milestone {
  num: string;
  title: string;
  status: 'complete' | 'active' | 'upcoming';
  statusLabel: string;
  desc: string;
  img?: string;          // thumbnail path inside /assets/
  journal?: string;
}

const MILESTONES: Milestone[] = [
  {
    num: '01', title: 'Land Acquired',
    status: 'complete', statusLabel: 'Complete',
    img: 'milestone-land.jpg',
    desc: 'The home of Eldorado has been secured in Akwa Ibom State. The vision now has a place to stand.',
    journal: 'A defining moment. The land that will carry this legacy is ours.',
  },
  {
    num: '02', title: 'Architecture & Design',
    status: 'complete', statusLabel: 'Complete',
    img: 'entrance-hero.jpg',
    desc: 'Every room, corridor and signature space — The Grand Ballroom, The Still Room, Ekom Iban Pavilion and the Flagship Suite — are fully designed.',
    journal: 'Every room, every corridor, every view has been considered. The vision is drawn.',
  },
  {
    num: '03', title: 'Survey & Site Definition',
    status: 'active', statusLabel: 'In Progress',
    img: 'milestone-land.jpg',
    desc: 'Boundary surveys underway. The physical limits of the estate are being precisely established, measured and documented.',
  },
  {
    num: '04', title: 'Permitting & Approvals',
    status: 'active', statusLabel: 'In Progress',
    desc: 'Development permits, engineering sign-offs and all required regulatory approvals are being processed with Akwa Ibom State authorities.',
  },
  {
    num: '05', title: 'Borehole & Water Infrastructure',
    status: 'active', statusLabel: 'In Progress',
    img: 'milestone-borehole.jpg',
    desc: 'A dedicated borehole is being drilled and water storage infrastructure installed on site. Reliable, independent water supply is foundational to the operation of a world-class hotel.',
    journal: 'No hotel of this calibre can depend on inconsistent supply. This infrastructure is being built to last.',
  },
  {
    num: '06', title: 'Fencing & Site Security',
    status: 'upcoming', statusLabel: 'Upcoming',
    desc: 'The estate perimeter is secured. Fencing marks the first visible presence of Eldorado on the land.',
  },
  {
    num: '07', title: 'Property Registration',
    status: 'upcoming', statusLabel: 'Upcoming',
    desc: 'Formal title documentation and official registration, completing the legal foundation of the Eldorado estate.',
  },
  {
    num: '08', title: 'Site Preparation',
    status: 'upcoming', statusLabel: 'Upcoming',
    desc: 'Clearing, grading and full construction mobilization. The land is prepared to receive the building.',
  },
  {
    num: '09', title: 'Construction Begins',
    status: 'upcoming', statusLabel: 'Upcoming',
    desc: 'Foundation, superstructure and the first floors of the six-storey tower rise from the ground.',
  },
  {
    num: '10', title: 'Structure Complete',
    status: 'upcoming', statusLabel: 'Upcoming',
    desc: 'Main buildings, roofing and core infrastructure completed. The silhouette of Eldorado stands on the Lagos-Calabar coastal road.',
  },
  {
    num: '11', title: 'Interior Fit-Out',
    status: 'upcoming', statusLabel: 'Upcoming',
    img: 'eldorado-flagship-suite.jpg',
    desc: 'Ninety rooms and suites, The Still Room spa, Gaffer\'s Club cinema, The Grand Ballroom and all public spaces come to life.',
  },
  {
    num: '12', title: 'Landscaping & Grounds',
    status: 'upcoming', statusLabel: 'Upcoming',
    desc: 'Tropical gardens, arrival roads, resort lighting, the ceremonial entrance and the full outdoor resort grounds.',
  },
  {
    num: '13', title: 'Team Recruitment',
    status: 'upcoming', statusLabel: 'Upcoming',
    desc: 'The people who will define the Eldorado experience are carefully selected and trained to an extraordinary standard.',
  },
  {
    num: '14', title: 'Soft Opening',
    status: 'upcoming', statusLabel: 'Upcoming',
    desc: 'A private opening period for testing, refinement and invited guests. The hotel breathes for the first time.',
  },
  {
    num: '15', title: 'Grand Opening',
    status: 'upcoming', statusLabel: 'Coming Soon',
    img: 'aerial-night.jpg',
    desc: 'Eldorado opens its doors. A new standard of hospitality arrives on the Lagos-Calabar coastal road.',
  },
];

const TOTAL          = MILESTONES.length;
const COMPLETE_COUNT = MILESTONES.filter(m => m.status === 'complete').length;
const ACTIVE_COUNT   = MILESTONES.filter(m => m.status === 'active').length;
const PROGRESS       = Math.round((COMPLETE_COUNT / TOTAL) * 100);
// Arc fill = completed + half of active
const ARC_PCT        = (COMPLETE_COUNT + ACTIVE_COUNT * 0.5) / TOTAL;

// ── Colour tokens ──────────────────────────────────────────────────────────────
const C = {
  gold:   '#C9A84C',
  ivory:  '#FAF8F2',
  navy:   '#0D1B2A',
};

const STATUS = {
  complete: {
    nodeFill:   C.gold,
    nodeStroke: C.gold,
    numColor:   C.navy,
    glow:       'rgba(201,168,76,0.7)',
    badge:      'rgba(201,168,76,0.15)',
    badgeBorder:'rgba(201,168,76,0.45)',
    badgeText:  C.gold,
    titleColor: C.ivory,
    bodyColor:  'rgba(250,248,242,0.7)',
    cardBorder: 'rgba(201,168,76,0.22)',
    cardBg:     'rgba(201,168,76,0.05)',
  },
  active: {
    nodeFill:   'rgba(250,248,242,0.1)',
    nodeStroke: C.ivory,
    numColor:   C.ivory,
    glow:       'rgba(250,248,242,0.4)',
    badge:      'rgba(250,248,242,0.07)',
    badgeBorder:'rgba(250,248,242,0.35)',
    badgeText:  C.ivory,
    titleColor: C.ivory,
    bodyColor:  'rgba(250,248,242,0.62)',
    cardBorder: 'rgba(250,248,242,0.12)',
    cardBg:     'rgba(250,248,242,0.03)',
  },
  upcoming: {
    nodeFill:   'transparent',
    nodeStroke: 'rgba(250,248,242,0.18)',
    numColor:   'rgba(250,248,242,0.25)',
    glow:       'none',
    badge:      'transparent',
    badgeBorder:'rgba(250,248,242,0.12)',
    badgeText:  'rgba(250,248,242,0.3)',
    titleColor: 'rgba(250,248,242,0.4)',
    bodyColor:  'rgba(250,248,242,0.28)',
    cardBorder: 'rgba(250,248,242,0.06)',
    cardBg:     'transparent',
  },
};

// ── SVG Circle ─────────────────────────────────────────────────────────────────
function JourneyCircle({
  size,
  selected,
  onSelect,
}: {
  size: number;
  selected: number | null;
  onSelect: (i: number) => void;
}) {
  const [arcDrawn, setArcDrawn] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setArcDrawn(ARC_PCT), 400);
    return () => clearTimeout(t);
  }, []);

  const CX = size / 2;
  const CY = size / 2;
  // Keep track tight — 82% of half-size so labels don't exist
  const RING_R  = size * 0.38;
  const NODE_R  = size * 0.045;
  const CENT_R  = size * 0.18;

  // Arc path helpers
  const circumference = 2 * Math.PI * RING_R;
  const dashOffset    = circumference * (1 - arcDrawn);

  // Pulse animation ref for active nodes
  const [pulseTick, setPulseTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPulseTick(t => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="jGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#B8923E" />
          <stop offset="50%"  stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E2C46A" />
        </linearGradient>
        <filter id="jGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="jGlowW" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer decorative rings */}
      <circle cx={CX} cy={CY} r={RING_R + NODE_R + 10}
        fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth={1} />
      <circle cx={CX} cy={CY} r={RING_R - NODE_R - 6}
        fill="none" stroke="rgba(201,168,76,0.04)" strokeWidth={1} />

      {/* Track */}
      <circle cx={CX} cy={CY} r={RING_R}
        fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth={1.5} />

      {/* Progress arc — drawn BEHIND nodes */}
      <circle
        cx={CX} cy={CY} r={RING_R}
        fill="none"
        stroke="url(#jGold)"
        strokeWidth={2.5}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${CX} ${CY})`}
        style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)' }}
      />

      {/* Center circle */}
      <circle cx={CX} cy={CY} r={CENT_R}
        fill="rgba(10,20,34,0.97)"
        stroke="rgba(201,168,76,0.2)" strokeWidth={1.5} />
      {/* Inner ring */}
      <circle cx={CX} cy={CY} r={CENT_R - 6}
        fill="none" stroke="rgba(201,168,76,0.07)" strokeWidth={1} />

      {/* Center text */}
      <text x={CX} y={CY - (size * 0.05)}
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif"
        fontSize={size * 0.082} fontWeight="300"
        fill={C.gold}
      >{PROGRESS}%</text>
      <text x={CX} y={CY + (size * 0.03)}
        textAnchor="middle"
        fontFamily="'Jost', sans-serif"
        fontSize={size * 0.028}
        fill="rgba(250,248,242,0.4)"
        letterSpacing="3"
      >COMPLETE</text>

      {/* Milestone nodes — drawn ON TOP of arc */}
      {MILESTONES.map((m, i) => {
        const angleDeg = (360 / TOTAL) * i - 90;
        const rad      = (angleDeg * Math.PI) / 180;
        const nx       = CX + RING_R * Math.cos(rad);
        const ny       = CY + RING_R * Math.sin(rad);
        const st       = STATUS[m.status];
        const isSel    = selected === i;
        const nr       = isSel ? NODE_R * 1.35 : NODE_R;
        const isActive = m.status === 'active';

        return (
          <g key={m.num}
            onClick={() => onSelect(i)}
            style={{ cursor: 'pointer' }}
          >
            {/* Pulse for active */}
            {isActive && (
              <circle cx={nx} cy={ny} r={NODE_R + 8}
                fill="none"
                stroke="rgba(250,248,242,0.15)"
                strokeWidth={1}
                key={`pulse-${pulseTick}-${i}`}
                style={{ animation: 'jpulse 1.8s ease-out forwards' }}
              />
            )}

            {/* Glow halo */}
            {m.status !== 'upcoming' && (
              <circle cx={nx} cy={ny} r={nr + 4}
                fill="none"
                stroke={m.status === 'complete' ? 'rgba(201,168,76,0.35)' : 'rgba(250,248,242,0.2)'}
                strokeWidth={1}
                filter={m.status === 'complete' ? 'url(#jGlow)' : 'url(#jGlowW)'}
              />
            )}

            {/* Node fill */}
            <circle cx={nx} cy={ny} r={nr}
              fill={isSel ? (m.status === 'complete' ? C.gold : 'rgba(250,248,242,0.2)') : st.nodeFill}
              stroke={isSel ? C.gold : st.nodeStroke}
              strokeWidth={isSel ? 2 : 1.5}
              style={{ transition: 'r 0.25s ease, fill 0.2s ease' }}
            />

            {/* Number */}
            <text
              x={nx} y={ny + (size * 0.013)}
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', serif"
              fontSize={size * 0.032}
              fontWeight={m.status === 'complete' ? '700' : '400'}
              fill={isSel && m.status === 'complete' ? C.navy : st.numColor}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >{m.num}</text>
          </g>
        );
      })}

      {/* Legend — bottom strip, outside the SVG at bottom */}
      {[
        { color: C.gold,                      fill: true,  label: 'Complete' },
        { color: 'rgba(250,248,242,0.7)',      fill: false, label: 'In Progress' },
        { color: 'rgba(250,248,242,0.2)',      fill: false, label: 'Upcoming' },
      ].map((leg, li) => (
        <g key={leg.label} transform={`translate(${CX - 72 + li * 52}, ${size - 4})`}>
          <circle r={4}
            fill={leg.fill ? leg.color : 'none'}
            stroke={leg.color}
            strokeWidth={1.5}
            cx={0} cy={0}
          />
          <text x={9} y={4}
            fontFamily="'Jost', sans-serif"
            fontSize={size * 0.022}
            fill="rgba(250,248,242,0.38)"
            letterSpacing="0.5"
          >{leg.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Milestone row card ─────────────────────────────────────────────────────────
function MilestoneRow({
  m, index, isSelected, onClick,
}: {
  m: Milestone; index: number; isSelected: boolean; onClick: () => void;
}) {
  const st = STATUS[m.status];
  const ref = useRef<HTMLDivElement>(null);

  // Scroll into view when selected
  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '0.85rem',
        alignItems: 'flex-start',
        padding: '0.85rem 1rem',
        borderRadius: 5,
        cursor: 'pointer',
        border: `1px solid ${isSelected
          ? (m.status === 'complete' ? 'rgba(201,168,76,0.4)' : 'rgba(250,248,242,0.2)')
          : st.cardBorder}`,
        background: isSelected ? st.cardBg : 'transparent',
        marginBottom: '0.4rem',
        transition: 'border-color 0.2s, background 0.2s',
        opacity: m.status === 'upcoming' && !isSelected ? 0.55 : 1,
      }}
      onMouseEnter={e => {
        if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.2)';
      }}
      onMouseLeave={e => {
        if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = st.cardBorder;
      }}
    >
      {/* Thumbnail — only if image exists and selected, or status ≠ upcoming */}
      {m.img && (isSelected || m.status !== 'upcoming') ? (
        <div style={{
          width: isSelected ? 72 : 44,
          height: isSelected ? 52 : 44,
          flexShrink: 0,
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'width 0.3s ease, height 0.3s ease',
          border: `1px solid ${m.status === 'complete' ? 'rgba(201,168,76,0.3)' : 'rgba(250,248,242,0.1)'}`,
        }}>
          <img
            src={`/assets/${m.img}`}
            alt={m.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        /* Number badge if no image or upcoming */
        <div style={{
          width: 36, height: 36, flexShrink: 0,
          borderRadius: '50%',
          background: isSelected
            ? (m.status === 'complete' ? C.gold : 'rgba(250,248,242,0.12)')
            : st.nodeFill,
          border: `1.5px solid ${isSelected ? (m.status === 'complete' ? C.gold : C.ivory) : st.nodeStroke}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: m.status !== 'upcoming'
            ? `0 0 12px ${m.status === 'complete' ? 'rgba(201,168,76,0.4)' : 'rgba(250,248,242,0.15)'}`
            : 'none',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.72rem', fontWeight: 600,
            color: isSelected && m.status === 'complete' ? C.navy : st.numColor,
          }}>{m.num}</span>
        </div>
      )}

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(0.88rem, 1.6vw, 1.05rem)',
            fontWeight: 400,
            color: isSelected ? (m.status === 'upcoming' ? 'rgba(250,248,242,0.65)' : C.ivory) : st.titleColor,
            lineHeight: 1.2,
            transition: 'color 0.2s',
          }}>{m.title}</span>
          <span style={{
            fontSize: '0.48rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '0.15rem 0.5rem',
            background: st.badge,
            border: `1px solid ${st.badgeBorder}`,
            borderRadius: 2,
            color: st.badgeText,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>{m.statusLabel}</span>
        </div>

        {/* Expanded description */}
        {isSelected && (
          <div style={{
            overflow: 'hidden',
            maxHeight: isSelected ? 300 : 0,
            transition: 'max-height 0.4s ease',
          }}>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.8rem', lineHeight: 1.85,
              color: st.bodyColor,
              marginTop: '0.35rem',
              marginBottom: m.journal ? '0.75rem' : 0,
            }}>{m.desc}</p>

            {m.journal && (
              <div style={{
                padding: '0.6rem 0.8rem',
                background: 'rgba(201,168,76,0.05)',
                borderLeft: '2px solid rgba(201,168,76,0.3)',
                borderRadius: '0 3px 3px 0',
              }}>
                <span style={{
                  fontSize: '0.44rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.5)', display: 'block', marginBottom: '0.25rem',
                }}>Field Note</span>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic', fontSize: '0.88rem',
                  color: 'rgba(201,168,76,0.82)', lineHeight: 1.7,
                }}>"{m.journal}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chevron */}
      <div style={{
        color: 'rgba(201,168,76,0.4)',
        fontSize: '0.65rem',
        transform: isSelected ? 'rotate(180deg)' : 'rotate(0)',
        transition: 'transform 0.3s ease',
        flexShrink: 0,
        marginTop: '0.3rem',
      }}>▾</div>
    </div>
  );
}

// ── Mobile — same list, no circle ──────────────────────────────────────────────
function MobileView({ selected, onSelect }: {
  selected: number | null;
  onSelect: (i: number | null) => void;
}) {
  return (
    <div style={{ padding: '1.5rem 1.25rem', maxWidth: 600, margin: '0 auto' }}>
      {MILESTONES.map((m, i) => (
        <MilestoneRow
          key={m.num} m={m} index={i}
          isSelected={selected === i}
          onClick={() => onSelect(selected === i ? null : i)}
        />
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Journey() {
  const [selected, setSelected]   = useState<number | null>(null);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 860);
  const [circleSize, setCircleSize] = useState(400);
  const circleColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 860;
      setIsMobile(mobile);
      if (!mobile && circleColRef.current) {
        const w = circleColRef.current.clientWidth;
        setCircleSize(Math.min(Math.max(w - 32, 300), 480));
      }
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleSelect = (i: number) => setSelected(prev => prev === i ? null : i);

  return (
    <div style={{ background: C.navy, minHeight: '100vh' }}>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes jpulse {
          0%   { r: 14px; opacity: 0.6; }
          80%  { r: 26px; opacity: 0; }
          100% { r: 26px; opacity: 0; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        padding: 'clamp(4rem,9vw,8rem) clamp(1.5rem,5vw,5rem) clamp(1.5rem,3vw,2.5rem)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem',
        }}>
          <div>
            <div style={{
              fontSize: '0.56rem', letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.6)', marginBottom: '0.75rem',
            }}>The Road to Eldorado</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
              fontWeight: 300, color: C.ivory, lineHeight: 1.1,
              marginBottom: '0.75rem',
            }}>From Vision<br />to Destination</h1>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
              fontWeight: 300, color: 'rgba(250,248,242,0.5)',
              maxWidth: 440, lineHeight: 1.85,
            }}>
              Follow the journey as Eldorado comes to life. Every milestone, every decision, every step toward something extraordinary.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 'clamp(1.5rem,3vw,3rem)', flexWrap: 'wrap' }}>
            {[
              { val: String(COMPLETE_COUNT), label: 'Complete' },
              { val: String(ACTIVE_COUNT),   label: 'In Progress' },
              { val: String(TOTAL - COMPLETE_COUNT - ACTIVE_COUNT), label: 'Upcoming' },
              { val: `${PROGRESS}%`,         label: 'Progress' },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 300, color: C.gold, lineHeight: 1,
                }}>{s.val}</div>
                <div style={{
                  fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(250,248,242,0.3)', marginTop: '0.25rem',
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main body ── */}
      {isMobile ? (
        <MobileView selected={selected} onSelect={setSelected} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '0',
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,4vw,4rem)',
          alignItems: 'start',
          minHeight: 600,
        }}>

          {/* LEFT — milestone list */}
          <div style={{
            paddingRight: 'clamp(1.5rem,3vw,3rem)',
            borderRight: '1px solid rgba(201,168,76,0.1)',
            maxHeight: circleSize + 40,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            paddingTop: '0.5rem',
          }}>
            {/* Subtle hint — no card, just floating text above list */}
            <p style={{
              fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.4)',
              marginBottom: '0.9rem',
            }}>Select a milestone to expand ↓</p>

            {MILESTONES.map((m, i) => (
              <MilestoneRow
                key={m.num} m={m} index={i}
                isSelected={selected === i}
                onClick={() => handleSelect(i)}
              />
            ))}
          </div>

          {/* RIGHT — circle */}
          <div
            ref={circleColRef}
            style={{
              paddingLeft: 'clamp(1.5rem,3vw,3rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'sticky',
              top: 120,
            }}
          >
            <JourneyCircle
              size={circleSize}
              selected={selected}
              onSelect={handleSelect}
            />
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,5vw,5rem)',
        borderTop: '1px solid rgba(201,168,76,0.08)',
        textAlign: 'center',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
          color: 'rgba(250,248,242,0.28)',
          lineHeight: 1.8,
        }}>
          "A defining moment. The legacy we build today will welcome generations tomorrow."
        </p>
        <p style={{
          fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(250,248,242,0.18)', marginTop: '0.85rem',
        }}>Updated as each milestone is reached</p>
      </div>
    </div>
  );
}
