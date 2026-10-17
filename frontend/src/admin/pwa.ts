import { useEffect, useState } from 'react';

/**
 * The staff area as an app staff can install on their phone or computer: its own
 * manifest, icon and colour, a service worker for /admin only (public/admin-sw.js),
 * the install button when the browser offers one, and whether there is a connection.
 */

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

/** Points a <link> or <meta> in the head at a new value, making it if it is not there */
function setHead(selector: string, make: () => HTMLElement, attr: string, value: string) {
  let tag = document.head.querySelector<HTMLElement>(selector);
  if (!tag) {
    tag = make();
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, value);
}

const link = (rel: string) => () => Object.assign(document.createElement('link'), { rel });
const meta = (name: string) => () => Object.assign(document.createElement('meta'), { name });

/** Is the staff area running as the installed app? */
const runningInstalled = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** iPhones and iPads install from Safari's Share menu instead of a button */
const isAppleMobile = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function useStaffApp() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(runningInstalled);
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    // the staff app's own identity, in place of the public website's
    setHead('link[rel="manifest"]', link('manifest'), 'href', '/admin.webmanifest');
    setHead('meta[name="theme-color"]', meta('theme-color'), 'content', '#3F7D20');
    setHead('link[rel="apple-touch-icon"]', link('apple-touch-icon'), 'href', '/staff/apple-touch-icon.png');
    setHead('meta[name="apple-mobile-web-app-capable"]', meta('apple-mobile-web-app-capable'), 'content', 'yes');
    setHead('meta[name="mobile-web-app-capable"]', meta('mobile-web-app-capable'), 'content', 'yes');
    setHead('meta[name="apple-mobile-web-app-title"]', meta('apple-mobile-web-app-title'), 'content', 'BG Staff');
    setHead('meta[name="apple-mobile-web-app-status-bar-style"]', meta('apple-mobile-web-app-status-bar-style'), 'content', 'default');

    // only in the built site: while developing, a service worker would keep old code around
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => {
        // the staff area works the same without it
      });
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
    };
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setPrompt(null);
  };

  return {
    online,
    installed,
    /** the browser offers a one-tap install */
    canInstall: !installed && prompt !== null,
    /** on iPhone and iPad: explain the Share menu instead */
    appleHint: !installed && prompt === null && isAppleMobile(),
    install,
  };
}

export type StaffApp = ReturnType<typeof useStaffApp>;
