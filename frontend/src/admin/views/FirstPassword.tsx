import { firstName, useAdminSession } from '../auth/AdminSession';
import { Icon } from '../components/icons';
import PasswordForm from '../components/PasswordForm';
import { SignInFrame } from './SignIn';

/**
 * The first sign-in with a temporary password from an owner: the person
 * chooses their own password before anything else opens.
 */
export default function FirstPassword() {
  const { user, signOut } = useAdminSession();
  const name = firstName(user);
  return (
    <SignInFrame>
      <div className="admin-card !p-6 sm:!p-8 shadow-[0_1px_2px_rgba(19,38,26,0.04),0_20px_40px_-30px_rgba(19,38,26,0.35)]">
        <span className="grid place-items-center w-11 h-11 rounded-xl bg-[var(--a-brand-soft)] text-[var(--a-brand)] mb-4">
          <Icon name="key" className="w-5 h-5" />
        </span>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[var(--a-ink)]">Welcome{name ? `, ${name}` : ''}</h1>
        <p className="text-[14px] text-[var(--a-muted)] mt-1 mb-6">You signed in with a temporary password. Choose your own now: only you will know it.</p>
        <PasswordForm currentLabel="Temporary password" />
      </div>
      <button type="button" onClick={signOut} className="w-full mt-4 py-2 text-[13px] font-semibold text-[var(--a-muted)] hover:text-[var(--a-ink)]">
        Sign out
      </button>
    </SignInFrame>
  );
}
