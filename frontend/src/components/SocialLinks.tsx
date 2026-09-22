/**
 * Social media links shown as each network's own logo in its brand colours.
 * A network with an empty `href` is hidden; fill in its address to show it.
 */
const SOCIAL = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/bushaashe.garuwa',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#1877F2" />
        <path
          fill="#fff"
          d="M16.67 15.47 17.2 12h-3.33V9.75c0-.95.47-1.87 1.96-1.87h1.51V4.93s-1.37-.23-2.68-.23c-2.74 0-4.53 1.66-4.53 4.66V12H7.08v3.47h3.05V24a12.1 12.1 0 0 0 3.74 0v-8.53h2.8Z"
        />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id="ig-brand" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#FDF497" />
            <stop offset="5%" stopColor="#FDF497" />
            <stop offset="45%" stopColor="#FD5949" />
            <stop offset="60%" stopColor="#D6249F" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-brand)" />
        <rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.6" />
        <circle cx="15.9" cy="8.1" r="0.95" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: '',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#010101" />
        <g transform="translate(5.2 4.4) scale(0.58)">
          <path fill="#25F4EE" transform="translate(-0.9 -0.6)" d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.9a2.7 2.7 0 1 1-2.7-2.7c.28 0 .55.04.8.12V10a5.9 5.9 0 1 0 5.1 5.9V9.4a7.4 7.4 0 0 0 4.3 1.37V7.57a4.3 4.3 0 0 1-3.24-1.75Z" />
          <path fill="#FE2C55" transform="translate(0.9 0.6)" d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.9a2.7 2.7 0 1 1-2.7-2.7c.28 0 .55.04.8.12V10a5.9 5.9 0 1 0 5.1 5.9V9.4a7.4 7.4 0 0 0 4.3 1.37V7.57a4.3 4.3 0 0 1-3.24-1.75Z" />
          <path fill="#fff" d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.9a2.7 2.7 0 1 1-2.7-2.7c.28 0 .55.04.8.12V10a5.9 5.9 0 1 0 5.1 5.9V9.4a7.4 7.4 0 0 0 4.3 1.37V7.57a4.3 4.3 0 0 1-3.24-1.75Z" />
        </g>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/results?search_query=bushaashe+garuwa',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#FF0000" />
        <path fill="#fff" d="M10 8.4v7.2l6-3.6-6-3.6Z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: '', // e.g. 'https://wa.me/2519XXXXXXXX'
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#25D366" />
        <path
          fill="#fff"
          d="M12 5.2a6.8 6.8 0 0 0-5.86 10.26L5.2 18.8l3.43-.9A6.8 6.8 0 1 0 12 5.2Zm0 12.4a5.6 5.6 0 0 1-2.86-.78l-.2-.12-2.03.53.54-1.98-.13-.2A5.6 5.6 0 1 1 12 17.6Zm3.07-4.2c-.17-.08-1-.49-1.15-.55-.16-.06-.27-.08-.38.08-.11.17-.44.55-.54.66-.1.11-.2.13-.37.04a4.6 4.6 0 0 1-2.29-2c-.17-.3.17-.28.5-.93.05-.11.03-.21-.02-.29l-.52-1.24c-.13-.33-.27-.28-.37-.29h-.32a.62.62 0 0 0-.45.21 1.9 1.9 0 0 0-.59 1.41 3.3 3.3 0 0 0 .69 1.75 7.5 7.5 0 0 0 2.89 2.55c1.07.46 1.49.5 2.03.42.33-.05 1-.41 1.15-.81.14-.4.14-.74.1-.81-.04-.07-.15-.11-.32-.19Z"
        />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: 'https://t.me/bushaashegaruwafrist',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#26A5E4" />
        <path
          fill="#fff"
          d="M5.43 11.87c3.5-1.52 5.83-2.53 7-3.02 3.33-1.39 4.02-1.63 4.47-1.64.1 0 .32.02.47.14.12.1.15.23.17.33.02.09.04.3.02.46-.18 1.9-.96 6.5-1.36 8.63-.17.9-.5 1.2-.82 1.23-.7.06-1.23-.46-1.9-.9-1.06-.7-1.66-1.13-2.69-1.8-1.19-.79-.42-1.22.26-1.93.18-.18 3.25-2.98 3.31-3.23.01-.03.01-.15-.06-.21-.07-.06-.17-.04-.25-.02-.1.02-1.79 1.14-5.06 3.35-.48.33-.91.49-1.3.48-.43-.01-1.26-.24-1.87-.44-.75-.25-1.35-.38-1.3-.8.03-.22.33-.44.91-.67Z"
        />
      </svg>
    ),
  },
];

export default function SocialLinks({ dark = true, small = false }: { dark?: boolean; small?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center ${small ? 'gap-2' : 'gap-3'}`}>
      {SOCIAL.filter((s) => s.href).map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          title={s.name}
          className={`block ${small ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl transition-all duration-300 hover:-translate-y-1 ${
            dark ? 'shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)]' : 'shadow-[0_6px_16px_-8px_rgba(15,26,22,0.35)]'
          } hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.45)]`}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}
