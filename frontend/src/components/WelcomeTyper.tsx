import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../i18n/config';

/**
 * The welcome, written out letter by letter in all three languages in turn,
 * whichever language the visitor is reading the site in. Guests at the opening
 * see their own greeting come up within a few seconds.
 *
 * Each greeting is cut into pieces so the name of the place can carry its own
 * colour while the rest of the sentence stays gold.
 */
type Piece = { text: string; name?: boolean };

const GREETINGS: { lang: Lang; pieces: Piece[] }[] = [
  { lang: 'en', pieces: [{ text: 'Welcome to ' }, { text: 'Bushaashe Garuwa', name: true }] },
  { lang: 'am', pieces: [{ text: 'እንኳን ወደ ' }, { text: 'ቡሻሼ ጋሯ', name: true }, { text: ' በደህና መጡ' }] },
  { lang: 'wal', pieces: [{ text: 'Hashshu ' }, { text: 'Saro Yeeta!', name: true }] },
];

const TYPE_MS = 65;
const ERASE_MS = 30;
const HOLD_MS = 1900;

const fullText = (pieces: Piece[]) => pieces.map((p) => p.text).join('');

/** The pieces cut down to the letters typed so far */
function visiblePieces(pieces: Piece[], count: number): Piece[] {
  let left = count;
  const out: Piece[] = [];
  for (const piece of pieces) {
    if (left <= 0) break;
    out.push({ ...piece, text: piece.text.slice(0, left) });
    left -= piece.text.length;
  }
  return out;
}

export default function WelcomeTyper({ className = '', nameClassName = 'text-white' }: { className?: string; nameClassName?: string }) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [erasing, setErasing] = useState(false);
  const [still, setStill] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (still) return;
    const length = fullText(GREETINGS[index]!.pieces).length;

    if (!erasing && count === length) {
      timer.current = window.setTimeout(() => setErasing(true), HOLD_MS);
    } else if (erasing && count === 0) {
      setErasing(false);
      setIndex((i) => (i + 1) % GREETINGS.length);
    } else {
      timer.current = window.setTimeout(() => setCount((c) => c + (erasing ? -1 : 1)), erasing ? ERASE_MS : TYPE_MS);
    }
    return () => clearTimeout(timer.current);
  }, [count, erasing, index, still]);

  const greeting = GREETINGS[index]!;
  // Screen readers and search engines get all three greetings as plain text,
  // not the half-typed line.
  const spoken = GREETINGS.map((g) => fullText(g.pieces)).join(' · ');

  const render = (pieces: Piece[]) =>
    pieces.map((piece, i) => (
      <span key={i} className={piece.name ? nameClassName : undefined}>
        {piece.text}
      </span>
    ));

  if (still) {
    return (
      <p className={className} lang={GREETINGS[0]!.lang}>
        {render(GREETINGS[0]!.pieces)}
      </p>
    );
  }

  return (
    <p className={className}>
      <span className="sr-only">{spoken}</span>
      <span aria-hidden="true" lang={greeting.lang} className="inline">
        {render(visiblePieces(greeting.pieces, count))}
        <span className="inline-block w-[2px] h-[0.95em] translate-y-[0.1em] ml-1 bg-[#E7C074] animate-caret" />
      </span>
    </p>
  );
}
