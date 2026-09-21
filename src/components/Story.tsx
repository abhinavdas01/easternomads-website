import { Fragment, useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Arrow } from './Primitives';

const storyLines = [
  'Your business has its own rhythm.',
  'Your software should move with it.',
  'We build around your people.',
  'Connect the work that matters.',
  'Make the complex feel simple.',
  'And create room for what’s next.',
];

function StoryWord({ word, index, total, accent, progress }: {
  word: string; index: number; total: number; accent: boolean; progress: MotionValue<number>;
}) {
  const start = index / total * 0.72;
  const color = useTransform(progress, [start, start + 0.28], ['#51524f', accent ? '#ff8754' : '#f3f0e9']);
  return <motion.span className="story__word" style={{ color }}>{word}</motion.span>;
}

function StoryLine({ text, accent, still }: { text: string; accent: boolean; still: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['center 0.8', 'center 0.43'] });
  const words = text.split(' ');
  return <span ref={ref} className={`story__row${accent ? ' story__row--accent' : ''}`}>
    {words.map((word, index) => <Fragment key={index}>{still
      ? <span className="story__word">{word}</span>
      : <StoryWord word={word} index={index} total={words.length} accent={accent} progress={scrollYProgress} />}{index < words.length - 1 ? ' ' : null}</Fragment>)}
  </span>;
}

export default function Story({ still }: { still: boolean }) {
  return <section id="story" className={`story${still ? ' story--still' : ''}`} data-theme-section="audiences" aria-labelledby="story-title">
    <div className="story__content wrap">
      <div className="section-marker"><span className="eyebrow">01 / The way we see it</span><span className="micro-label">Business first. Always.</span></div>
      <h2 id="story-title" className="story__text">
        <span className="sr-only">{storyLines.join(' ')}</span>
        <span className="story__lines" aria-hidden="true">{storyLines.map((text, index) => <StoryLine key={text} text={text} accent={index === storyLines.length - 1} still={still} />)}</span>
      </h2>
      <div className="story__foot"><span className="story__line" /><p>Less friction. More possibility.</p><a className="text-link" href="#services">Here’s how <Arrow /></a></div>
    </div>
  </section>;
}