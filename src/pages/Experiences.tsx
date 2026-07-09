import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../context/AuthContext';

// ── Data ───────────────────────────────────────────────────────────────────────
interface World {
  id: string;
  name: string;
  tagline: string;
  img: string;
  teasers: { title: string; detail: string }[];
}

const WORLDS: World[] = [
  {
    id: 'weddings',
    name: 'Weddings',
    tagline: 'Where ceremonies become legacy.',
    img: 'hero-wedding.jpg',
    teasers: [
      { title: 'The Pavilion', detail: 'Designed for the traditional Ibibio ceremony. The architecture, the ceremony flow, and the gathering are held within a space built for exactly this moment.' },
      { title: 'The Grand Ballroom', detail: 'For the reception that follows. Eight hundred guests, crystal chandeliers, and a service team that anticipates before it is asked.' },
      { title: 'The Bridal Experience', detail: 'A private suite, a dedicated host, and a morning of calm before everything begins.' },
      { title: 'The Proposal', detail: 'Before the wedding, there is the question. We help you ask it in a way that will be retold for decades.' },
    ],
  },
  {
    id: 'The Pavilion',
    name: 'The Pavilion',
    tagline: 'Tradition, returned home.',
    img: 'hero-wedding.jpg',
    teasers: [
      { title: 'Cultural Immersion Evenings', detail: 'An evening in the Pavilion — Ibibio music, story, performance, and cuisine. Open to guests. Curated by the community.' },
      { title: 'The Heritage Dining Table', detail: "A private meal centred around Akwa Ibom's culinary traditions. Prepared by our cultural kitchen team. Served in the Pavilion." },
      { title: 'Community Encounter', detail: 'A private guided engagement with local artisans, historians, and cultural custodians. Not a tour. A conversation.' },
    ],
  },
  {
    id: 'homecoming',
    name: 'The Homecoming',
    tagline: 'For those who have travelled far.',
    img: 'entrance-hero.jpg',
    teasers: [
      { title: 'The Arrival', detail: 'From the airport to your room, everything is in motion before you land. Your preferences arrived before you did.' },
      { title: 'The Family Suite', detail: 'The Residence — two king beds, shared living space, and a configuration that makes the hotel feel like the family home you should have been born in.' },
      { title: 'The Reunion Gathering', detail: 'Eldorado can host the entire extended family. A private wing, a communal dining arrangement, and a team assigned to the occasion.' },
    ],
  },
  {
    id: 'dining',
    name: 'Dining',
    tagline: 'Some tables are remembered forever.',
    img: 'afang-fine-dining.jpg',
    teasers: [
      { title: 'The Signature Restaurant', detail: 'Nigerian haute cuisine — afang, banga, jollof, and Cross River seafood plated with the discipline of fine dining. The menu changes with the season.' },
      { title: 'The Private Dining Room', detail: 'Twelve seats. One table. Your occasion. Chef-curated menu, private sommelier, and a room that belongs entirely to your evening.' },
      { title: 'Breakfast at Eldorado', detail: 'Served in your suite or at the terrace. Never rushed. Always warm.' },
      { title: 'The Bar', detail: 'Nigerian spirits, West African botanicals, and a cocktail programme that takes the continent seriously.' },
    ],
  },
  {
    id: 'wellness',
    name: 'Wellness',
    tagline: 'Return to yourself.',
    img: 'hero-spa.jpg',
    teasers: [
      { title: 'The Still Room', detail: 'Eight treatment rooms, a heated mineral pool, and practitioners trained in ancient West African healing traditions refined for the contemporary guest.' },
      { title: 'The Fitness Centre', detail: 'Open 24 hours. Strength, cardio, functional training, and an indoor sprint track — with floor-to-ceiling views of the tropical garden.' },
      { title: 'Morning Ritual', detail: 'A personalised morning programme — yoga, breathwork, guided movement, or simply silence by the pool. Designed around your stay.' },
    ],
  },
  {
    id: 'after-dark',
    name: 'After Dark',
    tagline: 'The night, properly considered.',
    img: 'hero-theater.jpg',
    teasers: [
      { title: "Gaffer's Club", detail: 'Every Premier League fixture, every Champions League night — broadcast at cinematic scale, with premium service and company worth keeping.' },
      { title: 'The Rooftop', detail: 'An evening above Uyo. Cocktails, open sky, and the kind of conversation that happens when there is nowhere better to be.' },
      { title: 'Live Performance Nights', detail: 'The Eldorado Calendar brings curated performance — music, spoken word, and cultural events — to the hotel. Selected dates. Never incidental.' },
    ],
  },
  {
    id: 'private-occasions',
    name: 'Private Occasions',
    tagline: 'For the moments that belong only to you.',
    img: 'aerial-night.jpg',
    teasers: [
      { title: 'The Anniversary', detail: 'We know the date before you mention it. The rest is attended to before you ask.' },
      { title: 'The Milestone Birthday', detail: 'A private event — dinner, suite, and a programme of the evening designed around the person being celebrated.' },
      { title: 'Corporate Hospitality', detail: 'The Grand Ballroom, private dining, and a service team that understands what it means to host at a standard your guests will remember.' },
    ],
  },
  {
    id: 'calendar',
    name: 'The Eldorado Calendar',
    tagline: 'A changing programme of performances, gatherings, culture, and celebration.',
    img: 'aerial-night.jpg',
    teasers: [
      { title: 'Cultural Residencies', detail: 'Artists, musicians, and storytellers in residence at Eldorado. The work they create here belongs to this place.' },
      { title: 'Signature Gatherings', detail: 'Curated seasonal events — dining evenings, cultural celebrations, and gatherings drawn from the Eldorado Circle membership community.' },
      { title: 'The Opening Season', detail: 'Our inaugural programme of events will be announced in the months before we open. Join the waitlist to be among the first to receive it.' },
    ],
  },
];

// ── Heart Icon SVG ─────────────────────────────────────────────────────────────
function HeartIcon({ filled, size = 18 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#C9A84C' : 'none'}
      stroke={filled ? '#C9A84C' : 'rgba(250,248,242,0.8)'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// ── Toast nudge ────────────────────────────────────────────────────────────────
function SignInNudge({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      pointerEvents: 'none',
      zIndex: 9999,
      background: 'rgba(13,27,42,0.96)',
      border: '1px solid rgba(201,168,76,0.25)',
      borderRadius: 4,
      padding: '0.65rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      whiteSpace: 'nowrap',
    }}>
      <HeartIcon filled={false} size={14} />
      <span style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '0.72rem',
        letterSpacing: '0.06em',
        color: 'rgba(250,248,242,0.75)',
      }}>Sign in to save experiences to My Eldorado</span>
    </div>
  );
}

// ── World card (compact) ───────────────────────────────────────────────────────
interface WorldCardProps {
  w: World;
  onClick: () => void;
  isSaved: boolean;
  onHeartClick: (e: React.MouseEvent) => void;
  saving: boolean;
}

function WorldCard({ w, onClick, isSaved, onHeartClick, saving }: WorldCardProps) {
  const [hovered, setHovered] = useState(false);
  const [heartHovered, setHeartHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid={`card-experience-${w.id}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        cursor: 'pointer',
        height: 'clamp(200px, 28vw, 280px)',
        border: '1px solid rgba(201,168,76,0.12)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        boxShadow: hovered ? '0 12px 40px rgba(13,27,42,0.25)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('/assets/${w.img}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.6s ease',
      }} />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.5) 60%, rgba(13,27,42,0.2) 100%)'
          : 'linear-gradient(to top, rgba(13,27,42,0.88) 0%, rgba(13,27,42,0.35) 100%)',
        transition: 'background 0.35s ease',
      }} />

      {/* Heart button — top right */}
      <button
        data-testid={`button-save-experience-${w.id}`}
        onClick={onHeartClick}
        onMouseEnter={() => setHeartHovered(true)}
        onMouseLeave={() => setHeartHovered(false)}
        title={isSaved ? 'Remove from saved' : 'Save to My Eldorado'}
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          zIndex: 10,
          background: 'rgba(13,27,42,0.55)',
          border: `1px solid ${isSaved ? 'rgba(201,168,76,0.4)' : 'rgba(250,248,242,0.18)'}`,
          borderRadius: '50%',
          width: 34,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: hovered || isSaved ? 1 : 0,
          transform: `scale(${heartHovered ? 1.12 : 1}) ${saving ? 'scale(0.92)' : ''}`,
          transition: 'opacity 0.25s ease, transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        aria-label={isSaved ? `Remove ${w.name} from saved` : `Save ${w.name}`}
      >
        <HeartIcon filled={isSaved} size={15} />
      </button>

      {/* Text */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '1.25rem 1.25rem 1rem',
      }}>
        <div style={{
          fontSize: '0.5rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.7)', marginBottom: '0.3rem',
        }}>Eldorado Experience</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
          fontWeight: 400,
          color: '#FAF8F2',
          lineHeight: 1.2,
          marginBottom: '0.35rem',
        }}>{w.name}</div>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.72rem',
          color: 'rgba(250,248,242,0.55)',
          lineHeight: 1.55,
          fontStyle: 'italic',
          maxWidth: 280,
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}>{w.tagline}</p>

        {/* Arrow hint */}
        <div style={{
          fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--gold)',
          marginTop: '0.6rem',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>Discover →</div>
      </div>
    </div>
  );
}

// ── World drawer — slides in horizontally from the right ──────────────────────
function WorldDrawer({ w, onClose }: { w: World | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  // Mount on first open, then flip to visible on the next frame so the
  // transform transition actually animates instead of snapping into place.
  useEffect(() => {
    if (w) {
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }
    setMounted(false);
  }, [w]);

  // Lock body scroll while the drawer is open; close on Escape.
  useEffect(() => {
    if (!w) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [w, onClose]);

  if (!w) return null;

  return (
    <div
      aria-hidden={!mounted}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: `rgba(13,27,42,${mounted ? 0.72 : 0})`,
        transition: 'background 0.35s ease',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Drawer — slides in horizontally from the right edge */}
      <div
        data-testid={`drawer-experience-${w.id}`}
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: 'min(94vw, 640px)',
          background: 'var(--ivory)',
          boxShadow: '-24px 0 60px rgba(13,27,42,0.35)',
          overflowY: 'auto',
          transform: `translateX(${mounted ? '0%' : '100%'})`,
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
      {/* Panel header with image */}
      <div style={{
        position: 'relative',
        height: 'clamp(200px, 26vw, 260px)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('/assets/${w.img}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,27,42,0.88) 0%, rgba(13,27,42,0.2) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 300, color: '#FAF8F2', lineHeight: 1.1,
            }}>{w.name}</div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.92rem',
              color: 'rgba(201,168,76,0.85)',
              marginTop: '0.25rem',
            }}>{w.tagline}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(13,27,42,0.6)', border: '1px solid rgba(250,248,242,0.2)',
            color: '#FAF8F2', cursor: 'pointer',
            borderRadius: 3, padding: '0.35rem 0.75rem',
            fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: "'Jost', sans-serif",
            flexShrink: 0,
          }}>Close</button>
        </div>
      </div>

      {/* Teaser cards — single column, stacked down the drawer */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        background: 'rgba(201,168,76,0.1)',
      }}>
        {w.teasers.map((t) => (
          <div key={t.title} style={{
            background: 'var(--ivory)',
            padding: '1.25rem 1.25rem 1.5rem',
          }}>
            <div style={{
              width: 20, height: 1,
              background: 'rgba(201,168,76,0.5)',
              marginBottom: '0.75rem',
            }} />
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.05rem',
              fontWeight: 500,
              color: 'var(--navy)',
              marginBottom: '0.5rem',
              lineHeight: 1.25,
            }}>{t.title}</div>
            <p style={{
              fontSize: '0.8rem',
              lineHeight: 1.75,
              color: 'rgba(13,27,42,0.62)',
            }}>{t.detail}</p>
          </div>
        ))}

        {/* Enquire card — always last */}
        <div style={{
          background: 'var(--navy)',
          padding: '1.25rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.05rem', fontWeight: 300,
            color: 'var(--ivory)', lineHeight: 1.4,
          }}>Begin the conversation.</div>
          <p style={{
            fontSize: '0.72rem', color: 'rgba(250,248,242,0.4)',
            lineHeight: 1.7,
          }}>The details of your experience are arranged privately.</p>
          <div style={{
            fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--gold)', cursor: 'pointer',
            borderBottom: '1px solid rgba(201,168,76,0.3)',
            paddingBottom: '2px',
          }}>Enquire →</div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Experiences({ setPage }: { setPage?: (p: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const { user, token } = useAuth();

  // Saved experiences from Convex (only when signed in)
  const savedList = useQuery(
    api.account.getSavedExperiences,
    token ? { token } : 'skip'
  );

  const saveExperienceMutation = useMutation(api.account.saveExperience);
  const removeSavedMutation = useMutation(api.account.removeSavedExperience);

  // Build a Set of saved world IDs for O(1) lookup
  const savedIds = new Set(
    (savedList ?? []).map(s => {
      // experienceName is the world name — map back to id
      const match = WORLDS.find(w => w.name === s.experienceName);
      return match?.id ?? '';
    }).filter(Boolean)
  );

  const handleHeartClick = useCallback(async (e: React.MouseEvent, world: World) => {
    e.stopPropagation(); // Don't open the panel

    if (!user || !token) {
      // Show sign-in nudge
      setNudgeVisible(true);
      setTimeout(() => setNudgeVisible(false), 2800);
      return;
    }

    setSavingId(world.id);
    try {
      if (savedIds.has(world.id)) {
        await removeSavedMutation({ token, experienceName: world.name });
      } else {
        await saveExperienceMutation({
          token,
          experienceName: world.name,
          experienceCategory: 'experience',
          experienceDesc: world.tagline,
        });
      }
    } finally {
      setSavingId(null);
    }
  }, [user, token, savedIds, saveExperienceMutation, removeSavedMutation]);

  const handleSelect = (id: string) => setOpen(id);
  const activeWorld = WORLDS.find(w => w.id === open) ?? null;

  return (
    <div>
      {/* Hero */}
      <div style={{
        position: 'relative', height: '55vh', minHeight: 360,
        display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/assets/entrance-hero.jpg')",
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,27,42,0.93) 0%, rgba(13,27,42,0.2) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '3rem clamp(1.5rem,5vw,5rem)' }}>
          <div style={{
            fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '0.65rem',
          }}>Eight Worlds</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 300, color: 'var(--ivory)', lineHeight: 1.1,
            marginBottom: '0.85rem',
          }}>Beyond the Room</h1>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontStyle: 'italic',
            fontSize: 'clamp(0.82rem, 1.6vw, 0.98rem)',
            color: 'rgba(250,248,242,0.5)',
            maxWidth: 480, lineHeight: 1.85,
          }}>
            Eldorado is not a hotel with experiences attached to it. The experiences are the hotel. Select a world to begin.
          </p>
        </div>
      </div>

      {/* Worlds grid */}
      <section style={{
        background: 'var(--navy)',
        padding: 'clamp(2rem,4vw,3.5rem) clamp(1.25rem,5vw,4rem)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          maxWidth: 1200, margin: '0 auto',
        }}>
          {WORLDS.map(w => (
            <WorldCard
              key={w.id}
              w={w}
              onClick={() => handleSelect(w.id)}
              isSaved={savedIds.has(w.id)}
              onHeartClick={(e) => handleHeartClick(e, w)}
              saving={savingId === w.id}
            />
          ))}
        </div>

        {/* Bottom note */}
        <div style={{
          textAlign: 'center',
          marginTop: 'clamp(2rem,4vw,3rem)',
          maxWidth: 560, margin: 'clamp(2rem,4vw,3rem) auto 0',
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
            color: 'rgba(250,248,242,0.28)',
            lineHeight: 1.85,
          }}>
            The full programme of each world is arranged privately, in conversation with our team. What you see here is only the beginning.
          </p>
        </div>
      </section>

      {/* World detail — slides in horizontally from the right */}
      <WorldDrawer w={activeWorld} onClose={() => setOpen(null)} />

      {/* Sign-in nudge toast */}
      <SignInNudge visible={nudgeVisible} />
    </div>
  );
}
