import { useRef } from 'react';
import { useInView } from 'framer-motion';

export default function DisclosureCue({ label = 'Explore', closeLabel = 'Close', direction = 'plus', stacked = false, className = '' }: {
  label?: string; closeLabel?: string; direction?: 'plus' | 'down'; stacked?: boolean; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  return <span ref={ref} className={`disclosure-cue${stacked ? ' disclosure-cue--stacked' : ''}${visible ? ' is-visible' : ''} ${className}`} aria-hidden="true">
    <span className="disclosure-cue__label"><span className="disclosure-cue__closed">{label}</span><span className="disclosure-cue__open">{closeLabel}</span></span>
    <span className={`disclosure-cue__icon disclosure-cue__icon--${direction}`}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        {direction === 'plus' ? <><path d="M5 12h14" /><path className="disclosure-cue__vertical" d="M12 5v14" /></> : <path d="M12 4v16m-6-6 6 6 6-6" />}
      </svg>
    </span>
  </span>;
}