import { useState, useEffect } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { AuthProvider } from './context/AuthContext';
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
import Capital from './pages/Capital';
import SubscribePopup from './components/SubscribePopup';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import MyEldorado from './pages/account/MyEldorado';
import MyStays from './pages/account/MyStays';
import MyPreferences from './pages/account/MyPreferences';
import MySavedExperiences from './pages/account/MySavedExperiences';
import MyProfile from './pages/account/MyProfile';
import MyCommunications from './pages/account/MyCommunications';
import MySecurity from './pages/account/MySecurity';
import StaffView from './pages/StaffView';
import EldoradoCares from './pages/EldoradoCares';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

// Pages that live inside the account section
const ACCOUNT_PAGES = ['my-eldorado','my-stays','my-preferences','my-experiences','my-profile','my-communications','my-security'];
const AUTH_PAGES = ['signin','signup','forgot-password'];
const NO_FOOTER_PAGES = ['staff'];
const NO_NAV_SPACER = ['home',...AUTH_PAGES,'staff'];

function EldoradoApp() {
  // The staff portal has no public link; staff reach it via /?page=staff
  // (still PIN-gated on arrival). Only 'staff' is honoured from the URL.
  const [page, setPage] = useState(() =>
    new URLSearchParams(window.location.search).get('page') === 'staff' ? 'staff' : 'home'
  );
  const [toast, setToast] = useState<string|null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Popup on every home page load after 8s
  useEffect(() => {
    if (page !== 'home') return;
    const t = setTimeout(() => setShowPopup(true), 8000);
    return () => clearTimeout(t);
  }, [page]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  const setPage_ = (p: string) => { setPage(p); window.scrollTo(0,0); };

  const isAccountPage = ACCOUNT_PAGES.includes(page);
  const isAuthPage = AUTH_PAGES.includes(page);
  const showFooter = !NO_FOOTER_PAGES.includes(page) && !isAuthPage;
  const showNavSpacer = !NO_NAV_SPACER.includes(page) && !isAccountPage;

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background: isAccountPage ? '#F7F6F2' : undefined }}>
      {page !== 'staff' && <Nav currentPage={page} setPage={setPage_} />}

      {/* Spacer for fixed nav + ribbon — only on content pages */}
      {showNavSpacer && <div style={{ height: 140 }} />}
      {isAccountPage && <div style={{ height: 104 }} />}

      <main style={{ flex: 1 }}>
        {/* Public pages */}
        {page === 'home'          && <Home setPage={setPage_} />}
        {page === 'rooms'         && <Rooms onToast={showToast} />}
        {page === 'dining'        && <Dining onToast={showToast} />}
        {page === 'experiences'   && <Experiences setPage={setPage_} />}
        {page === 'membership'    && <Membership onToast={showToast} />}
        {page === 'contact'       && <Contact onToast={showToast} />}
        {page === 'journey'       && <Journey />}
        {page === 'capital'       && <Capital />}

        {/* Auth pages */}
        {page === 'signin'        && <SignIn setPage={setPage_} onToast={showToast} />}
        {page === 'signup'        && <SignUp setPage={setPage_} onToast={showToast} />}
        {page === 'forgot-password' && <ForgotPassword setPage={setPage_} onToast={showToast} />}

        {/* Account pages */}
        {page === 'my-eldorado'      && <MyEldorado setPage={setPage_} />}
        {page === 'my-stays'         && <MyStays setPage={setPage_} />}
        {page === 'my-preferences'   && <MyPreferences setPage={setPage_} onToast={showToast} />}
        {page === 'my-experiences'   && <MySavedExperiences setPage={setPage_} />}
        {page === 'my-profile'       && <MyProfile setPage={setPage_} onToast={showToast} />}
        {page === 'my-communications'&& <MyCommunications setPage={setPage_} onToast={showToast} />}
        {page === 'my-security'      && <MySecurity setPage={setPage_} onToast={showToast} />}

        {/* Staff view */}
        {page === 'staff'         && <StaffView />}
        {page === 'eldorado-cares' && <EldoradoCares setPage={setPage_} />}
      </main>

      {showFooter && <Footer setPage={setPage_} />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {showPopup && page === 'home' && <SubscribePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <EldoradoApp />
      </AuthProvider>
    </ConvexProvider>
  );
}
