import { initials } from '../auth/AdminSession';

/* warm colours from the site's palette, one picked per name so a person always has the same */
const TONES = [
  'bg-[#3F7D20] text-white',
  'bg-[#C4622D] text-white',
  'bg-[#1E3A29] text-white',
  'bg-[#E8B23A] text-[#3A2A05]',
  'bg-[#6F9443] text-white',
  'bg-[#8C4A2F] text-white',
];

const toneFor = (seed: string) => {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length]!;
};

/** The round picture of a person: their initials on a colour of their own */
export default function Avatar({ name, email = '', size = 'md', light = false }: { name: string; email?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; /** white, for a green background */ light?: boolean }) {
  const sizes = { sm: 'w-8 h-8 text-[11px]', md: 'w-10 h-10 text-[13px]', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  return (
    <span aria-hidden="true" className={`grid place-items-center rounded-full font-bold tracking-wide flex-shrink-0 ${sizes[size]} ${light ? 'bg-white text-[#2E5E17]' : toneFor(name || email)}`}>
      {initials(name, email)}
    </span>
  );
}

/** "just now", "5 min ago", "yesterday", "3 days ago", or the date */
export function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
