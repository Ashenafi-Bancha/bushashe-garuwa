import { useEffect, useRef, useState } from 'react';

/**
 * A heading that types itself, letter by letter, when it comes into view,
 * with a blinking cursor after it. Screen readers get the whole text at once;
 * visitors who asked for less motion see it whole straight away.
 */
export default function TypeHeading({ text, id, className = '' }: { text: string; id?: string; className?: string }) {
  const el = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(text.length);
      return;
    }
    const node = el.current;
    if (!node) return;
    const seen = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setStarted(true);
        seen.disconnect();
      }
    }, { threshold: 0.6 });
    seen.observe(node);
    return () => seen.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started) return;
    setShown(0);
    let n = 0;
    const timer = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= text.length) clearInterval(timer);
    }, 85);
    return () => clearInterval(timer);
  }, [started, text]);

  return (
    <h2 ref={el} id={id} aria-label={text} className={`type-heading ${className}`}>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
      <span aria-hidden="true" className="type-caret" />
      {/* keeps the full width reserved, so nothing jumps while it types */}
      <span aria-hidden="true" className="type-ghost">{text.slice(shown)}</span>
    </h2>
  );
}
