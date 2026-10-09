import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';

/**
 * "Back", with an arrow, at the bottom corner of every page but the home page.
 * It stays in place all the way down, the footer included, and returns to the
 * page before; someone who arrived straight on this page goes to the home page.
 */
export default function BackButton() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (pathname === '/' || pathname === '/preview/hero') return null;

  const goBack = () => {
    // the router counts the pages opened here: none before this one means nowhere to go back to
    const opened = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (opened > 0) navigate(-1);
    else navigate('/');
  };

  return (
    <button type="button" onClick={goBack} className="back-button">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="m11 6-6 6 6 6" />
      </svg>
      {t.common.back}
    </button>
  );
}
