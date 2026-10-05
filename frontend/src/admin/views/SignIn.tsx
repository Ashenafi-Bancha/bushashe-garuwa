import { useState } from 'react';
import logo from '../../assets/brand/logo.png';
import { photos, picture } from '../../assets/photos';
import { ApiError, apiEnabled } from '../../lib/api';
import { useAdminSession } from '../auth/AdminSession';
import { Icon } from '../components/icons';

const FIELD =
  'w-full rounded-2xl bg-white border px-4 py-4 text-base text-[#1E3A29] placeholder:text-[#1E3A29]/30 outline-none transition-colors';
const LABEL = 'text-[#1E3A29]/65 text-xs font-bold tracking-[0.14em] uppercase';

/**
 * Staff sign-in: email and password, checked by the API.
 * One centred card on every screen: the logo on top, the name, who the page is
 * for, then the form. A bar across the foot of the page, in its own colour,
 * leads back to the website.
 */
export default function SignIn() {
  const { signIn } = useAdminSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!email.trim() || !password) {
      setError('Enter your email and your password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      setError(
        status === 401 || status === 400
          ? 'That email or password is not correct.'
          : status === 429
            ? 'Too many tries. Please wait a few minutes and try again.'
            : (err as Error).message,
      );
    } finally {
      setBusy(false);
    }
  };

  const border = error ? 'border-[#C4622D]' : 'border-[#1E3A29]/15 focus:border-[#0E8A50]';

  return (
    <div className="min-h-[100svh] flex flex-col bg-[#F4EFE4]">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-md">
          {/* who this is: the logo, the name, and who the page is for */}
          <div className="text-center mb-7">
            {/* phones: the photograph of Meeshsho Keettaa, the traditional house, stands in for the logo */}
            <img
              {...picture(photos.meeshsho, '176px')}
              alt="Meeshsho Keettaa, the traditional Wolaita house at Bushaashe Garuwa"
              className="sm:hidden w-44 aspect-[3/2] mx-auto rounded-2xl object-cover border-4 border-white shadow-[0_14px_34px_-14px_rgba(19,38,26,0.5)]"
            />
            <img src={logo} alt="" className="hidden sm:block w-24 h-24 mx-auto rounded-full object-contain bg-white p-1 shadow-[0_10px_30px_-12px_rgba(19,38,26,0.45)]" />
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E3A29] tracking-tight mt-4">Bushaashe Garuwa</div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E3EBD8] text-[#0B6E40] text-[11px] font-bold tracking-[0.18em] uppercase px-3.5 py-1.5 mt-3">
              <Icon name="lock" className="w-3.5 h-3.5" />
              Staff area
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] border border-[#1E3A29]/8 shadow-[0_24px_60px_-30px_rgba(19,38,26,0.35)] px-5 py-7 sm:px-9 sm:py-9">
            <h1 className="font-display text-3xl font-extrabold text-[#1E3A29] text-center leading-tight">Sign in</h1>
            <p className="text-[#1E3A29]/60 text-sm leading-relaxed text-center mt-2 mb-7">
              For staff members of Bushaashe Garuwa only.
            </p>

            {!apiEnabled && (
              <p role="alert" className="rounded-2xl bg-[#C4622D]/12 text-[#8c4227] text-sm px-4 py-3 mb-5">
                The API address is not set (VITE_API_URL), so there is nothing to sign in to.
              </p>
            )}

            <form onSubmit={submit} noValidate className="space-y-4">
              <div>
                <label htmlFor="admin-email" className={`block mb-2 ${LABEL}`}>
                  Email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  required
                  autoFocus
                  autoComplete="username"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={error !== ''}
                  className={`${FIELD} ${border}`}
                  placeholder="you@bushaashegaruwa.com"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className={`block mb-2 ${LABEL}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    name="password"
                    type={show ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="go"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={error !== ''}
                    aria-describedby={error ? 'admin-signin-error' : undefined}
                    className={`${FIELD} ${border} pr-14`}
                  />
                  {/* the eye: show the password to check it, hide it again */}
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Hide the password' : 'Show the password'}
                    aria-pressed={show}
                    className="hit-slim absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-xl text-[#1E3A29]/55 hover:text-[#0B6E40] hover:bg-[#1E3A29]/5 transition-colors"
                  >
                    <Icon name={show ? 'eyeOff' : 'eye'} />
                  </button>
                </div>
                {error && (
                  <p id="admin-signin-error" role="alert" className="text-[#9A4A20] text-sm font-semibold mt-2">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy || !apiEnabled}
                className="w-full min-h-[52px] bg-[#0E8A50] hover:bg-[#0B7A45] active:scale-[0.99] text-white font-bold rounded-full transition-all disabled:opacity-60 disabled:active:scale-100"
              >
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>

          <p className="text-[#1E3A29]/50 text-xs leading-relaxed text-center mt-6 px-4">
            You stay signed in for up to 12 hours, or until you sign out. If you do not have an account, ask the site owner.
          </p>
        </div>
      </main>

      {/* the foot of the page, in its own colour */}
      <footer className="bg-[#1E3A29] text-white/70 text-xs sm:text-sm">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Bushaashe Garuwa · Staff area</span>
          <a href="/" className="font-semibold text-white hover:text-[#B9D38A] transition-colors">
            Back to the website
          </a>
        </div>
      </footer>
    </div>
  );
}
