import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { scrollToHash } from '../lib/motion';

/**
 * Phones only: one small "Book Your Stay" button that stays within reach at the
 * bottom corner. It appears once the opening of the page has been scrolled past
 * and steps aside when the request form or the footer is on screen.
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
    document.querySelectorAll('#book, footer').forEach((el) => watcher.observe(el));
    return () => {
      window.removeEventListener('scroll', onScroll);
      watcher.disconnect();
    };
  }, []);

  const shown = past && !aside;
  return (
    <Link
      to="/stay#book"
      onClick={() => scrollToHash('#book')}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={`sticky-book ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      {t.stay.cta.book}
    </Link>
  );
}
