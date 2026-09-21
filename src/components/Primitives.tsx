import { useId, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Mark() {
  return <span className="brand-art brand-art--mark" aria-hidden="true"><img src="/mark.png" width="30" height="30" alt="" /></span>;
}
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduce ? {} : { y: [12, 0], opacity: [0.7, 1] }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}>{children}</motion.div>;
}
export function Tabs({ id, label, labels, active, onChange, className = '', vertical = false }: { id: string; label: string; labels: string[]; active: number; onChange: (index: number) => void; className?: string; vertical?: boolean }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div role="tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : 'horizontal'} className={`tabs ${className}`}>
    {labels.map((text, i) => <button key={text} ref={el => { refs.current[i] = el; }} type="button" id={`${id}-tab-${i}`} role="tab" aria-selected={active === i} aria-controls={`${id}-panel-${i}`} tabIndex={active === i ? 0 : -1} onClick={() => onChange(i)} onKeyDown={e => {
      const forward = vertical ? 'ArrowDown' : 'ArrowRight';
      const back = vertical ? 'ArrowUp' : 'ArrowLeft';
      let next = i;
      if (e.key === forward) next = (i + 1) % labels.length;
      else if (e.key === back) next = (i + labels.length - 1) % labels.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = labels.length - 1;
      else return;
      e.preventDefault(); onChange(next); refs.current[next]?.focus();
    }}><span>{text}</span>{vertical && <Arrow />}</button>)}
  </div>;
}
export function Panel({ id, index, active, children, className = '' }: { id: string; index: number; active: number; children: ReactNode; className?: string }) {
  return <div id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`} tabIndex={0} hidden={index !== active} className={`tab-panel ${className}`}>{children}</div>;
}
export function Accordion({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  const id = useId();
  return <details className={`accordion ${className}`} name={className === 'faq-item' ? 'faq' : undefined}>
    <summary aria-controls={id}><span>{title}</span><span className="plus" aria-hidden="true" /></summary>
    <div className="accordion__body" id={id}>{children}</div>
  </details>;
}
