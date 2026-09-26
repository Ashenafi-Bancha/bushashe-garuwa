import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../i18n/config';

/**
 * The welcome, written out letter by letter in all three languages in turn,
 * whichever language the visitor is reading the site in. Guests at the opening
 * see their own greeting come up within a few seconds.
 */
const GREETINGS: { lang: Lang; text: string }[] = [
  { lang: 'en', text: 'Welcome to Bushaashe Garuwa' },
  { lang: 'am', text: 'እንኳን ወደ ቡሻሼ ጋሯ በደህና መጡ' },
  { lang: 'wal', text: 'Hashshu Saro Yeeta!' },
];

const TYPE_MS = 65;
const ERASE_MS = 30;
const HOLD_MS = 1900;

export default function WelcomeTyper({ className = '' }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState('');
  const [erasing, setErasing] = useState(false);
  const [still, setStill] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (still) return;
    const full = GREETINGS[index]!.text;

    if (!erasing && shown === full) {
      timer.current = window.setTimeout(() => setErasing(true), HOLD_MS);
    } else if (erasing && shown === '') {
      setErasing(false);
      setIndex((i) => (i + 1) % GREETINGS.length);
    } else {
      timer.current = window.setTimeout(
        () => setShown(erasing ? full.slice(0, shown.length - 1) : full.slice(0, shown.length + 1)),
        erasing ? ERASE_MS : TYPE_MS,
      );
    }
    return () => clearTimeout(timer.current);
  }, [shown, erasing, index, still]);

  // Screen readers and search engines get all three greetings as plain text,
  // not the half-typed line.
  const spoken = GREETINGS.map((g) => g.text).join(' · ');

  if (still) {
    return (
      <p className={className} lang={GREETINGS[0]!.lang}>
        {GREETINGS[0]!.text}
      </p>
    );
  }

  return (
    <p className={className}>
      <span className="sr-only">{spoken}</span>
      <span aria-hidden="true" lang={GREETINGS[index]!.lang} className="inline-block">
        {shown}
        <span className="inline-block w-[2px] h-[1em] translate-y-[0.12em] ml-1 bg-[#E7C074] animate-caret" />
      </span>
    </p>
  );
}
