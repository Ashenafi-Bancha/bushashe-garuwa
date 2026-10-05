import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Heritage from './pages/Heritage';
import Experiences from './pages/Experiences';
import Events from './pages/Events';
import Stay from './pages/Stay';
import Vip from './pages/Vip';
import Dine from './pages/Dine';
import Visit from './pages/Visit';
import Contact from './pages/Contact';
import About from './pages/About';
import Gallery from './pages/Gallery';
import { I18nProvider, useI18n } from './i18n/I18nProvider';
import PageTransition from './components/PageTransition';
import { startSmoothScroll } from './lib/motion';

/** Staff area: loaded only when someone opens /admin, so visitors never download it */
const AdminApp = lazy(() => import('./admin/AdminApp'));
/** Pages under review, not linked from the site */
const Preview = lazy(() => import('./pages/Preview'));


function NotFound() {
  const { t } = useI18n();
  return (
    <main className="pt-20 min-h-screen bg-[#F4EFE4] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="font-display text-8xl text-[#1E3A29]/20 mb-6">404</div>
        <h1 className="font-display text-3xl font-semibold text-[#1E3A29] mb-4">{t.notFound.title}</h1>
        <p className="text-[#1E3A29]/55 font-sans text-sm mb-8">{t.notFound.text}</p>
        <a href="/" className="btn-primary">
          {t.notFound.button}
        </a>
      </div>
    </main>
  );
}

function AppLayout() {
  useEffect(() => startSmoothScroll(), []);

  return (
    <div className="min-h-screen bg-[#F4EFE4]">
      {/* a thin line across the top: how far down the page you are */}
      <div id="scroll-progress" aria-hidden="true" className="fixed top-0 inset-x-0 z-[60] h-[3px] origin-left scale-x-0 bg-[#0E8A50]" />
      <Navbar />
      <PageTransition>
        {(location) => (
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        {/* not linked from anywhere: the home page with the 3D landscape opening, to be judged before it goes public */}
        <Route path="/preview/hero" element={<Home landscape />} />
        {(['index', 'heritage', 'map'] as const).map((view) => (
          <Route
            key={view}
            path={view === 'index' ? '/preview' : `/preview/${view}`}
            element={
              <Suspense fallback={<main className="min-h-screen" />}>
                <Preview view={view} />
              </Suspense>
            }
          />
        ))}
        <Route path="/discover" element={<Discover />} />
        <Route path="/heritage" element={<Heritage />} />
        <Route path="/heritage/*" element={<Heritage />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experiences/*" element={<Experiences />} />
        <Route path="/events" element={<Events />} />
        <Route path="/stay" element={<Stay />} />
        <Route path="/vip" element={<Vip />} />
        <Route path="/dine" element={<Dine />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
        )}
      </PageTransition>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#F4EFE4]" />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route path="*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
