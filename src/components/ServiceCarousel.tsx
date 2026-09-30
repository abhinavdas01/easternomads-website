import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Arrow } from './Primitives';
import { offerings } from '../catalog';
import './service-carousel.css';

/* Position of each ring slot relative to the centre card: 0 is the centre, ±1 its neighbours, and so on.
   Cards stack vertically; every card stays opaque and at full brightness, side cards only shrink and tilt. */
const SLOTS = [
  { y: 0, scale: 1, rotateX: 0 },
  { y: 15, scale: .9, rotateX: 8 },
  { y: 26, scale: .8, rotateX: 14 },
  { y: 34, scale: .7, rotateX: 18 },
];
/* Wheel input needed for one step, and the pause after a step so one trackpad flick turns one card. */
const WHEEL_STEP = 40;
const WHEEL_COOLDOWN = 420;

const pad = (value: number) => String(value).padStart(2, '0');

/* Signed distance from the active card, wrapped so every card sits within ±half the ring. */
function offsetOf(index: number, active: number, count: number) {
  let offset = (index - active) % count;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  return offset;
}

/* Vertical ring of service cards. Scrolling over the cards turns the ring (the page does not scroll);
   clicking a peeking card or pressing ↑/↓ also turns it. */
export default function ServiceCarousel({ onContact }: { onContact: (interest: string) => void }) {
  const count = offerings.length;
  const reduced = useReducedMotion();
  // `from` is the previous centre, used to spot cards that wrap around the ring.
  const [{ active, from }, setRing] = useState({ active: 0, from: 0 });
  const setActive = (index: number) => setRing(ring => ring.active === index ? ring : { active: index, from: ring.active });
  const go = (step: number) => setRing(ring => ({ active: (ring.active + step + count) % count, from: ring.active }));

  const stage = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  // Wheel over the cards turns the ring instead of scrolling the page.
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let pending = 0;
    let lockedUntil = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = performance.now();
      if (now < lockedUntil) return;
      pending += event.deltaY;
      if (Math.abs(pending) < WHEEL_STEP) return;
      const step = pending > 0 ? 1 : -1;
      pending = 0;
      lockedUntil = now + WHEEL_COOLDOWN;
      setRing(ring => ({ active: (ring.active + step + count) % count, from: ring.active }));
    };
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [count]);

  // The Services menu links to #service-<id>: bring that card to the centre.
  useEffect(() => {
    const sync = () => {
      const index = offerings.findIndex(item => `#service-${item.id}` === window.location.hash);
      if (index >= 0) setRing(ring => ({ active: index, from: ring.active }));
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  return <div className="service-carousel" role="region" aria-roledescription="carousel" aria-label="Our services. Use the up and down arrow keys to browse." tabIndex={0}
    onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); go(1); } if (event.key === 'ArrowUp') { event.preventDefault(); go(-1); } }}>
    <p className="service-carousel__hint" aria-hidden="true">Swipe up or down, or tap a card</p>
    <div ref={stage} className="service-carousel__stage" onTouchStart={event => { touchStart.current = event.touches[0].clientY; }}
      onTouchEnd={event => { const start = touchStart.current; touchStart.current = null; if (start === null) return; const delta = start - event.changedTouches[0].clientY; if (Math.abs(delta) > 40) go(delta > 0 ? 1 : -1); }}>
      {offerings.map(({ id, title, icon: Icon, summary, points }, index) => {
        const offset = offsetOf(index, active, count);
        const slot = SLOTS[Math.min(Math.abs(offset), SLOTS.length - 1)];
        const side = Math.sign(offset);
        const centre = offset === 0;
        // A card that wraps from one end of the ring to the other jumps instead of sweeping across the stack.
        const wrapped = Math.abs(offset - offsetOf(index, from, count)) > count / 2;
        return <motion.article key={id} id={`service-${id}`}
          className={`service-card${centre ? ' is-active' : ''}`}
          aria-hidden={!centre || undefined}
          aria-roledescription="slide" aria-label={`${pad(index + 1)} of ${pad(count)}: ${title}`}
          initial={false}
          animate={{ y: `${side * slot.y}%`, scale: slot.scale, rotateX: -side * slot.rotateX, zIndex: 10 - Math.abs(offset) }}
          transition={reduced || wrapped ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 }}
          onClick={() => { if (!centre) setActive(index); }}>
          <div className="service-card__top"><span className="catalog-icon"><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></span><span className="micro-label">{pad(index + 1)}</span></div>
          <h3>{title}</h3>
          <p>{summary}</p>
          <ul>{points.map(point => <li key={point}>{point}</li>)}</ul>
          <button type="button" className="text-link" tabIndex={centre ? 0 : -1} onClick={() => onContact(`service:${id}`)}>Discuss this <Arrow diagonal /></button>
        </motion.article>;
      })}
    </div>
    <p className="sr-only" aria-live="polite">{`${offerings[active].title}, ${pad(active + 1)} of ${pad(count)}`}</p>
  </div>;
}
