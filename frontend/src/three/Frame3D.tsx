import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { deviceTier, type Tier } from './device';

type Props = {
  className?: string;
  /** Shown instead on devices that cannot draw 3D smoothly */
  fallback: ReactNode;
  /** The scene. `active` is false while it is off screen, so it can stop drawing. */
  children: (tier: Exclude<Tier, 'none'>, active: boolean) => ReactNode;
};

/**
 * The place on the page where one 3D scene is shown. The scene is fetched and
 * set up only when the visitor scrolls near it, and taken down again when they
 * move far away, so only one scene is ever at work.
 */
export default function Frame3D({ className = '', fallback, children }: Props) {
  const { t } = useI18n();
  const tier = useMemo(deviceTier, []);
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const nearby = new IntersectionObserver(([entry]) => setNear(entry?.isIntersecting ?? false), { rootMargin: '500px 0px' });
    const onScreen = new IntersectionObserver(([entry]) => setActive(entry?.isIntersecting ?? false));
    nearby.observe(el);
    onScreen.observe(el);
    return () => {
      nearby.disconnect();
      onScreen.disconnect();
    };
  }, []);

  if (tier === 'none') return <>{fallback}</>;

  const loading = <div className="absolute inset-0 grid place-items-center px-6 text-center text-[#1E3A29]/55 text-sm font-semibold">{t.immersive.loading}</div>;
  return (
    <div ref={box} className={`relative ${className}`}>
      {near ? <Suspense fallback={loading}>{children(tier, active)}</Suspense> : loading}
    </div>
  );
}
