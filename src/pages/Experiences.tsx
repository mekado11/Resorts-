import { useState } from 'react';

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
      { title: 'The Ekom Iban Pavilion', detail: 'Designed for the traditional Ibibio ceremony. The architecture, the ceremony flow, and the gathering are held within a space built for exactly this moment.' },
      { title: 'The Grand Ballroom', detail: 'For the reception that follows. Eight hundred guests, crystal chandeliers, and a service team that anticipates before it is asked.' },
      { title: 'The Bridal Experience', detail: 'A private suite, a dedicated host, and a morning of calm before everything begins.' },
      { title: 'The Proposal', detail: 'Before the wedding, there is the question. We help you ask it in a way that will be retold for decades.' },
    ],
  },
  {
    id: 'ekom-iban',
    name: 'Ekom Iban',
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

// ── World card (compact) ───────────────────────────────────────────────────────
function WorldCard({ w, onClick }: { w: World; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

// ── Expanded world panel ───────────────────────────────────────────────────────
function WorldPanel({ w, onClose }: { w: World; onClose: () => void }) {
  return (
    <div style={{
      background: 'var(--ivory)',
      border: '1px solid rgba(201,168,76,0.2)',
      borderRadius: 5,
      overflow: 'hidden',
      marginTop: '0.75rem',
    }}>
      {/* Panel header with image */}
      <div style={{
        position: 'relative',
        height: 'clamp(160px, 20vw, 220px)',
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

      {/* Teaser cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
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
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Experiences() {
  const [open, setOpen] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setOpen(prev => prev === id ? null : id);
    // Scroll to panel after brief delay to let it render
    if (open !== id) {
      setTimeout(() => {
        document.getElementById(`world-panel-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  };

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
            <div key={w.id}>
              <WorldCard w={w} onClick={() => handleSelect(w.id)} />

              {/* Inline expanded panel */}
              {open === w.id && (
                <div id={`world-panel-${w.id}`}>
                  <WorldPanel w={w} onClose={() => setOpen(null)} />
                </div>
              )}
            </div>
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
    </div>
  );
}
