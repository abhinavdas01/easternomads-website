import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Arrow, Mark } from './Primitives';
import { services, technologies } from '../content';
import './service-journey.css';
import DisclosureCue from './DisclosureCue';

const chapters = [
  { id: 'build', verb: 'Build', heading: 'Make the complex.', emphasis: 'Feel simple.', body: 'The best software feels like it was made for you. Because it was. Bring your people, processes, and customers into one considered experience.', serviceIndexes: [0, 1], caption: 'Built around your business', outcome: 'One workspace. Everything in its place.' },
  { id: 'connect', verb: 'Connect', heading: 'Less busywork.', emphasis: 'More momentum.', body: 'Let information flow and give your people room to think. Connect the systems you rely on, and put AI to work where it makes a real difference.', serviceIndexes: [2, 3], caption: 'Your systems. In sync.', outcome: 'Connected systems. A clearer way forward.' },
  { id: 'evolve', verb: 'Evolve', heading: 'Ready for now.', emphasis: 'Built for next.', body: 'Your business keeps moving. Your technology should too. Reimagine what is already there, with a clear path from today to what comes next.', serviceIndexes: [4, 5], caption: 'Progress, without the reset', outcome: 'Keep what works. Make room for more.' },
];

function JourneyArt({ kind }: { kind: string }) {
  return <div className={`journey-art journey-art--${kind}`} aria-hidden="true">
    <div className="journey-art__grid" />
    {kind === 'build' && <div className="journey-workspace">
      <div className="journey-workspace__sheet journey-workspace__sheet--back" />
      <div className="journey-workspace__sheet journey-workspace__sheet--middle" />
      <div className="journey-workspace__front">
        <div className="journey-workspace__top"><Mark /><span>Your workspace</span><i /><i /><i /></div>
        <div className="journey-workspace__body"><div className="journey-workspace__sidebar"><b /><b /><b /><b /></div><div className="journey-workspace__content">
          <div className="journey-workspace__line" /><div className="journey-workspace__line journey-workspace__line--short" />
          <div className="journey-workspace__tiles"><div><span /><i /><i /></div><div><span /><i /><i /></div><div><span /><i /><i /></div></div>
          <div className="journey-workspace__footer"><span />Everything, connected.<Arrow /></div>
        </div></div>
      </div>
    </div>}
    {kind === 'connect' && <div className="journey-network">
      <div className="journey-network__ring journey-network__ring--outer" /><div className="journey-network__ring" /><div className="journey-network__cross" />
      <div className="journey-network__core"><Mark /></div>
      <span className="journey-node journey-node--data"><i />Data</span><span className="journey-node journey-node--tools"><i />Tools</span><span className="journey-node journey-node--people"><i />People</span><span className="journey-node journey-node--ai"><i />Applied AI</span>
      <div className="journey-network__signal" /><div className="journey-network__signal journey-network__signal--second" />
    </div>}
    {kind === 'evolve' && <div className="journey-ascent">
      <div className="journey-ascent__path" />
      <div className="journey-ascent__slab journey-ascent__slab--one"><span>Today</span></div>
      <div className="journey-ascent__slab journey-ascent__slab--two"><span>Better</span></div>
      <div className="journey-ascent__slab journey-ascent__slab--three"><Mark /><span>Next</span></div>
      <div className="journey-ascent__halo" />
    </div>}
  </div>;
}

export default function ServiceJourney({ onContact, still }: { onContact: (interest?: string) => void; still: boolean }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const focusLine = window.innerWidth <= 900
        ? Math.min((stage.current?.getBoundingClientRect().bottom ?? 300) + 90, window.innerHeight * .78)
        : window.innerHeight * .48;
      let next = 0;
      chapterRefs.current.forEach((chapter, index) => {
        if (chapter && chapter.getBoundingClientRect().top <= focusLine) next = index;
      });
      setActive(current => current === next ? current : next);
    };
    const queue = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const resizeObserver = new ResizeObserver(queue);
    if (track.current) resizeObserver.observe(track.current);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    queue();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      resizeObserver.disconnect();
    };
  }, []);

  return <section id="services" className={`service-journey wrap${still ? ' service-journey--still' : ''}`} data-theme-section="services" aria-labelledby="services-title">
    <div className="journey-intro"><div><p className="eyebrow">02 / What we make possible</p><h2 id="services-title"><span>Big possibilities.</span><span>Thoughtfully built.</span></h2></div><p>From the first idea to the software your business runs on. Three ways to move forward.</p></div>
    <div className="journey-track" ref={track}>
      <aside className="journey-stage" ref={stage} aria-label="Your service journey">
        <nav className="journey-nav" aria-label="Service chapters">{chapters.map((chapter, index) => <a href={`#${chapter.id}`} key={chapter.id} aria-current={active === index ? 'step' : undefined}><span className="journey-nav__number">0{index + 1}</span><span>{chapter.verb}</span><span className="journey-nav__line" /></a>)}</nav>
        <div className="journey-stage__canvas" aria-hidden="true">{chapters.map((chapter, index) => <motion.div className="journey-stage__layer" key={chapter.id} initial={false} animate={{ opacity: active === index ? 1 : 0, y: still ? 0 : active === index ? 0 : index < active ? -28 : 28, scale: still ? 1 : active === index ? 1 : .96 }} transition={{ duration: still ? 0 : .65, ease: [.22, 1, .36, 1] }}><JourneyArt kind={chapter.id} /></motion.div>)}<div className="journey-stage__coordinate"><span>EASTERN NOMADS</span><Arrow diagonal /></div></div>
        <div className="journey-stage__caption"><span className="journey-stage__count">0{active + 1}<span> / 03</span></span><p>{chapters[active].caption}</p></div>
      </aside>
      <div className="journey-narrative">{chapters.map((chapter, index) => <article className={`journey-chapter${active === index ? ' is-active' : ''}`} key={chapter.id} id={chapter.id} ref={element => { chapterRefs.current[index] = element; }} aria-labelledby={`${chapter.id}-title`}>
        <p className="eyebrow"><span>0{index + 1}</span> / {chapter.verb}</p><h3 id={`${chapter.id}-title`}>{chapter.heading}<br /><em>{chapter.emphasis}</em></h3><p className="journey-chapter__body">{chapter.body}</p>
        <div className="journey-details">{chapter.serviceIndexes.map(serviceIndex => { const service = services[serviceIndex]; return <details key={service.id} name={`journey-${chapter.id}`}><summary><span>{service.title}</span><DisclosureCue /></summary><div className="journey-details__body"><p>{service.body}</p><ul>{service.deliverables.map(point => <li key={point}>{point}</li>)}</ul><button type="button" className="text-link" onClick={() => onContact(service.id)}>Explore this with us <Arrow diagonal /></button></div></details>; })}</div>
        <p className="journey-chapter__outcome"><span aria-hidden="true">↳</span>{chapter.outcome}</p>
      </article>)}</div>
    </div>
    <details className="technology-fold" id="solutions" data-theme-section="solutions"><summary><span>Good thinking. The right technology.</span><DisclosureCue label="Explore our toolkit" /></summary><div className="technology-grid">{technologies.map(item => <div key={item.label}><h3>{item.label}</h3><p>{item.body}</p><ul>{item.tools.map(tool => <li key={tool}>{tool}</li>)}</ul></div>)}</div></details>
  </section>;
}