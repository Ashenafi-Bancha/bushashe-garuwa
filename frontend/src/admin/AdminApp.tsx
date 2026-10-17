import { useEffect } from 'react';
import { AdminSessionProvider, useAdminSession } from './auth/AdminSession';
import Dashboard from './views/Dashboard';
import SignIn from './views/SignIn';
import { useStaffApp } from './pwa';

function AdminScreen() {
  const { signedIn } = useAdminSession();
  // the staff app's icon, colour and service worker, from the sign-in page on
  useStaffApp();
  useEffect(() => {
    document.title = 'Staff area | Bushaashe Garuwa';
  }, []);
  return signedIn ? <Dashboard /> : <SignIn />;
}

/** Everything under /admin: the staff sign-in and dashboard, without the public site's header and footer. */
export default function AdminApp() {
  return (
    <AdminSessionProvider>
      <AdminScreen />
    </AdminSessionProvider>
  );
}
