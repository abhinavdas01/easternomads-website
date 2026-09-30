import { useEffect, useRef, useState } from 'react';
import { Arrow } from './Primitives';
import ServiceCarousel from './ServiceCarousel';
import { offerings } from '../catalog';
import './service-journey.css';
import DisclosureCue from './DisclosureCue';

/* Each chapter introduces two or three of the services shown in the stack beside it. */
const chapters = [
  { id: 'build', verb: 'Build', heading: 'Make the complex.', emphasis: 'Feel simple.', body: 'The best software feels like it was made for you. Because it was. Web, mobile, and design, shaped around your people, processes, and customers.', serviceIds: ['web', 'mobile', 'design'], outcome: 'One product. Every screen. Thoughtfully designed.' },
  { id: 'grow', verb: 'Grow', heading: 'Less busywork.', emphasis: 'More momentum.', body: 'Put AI to work on the repetitive tasks, and put your product in front of the right people. Automation and marketing, working together.', serviceIds: ['automation', 'marketing'], outcome: 'Reach more people. Do less by hand.' },
  { id: 'evolve', verb: 'Evolve', heading: 'Ready for now.', emphasis: 'Built for next.', body: 'Keep everything running, secure, and up to date, with independent advice on where technology will pay off next.', serviceIds: ['hosting', 'consultancy'], outcome: 'Hosted, maintained, and planned ahead.' },
];

export default function ServiceJourney({ onContact, still }: { onContact: (interest?: string) => void; still: boolean }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const focusLine = window.innerHeight * .48;
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
    <div className="journey-intro"><div><p className="eyebrow">01 / What we make possible</p><h2 id="services-title"><span>Big possibilities.</span><span>Thoughtfully built.</span></h2></div></div>
    <div className="journey-track" id="all-services" ref={track}>
      <aside className="journey-stage" aria-labelledby="all-services-title"><div className="journey-stage__head"><p className="eyebrow">Check what we provide</p><h3 id="all-services-title">All services</h3></div><ServiceCarousel onContact={onContact} /></aside>
      <div className="journey-narrative">{chapters.map((chapter, index) => <article className={`journey-chapter${active === index ? ' is-active' : ''}`} key={chapter.id} id={chapter.id} ref={element => { chapterRefs.current[index] = element; }} aria-labelledby={`${chapter.id}-title`}>
        <p className="eyebrow">{chapter.verb}</p><h3 id={`${chapter.id}-title`}>{chapter.heading}<br /><em>{chapter.emphasis}</em></h3><p className="journey-chapter__body">{chapter.body}</p>
        <div className="journey-details">{chapter.serviceIds.map(serviceId => { const service = offerings.find(item => item.id === serviceId)!; return <details key={service.id} name={`journey-${chapter.id}`}><summary><span>{service.title}</span><DisclosureCue /></summary><div className="journey-details__body"><p>{service.summary}</p><ul>{service.points.map(point => <li key={point}>{point}</li>)}</ul><button type="button" className="text-link" onClick={() => onContact(`service:${service.id}`)}>Explore this with us <Arrow diagonal /></button></div></details>; })}</div>
        <p className="journey-chapter__outcome"><span aria-hidden="true">↳</span>{chapter.outcome}</p>
      </article>)}</div>
    </div>
  </section>;
}