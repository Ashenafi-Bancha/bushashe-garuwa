import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Heritage from './pages/Heritage';
import Experiences from './pages/Experiences';
import Events from './pages/Events';
import Stay from './pages/Stay';
import Dine from './pages/Dine';
import Library from './pages/Library';
import Visit from './pages/Visit';
import Contact from './pages/Contact';
import About from './pages/About';
import { I18nProvider, useI18n } from './i18n/I18nProvider';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function NotFound() {
  const { t } = useI18n();
  return (
    <main className="pt-20 min-h-screen bg-[#F7F5F0] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="font-display text-8xl text-[#173F35]/20 mb-6">404</div>
        <h1 className="font-display text-3xl font-semibold text-[#173F35] mb-4">{t.notFound.title}</h1>
        <p className="text-[#1D211E]/55 font-sans text-sm mb-8">{t.notFound.text}</p>
        <a href="/" className="inline-flex items-center gap-2 bg-[#173F35] text-white text-sm font-sans font-semibold rounded-full px-8 py-4 transition-colors hover:bg-[#1e5447]">
          {t.notFound.button}
        </a>
      </div>
    </main>
  );
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/heritage" element={<Heritage />} />
        <Route path="/heritage/*" element={<Heritage />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experiences/*" element={<Experiences />} />
        <Route path="/events" element={<Events />} />
        <Route path="/stay" element={<Stay />} />
        <Route path="/dine" element={<Dine />} />
        <Route path="/library" element={<Library />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </I18nProvider>
  );
}
