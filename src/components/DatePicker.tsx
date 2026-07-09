import { useState, useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';

interface DatePickerProps {
  value: string;                    // ISO yyyy-mm-dd, '' = none selected
  onChange: (isoDate: string) => void;
  minDate?: string;                 // ISO date string
  placeholder?: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.85rem',
  border: '1px solid rgba(13,27,42,0.18)',
  borderRadius: 3,
  fontSize: '0.85rem',
  fontFamily: "'Jost', sans-serif",
  color: 'var(--navy)',
  background: '#fff',
  boxSizing: 'border-box',
  textAlign: 'left',
  cursor: 'pointer',
};

function parseISO(iso: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplay(iso: string): string {
  const date = parseISO(iso);
  if (!date) return '';
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function DatePicker({ value, onChange, minDate, placeholder = 'Select a date' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const selected = parseISO(value);
  const minDateObj = minDate ? parseISO(minDate) : undefined;

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ ...inputStyle, color: value ? 'var(--navy)' : 'rgba(13,27,42,0.4)' }}
      >
        {value ? formatDisplay(value) : placeholder}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          left: 0,
          zIndex: 600,
          background: 'var(--ivory)',
          border: '1px solid rgba(13,27,42,0.12)',
          borderRadius: 4,
          boxShadow: '0 12px 32px rgba(13,27,42,0.18)',
          padding: '0.75rem',
        }}>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(toISO(date));
                setOpen(false);
              }
            }}
            disabled={minDateObj ? { before: minDateObj } : undefined}
            defaultMonth={selected ?? minDateObj}
          />
        </div>
      )}
    </div>
  );
}
