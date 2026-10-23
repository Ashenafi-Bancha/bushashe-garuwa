import { firstName, useAdminSession } from '../auth/AdminSession';
import { Icon } from '../components/icons';
import PasswordForm from '../components/PasswordForm';

/**
 * The first sign-in with a temporary password from an owner: the person
 * chooses their own password before anything else opens.
 */
export default function FirstPassword() {
  const { user, signOut } = useAdminSession();
  return (
    <div className="min-h-[100svh] bg-[#F4EFE4] flex flex-col">
      <div
        className="relative bg-[linear-gradient(140deg,#3F7D20_0%,#24501A_100%)] text-white px-6 pb-14 pt-12 overflow-hidden"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 48px)' }}
      >
        <span aria-hidden="true" className="absolute inset-0 opacity-[0.1] bg-[repeating-linear-gradient(135deg,#fff_0_2px,transparent_2px_14px)]" />
        <div className="relative max-w-md mx-auto admin-rise">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-white/15 mb-5">
            <Icon name="key" className="w-7 h-7" />
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
            Welcome{firstName(user) ? `, ${firstName(user)}` : ''}!
          </h1>
          <p className="text-white/80 mt-2 leading-relaxed">You signed in with a temporary password. Choose your own now: only you will know it.</p>
        </div>
      </div>
      <main className="relative -mt-7 flex-1 rounded-t-[30px] bg-white">
        <div className="max-w-md mx-auto px-6 pt-8 pb-10 admin-rise [animation-delay:100ms]">
          <PasswordForm currentLabel="Temporary password (from your email or message)" />
          <button type="button" onClick={signOut} className="w-full mt-4 py-3 text-[13px] font-semibold text-[#1E3A29]/55 hover:text-[#1E3A29]">
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
