import type { ReactNode } from 'react';

/**
 * Wolaita words inside English and Amharic text: the names of the houses, the
 * festival, the grinding stone. The dictionaries write them in quotation marks
 * (“Meesho Keettaa”); `wol()` also sets them in italic, as words of another
 * language. In the Wolaytta version they are ordinary words, without either.
 */
const WORDS = ['Meesho Keettaa', 'Gulanttaa Keettaa', 'Gifaataa', 'wotta', 'ጉላንታ ኬታ', 'ጊፋታ', 'ዎጣ'];
const QUOTED = new RegExp(`(“(?:${WORDS.join('|')})”)`, 'g');

/** The text with each quoted Wolaita word in italic; anything that is not text passes through unchanged */
export function wol(text: ReactNode): ReactNode {
  if (typeof text !== 'string' || !text.includes('“')) return text;
  const parts = text.split(QUOTED);
  if (parts.length === 1) return text;
  return parts.map((part, i) => (i % 2 === 1 ? <em key={i} lang="wal" className="wol-word">{part}</em> : part));
}
