import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import AccountLayout from './AccountLayout';

const card: React.CSSProperties = { background: '#fff', border: '1px solid var(--linen)', borderRadius: 4, padding: '1.5rem', marginBottom: '1.25rem' };
const sectionTitle: React.CSSProperties = { fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 500, color: 'var(--navy)', marginBottom: '0.25rem' };
const sectionSub: React.CSSProperties = { fontSize: '0.78rem', color: 'rgba(13,27,42,0.45)', marginBottom: '1.25rem', lineHeight: 1.6 };
const selectStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(13,27,42,0.18)', borderRadius: 3,
  fontSize: '0.85rem', fontFamily: "'Jost',sans-serif", color: 'var(--navy)', background: '#fff',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230D1B2A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.85rem center', paddingRight: '2.25rem',
};
const chipRow: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' };

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '0.4rem 0.85rem', borderRadius: 20, border: active ? '1.5px solid var(--navy)' : '1px solid rgba(13,27,42,0.2)',
      background: active ? 'var(--navy)' : '#fff', color: active ? 'var(--ivory)' : 'rgba(13,27,42,0.6)',
      fontSize: '0.8rem', fontFamily: "'Jost',sans-serif", cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );
}

function PersistToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
      {[{ v: true, l: 'Remember for future stays' }, { v: false, l: 'This stay only' }].map(opt => (
        <label key={String(opt.v)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', cursor: 'pointer', color: value === opt.v ? 'var(--navy)' : 'rgba(13,27,42,0.45)' }}>
          <input type="radio" checked={value === opt.v} onChange={() => onChange(opt.v)} style={{ accentColor: 'var(--navy)' }} />
          {opt.l}
        </label>
      ))}
    </div>
  );
}

interface PrefState { value: string; persistent: boolean; dirty: boolean }

export default function MyPreferences({ setPage, onToast }: { setPage: (p: string) => void; onToast: (m: string) => void }) {
  const { token } = useAuth();
  const rawPrefs = useQuery(api.account.getPreferences, token ? { token } : 'skip') ?? [];
  const upsert = useMutation(api.account.upsertPreference);

  const getPref = (type: string): PrefState => {
    const found = rawPrefs.find(p => p.preferenceType === type);
    return { value: found?.value ?? '', persistent: found?.persistent ?? true, dirty: false };
  };

  // Room
  const [pillows, setPillows] = useState<PrefState>({ value: '', persistent: true, dirty: false });
  const [temp, setTemp] = useState<PrefState>({ value: '', persistent: true, dirty: false });
  const [roomLoc, setRoomLoc] = useState<PrefState>({ value: '', persistent: true, dirty: false });
  const [sleep, setSleep] = useState<PrefState>({ value: '', persistent: true, dirty: false });

  // Food
  const [morning, setMorning] = useState<PrefState>({ value: '', persistent: true, dirty: false });
  const [dietary, setDietary] = useState<PrefState>({ value: '', persistent: true, dirty: false });
  const [alcohol, setAlcohol] = useState<PrefState>({ value: '', persistent: true, dirty: false });

  // Arrival
  const [transport, setTransport] = useState<PrefState>({ value: '', persistent: true, dirty: false });

  // Travel style
  const [travelStyle, setTravelStyle] = useState<PrefState>({ value: '', persistent: true, dirty: false });

  // Comm style
  const [commStyle, setCommStyle] = useState<PrefState>({ value: '', persistent: true, dirty: false });

  useEffect(() => {
    if (rawPrefs.length === 0) return;
    setPillows(getPref('pillows'));
    setTemp(getPref('roomTemp'));
    setRoomLoc(getPref('roomLocation'));
    setSleep(getPref('sleepPref'));
    setMorning(getPref('morningDrink'));
    setDietary(getPref('dietary'));
    setAlcohol(getPref('alcohol'));
    setTransport(getPref('transport'));
    setTravelStyle(getPref('travelStyle'));
    setCommStyle(getPref('commStyle'));
  }, [rawPrefs.length]);

  const save = async (type: string, category: string, state: PrefState) => {
    if (!token || !state.value) return;
    await upsert({ token, category, preferenceType: type, value: state.value, persistent: state.persistent });
    onToast('Preference saved.');
  };

  const SaveBtn = ({ type, category, state }: { type: string; category: string; state: PrefState }) => (
    <button type="button" onClick={() => save(type, category, state)} disabled={!state.value} style={{
      marginTop: '0.75rem', padding: '0.5rem 1.1rem', background: 'var(--navy)', color: 'var(--gold)',
      border: 'none', borderRadius: 3, fontSize: '0.67rem', letterSpacing: '0.15em', textTransform: 'uppercase',
      fontFamily: "'Jost',sans-serif", cursor: state.value ? 'pointer' : 'not-allowed', opacity: state.value ? 1 : 0.4,
    }}>
      Save
    </button>
  );

  const toggle = (state: PrefState, setState: (s: PrefState) => void, val: string) => {
    const arr = state.value ? state.value.split(',') : [];
    const next = arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
    setState({ ...state, value: next.join(','), dirty: true });
  };
  const isActive = (state: PrefState, val: string) => state.value.split(',').includes(val);

  return (
    <AccountLayout current="my-preferences" setPage={setPage}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--navy)', marginBottom: '0.4rem' }}>How do you like to stay?</h2>
        <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,42,0.5)', lineHeight: 1.7 }}>Everything here is optional. Share only what you would like Eldorado to remember.</p>
      </div>

      {/* ── Room ── */}
      <div style={card}>
        <div style={sectionTitle}>Room Preferences</div>
        <div style={sectionSub}>Where you feel most comfortable, before you open the door.</div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', display: 'block', marginBottom: '0.5rem' }}>Pillow Preference</label>
          <div style={chipRow}>
            {['Soft','Medium','Firm','Extra Pillows'].map(o => <Chip key={o} label={o} active={isActive(pillows, o)} onClick={() => toggle(pillows, setPillows, o)} />)}
          </div>
          <PersistToggle value={pillows.persistent} onChange={v => setPillows(p => ({ ...p, persistent: v }))} />
          <SaveBtn type="pillows" category="room" state={pillows} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', display: 'block', marginBottom: '0.5rem' }}>Preferred Room Temperature</label>
          <select style={selectStyle} value={temp.value} onChange={e => setTemp(p => ({ ...p, value: e.target.value }))}>
            <option value="">No preference</option>
            <option>Cool</option><option>Comfortable</option><option>Warm</option>
          </select>
          <PersistToggle value={temp.persistent} onChange={v => setTemp(p => ({ ...p, persistent: v }))} />
          <SaveBtn type="roomTemp" category="room" state={temp} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', display: 'block', marginBottom: '0.5rem' }}>Room Location</label>
          <div style={chipRow}>
            {['Quiet Area','Higher Floor','Lower Floor','Corner Room','Away from Elevator','No Preference'].map(o => <Chip key={o} label={o} active={isActive(roomLoc, o)} onClick={() => toggle(roomLoc, setRoomLoc, o)} />)}
          </div>
          <PersistToggle value={roomLoc.persistent} onChange={v => setRoomLoc(p => ({ ...p, persistent: v }))} />
          <SaveBtn type="roomLocation" category="room" state={roomLoc} />
        </div>

        <div>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', display: 'block', marginBottom: '0.5rem' }}>Sleep Preferences</label>
          <div style={chipRow}>
            {['Blackout Curtains','Minimal Housekeeping','Extra Blanket','Night Turndown'].map(o => <Chip key={o} label={o} active={isActive(sleep, o)} onClick={() => toggle(sleep, setSleep, o)} />)}
          </div>
          <PersistToggle value={sleep.persistent} onChange={v => setSleep(p => ({ ...p, persistent: v }))} />
          <SaveBtn type="sleepPref" category="room" state={sleep} />
        </div>
      </div>

      {/* ── Food & Drink ── */}
      <div style={card}>
        <div style={sectionTitle}>Food & Drink</div>
        <div style={sectionSub}>What you enjoy, so it is ready when you arrive.</div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', display: 'block', marginBottom: '0.5rem' }}>Morning Preference</label>
          <div style={chipRow}>
            {['Coffee','Tea','Fresh Juice','Water','No Preference'].map(o => <Chip key={o} label={o} active={isActive(morning, o)} onClick={() => toggle(morning, setMorning, o)} />)}
          </div>
          <PersistToggle value={morning.persistent} onChange={v => setMorning(p => ({ ...p, persistent: v }))} />
          <SaveBtn type="morningDrink" category="food" state={morning} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', display: 'block', marginBottom: '0.5rem' }}>Dietary Preferences</label>
          <div style={chipRow}>
            {['Vegetarian','Vegan','Halal','Gluten-Free','Dairy-Free','Nut-Free'].map(o => <Chip key={o} label={o} active={isActive(dietary, o)} onClick={() => toggle(dietary, setDietary, o)} />)}
          </div>
          <PersistToggle value={dietary.persistent} onChange={v => setDietary(p => ({ ...p, persistent: v }))} />
          <SaveBtn type="dietary" category="food" state={dietary} />
        </div>

        <div>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.45)', display: 'block', marginBottom: '0.5rem' }}>Alcohol Preference</label>
          <select style={selectStyle} value={alcohol.value} onChange={e => setAlcohol(p => ({ ...p, value: e.target.value }))}>
            <option value="">No preference</option>
            <option>I enjoy wine</option><option>I enjoy champagne</option><option>I enjoy spirits</option><option>Non-alcoholic only</option>
          </select>
          <PersistToggle value={alcohol.persistent} onChange={v => setAlcohol(p => ({ ...p, persistent: v }))} />
          <SaveBtn type="alcohol" category="food" state={alcohol} />
        </div>
      </div>

      {/* ── Arrival ── */}
      <div style={card}>
        <div style={sectionTitle}>Arrival Preferences</div>
        <div style={sectionSub}>How you like to arrive, so we can prepare accordingly.</div>
        <select style={selectStyle} value={transport.value} onChange={e => setTransport(p => ({ ...p, value: e.target.value }))}>
          <option value="">Select one…</option>
          <option>Airport pickup preferred</option>
          <option>Private driver preferred</option>
          <option>I usually arrange my own transportation</option>
          <option>Early check-in preferred</option>
          <option>Late arrival common</option>
        </select>
        <PersistToggle value={transport.persistent} onChange={v => setTransport(p => ({ ...p, persistent: v }))} />
        <SaveBtn type="transport" category="arrival" state={transport} />
      </div>

      {/* ── Travel Style ── */}
      <div style={card}>
        <div style={sectionTitle}>Travel Style</div>
        <div style={sectionSub}>What usually brings you to Eldorado? This helps us personalise recommendations.</div>
        <div style={chipRow}>
          {['Leisure','Business','Family','Events','Romance','Wedding','Celebration','Wellness','Just Because'].map(o => <Chip key={o} label={o} active={isActive(travelStyle, o)} onClick={() => toggle(travelStyle, setTravelStyle, o)} />)}
        </div>
        <PersistToggle value={travelStyle.persistent} onChange={v => setTravelStyle(p => ({ ...p, persistent: v }))} />
        <SaveBtn type="travelStyle" category="travelStyle" state={travelStyle} />
      </div>

      {/* ── Communication Style ── */}
      <div style={card}>
        <div style={sectionTitle}>During Your Stay</div>
        <div style={sectionSub}>How would you prefer us to reach you during a stay?</div>
        <div style={chipRow}>
          {['WhatsApp','SMS','Email','Phone Call','App Messaging'].map(o => <Chip key={o} label={o} active={isActive(commStyle, o)} onClick={() => toggle(commStyle, setCommStyle, o)} />)}
        </div>
        <PersistToggle value={commStyle.persistent} onChange={v => setCommStyle(p => ({ ...p, persistent: v }))} />
        <SaveBtn type="commStyle" category="communication" state={commStyle} />
      </div>
    </AccountLayout>
  );
}
