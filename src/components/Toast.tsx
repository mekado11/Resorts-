import { useEffect } from 'react';

interface ToastProps { message: string; onClose: () => void; }

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast" onClick={onClose}>
      <div style={{ fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.25rem' }}>Eldorado</div>
      {message}
    </div>
  );
}
