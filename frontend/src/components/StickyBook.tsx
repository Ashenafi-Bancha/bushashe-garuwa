import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';

/**
 * One small "Book Now" button that stays within reach at the bottom corner of
 * the home page, on phones and computers alike. It leads to the Plan Your Visit
 * page, where a visit is requested. It appears once the opening of the page has
 * been scrolled past and steps aside when the footer is on screen.
 */
export default function StickyBook() {
  const { t } = useI18n();
  const [past, setPast] = useState(false);
  const [aside, setAside] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // the form itself, or the foot of the page, is in view: the button is not needed
    const seen = new Set<Element>();
    const watcher = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? seen.add(entry.target) : seen.delete(entry.target)));
      setAside(seen.size > 0);
    });
    document.querySelectorAll('footer').forEach((el) => watcher.observe(el));
    return () => {
      window.removeEventListener('scroll', onScroll);
      watcher.disconnect();
    };
  }, []);

  const shown = past && !aside;
  return (
    <Link
      to="/visit"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={`sticky-book ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      {t.common.bookNow}
    </Link>
  );
}
