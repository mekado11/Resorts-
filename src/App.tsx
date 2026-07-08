import { useState, useEffect } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Dining from './pages/Dining';
import Experiences from './pages/Experiences';
import Membership from './pages/Membership';
import Contact from './pages/Contact';
import Journey from './pages/Journey';
import SubscribePopup from './components/SubscribePopup';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function EldoradoApp() {
  const [page, setPage] = useState('home');
  const [toast, setToast] = useState<string|null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Show popup once per session after 8 seconds
  useEffect(() => {
    const seen = sessionStorage.getItem('eldorado_subscribed');
    if (seen) return;
    const t = setTimeout(() => setShowPopup(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem('eldorado_subscribed', '1');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  const setPage_ = (p: string) => { setPage(p); window.scrollTo(0,0); };

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Nav currentPage={page} setPage={setPage_} />
      
      {/* Spacer for fixed nav + ribbon */}
      <div style={{ height: page === 'home' ? 0 : 116 }} />

      <main style={{ flex: 1 }}>
        {page === 'home'        && <Home setPage={setPage_} />}
        {page === 'rooms'       && <Rooms onToast={showToast} />}
        {page === 'dining'      && <Dining />}
        {page === 'experiences' && <Experiences />}
        {page === 'membership'  && <Membership onToast={showToast} />}
        {page === 'contact'     && <Contact onToast={showToast} />}
        {page === 'journey'     && <Journey />}
      </main>

      <Footer setPage={setPage_} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {showPopup && <SubscribePopup onClose={closePopup} />}
    </div>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <EldoradoApp />
    </ConvexProvider>
  );
}
