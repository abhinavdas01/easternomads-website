import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { industries, solutions } from '../catalog';
import './industry-picker.css';

const countFor = (id: string) => id === 'all' ? solutions.length : solutions.filter(solution => solution.industry === id).length;
const options = [{ id: 'all', title: 'All industries', icon: LayoutGrid }, ...industries];

/* Industries in one horizontal row. The selected one points down at its cards; the row scrolls sideways
   (trackpad, touch, or the arrow buttons) when it is wider than the page. */
export default function IndustryPicker({ industry, onIndustry }: { industry: string; onIndustry: (id: string) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const current = options.find(option => option.id === industry) ?? options[0];

  // Track whether the row can scroll further, to enable or disable the arrows.
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => setEdges({ start: element.scrollLeft <= 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    update();
    element.addEventListener('scroll', update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(element);
    return () => { element.removeEventListener('scroll', update); resize.disconnect(); };
  }, []);

  // Keep the selected industry in view, e.g. when it was picked from the Industries menu.
  useEffect(() => {
    const element = rail.current;
    const active = element?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!element || !active) return;
    const target = active.offsetLeft - (element.clientWidth - active.offsetWidth) / 2;
    element.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [industry]);

  const page = (direction: number) => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * .7, behavior: 'smooth' });

  return <div className="industry-bar" id="industries">
    <span className="sr-only" role="status">{`${current.title}: ${countFor(current.id)} solution${countFor(current.id) === 1 ? '' : 's'}`}</span>
    <button type="button" className="industry-bar__arrow" aria-label="Scroll industries left" disabled={edges.start} onClick={() => page(-1)}><ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" /></button>
    <div ref={rail} className="industry-rail" role="group" aria-label="Filter solutions by industry">
      {options.map(({ id, title, icon: Icon }) => <button key={id} type="button" className="industry-rail__item" aria-pressed={id === industry} onClick={() => onIndustry(id)}>
        <Icon size={17} strokeWidth={1.5} aria-hidden="true" /><span>{title}</span><span className="industry-rail__count">{countFor(id)}</span>
      </button>)}
    </div>
    <button type="button" className="industry-bar__arrow" aria-label="Scroll industries right" disabled={edges.end} onClick={() => page(1)}><ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" /></button>
  </div>;
}
