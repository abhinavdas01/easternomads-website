import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { industryOf, solutions } from '../catalog';
import './solution-cube.css';

type Solution = typeof solutions[number];
/* One layer turn: a row spins around the vertical axis, a column around the horizontal one. */
type Turn = { axis: 'row' | 'col'; index: number; dir: 1 | -1; incoming: number[] };

const FACE = 9;
const GAP = 12;
const INTERVAL = 6000;
const DURATION = 900;

/* The whole card is a button: clicking it opens the contact form with this solution selected.
   A mouse click drops focus first, so the cube resumes turning once the form closes. */
function Card({ solution, onContact }: { solution: Solution; onContact: (interest: string) => void }) {
  const { id, title, icon: Icon, summary, industry } = solution;
  return <article className="solution-card" role="button" tabIndex={0} aria-label={`Ask about ${title}`} onClick={event => { event.currentTarget.blur(); onContact(`solution:${id}`); }}
    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onContact(`solution:${id}`); } }}>
    <ArrowUpRight className="solution-card__go" size={18} strokeWidth={1.5} aria-hidden="true" />
    <span className="solution-card__icon"><Icon size={18} strokeWidth={1.5} aria-hidden="true" /></span>
    <span className="micro-label">{industryOf(industry)?.title}</span>
    <h3>{title}</h3>
    <p>{summary}</p>
  </article>;
}

/* Shows nine solutions as a Rubik's cube face. When there are more, a row or column turns every few seconds
   and brings three unseen solutions onto the face. Pauses on hover, focus, off-screen, while `paused` is set, and for reduced motion. */
export default function SolutionCube({ items, onContact, paused: held = false }: { items: Solution[]; onContact: (interest: string) => void; paused?: boolean }) {
  const reduced = useReducedMotion();
  const cube = items.length > FACE && !reduced;
  const [face, setFace] = useState(() => items.slice(0, FACE).map((_, i) => i));
  const [turn, setTurn] = useState<Turn | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const grid = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const visibleOnScreen = useRef(false);
  const nextIndex = useRef(FACE);
  const lastAxis = useRef<Turn['axis']>('col');
  const faceRef = useRef(face);
  // The parent can hold the cube still, e.g. while the industry dropdown is open beside it.
  const heldRef = useRef(held);

  useEffect(() => { heldRef.current = held; }, [held]);

  useEffect(() => { faceRef.current = face; }, [face]);

  // A new filter starts from a fresh face (state is reset by the parent's key).
  useEffect(() => {
    const element = grid.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    const view = new IntersectionObserver(([entry]) => { visibleOnScreen.current = entry.isIntersecting; }, { threshold: .35 });
    resize.observe(element); view.observe(element);
    return () => { resize.disconnect(); view.disconnect(); };
  }, []);

  useEffect(() => {
    if (!cube) return;
    let settle = 0;
    const timer = window.setInterval(() => {
      // A card focused by keyboard (visible ring) holds the cube; a card merely clicked with the mouse does not.
      if (paused.current || heldRef.current || !visibleOnScreen.current || document.hidden || grid.current?.querySelector(':focus-visible')) return;
      const current = faceRef.current;
      const incoming: number[] = [];
      for (let guard = 0; incoming.length < 3 && guard < items.length * 2; guard++) {
        const candidate = nextIndex.current % items.length;
        nextIndex.current++;
        if (!current.includes(candidate) && !incoming.includes(candidate)) incoming.push(candidate);
      }
      const axis = lastAxis.current === 'row' ? 'col' : 'row';
      lastAxis.current = axis;
      const next: Turn = { axis, index: Math.floor(Math.random() * 3), dir: Math.random() < .5 ? 1 : -1, incoming };
      setTurn(next);
      settle = window.setTimeout(() => {
        setFace(latest => latest.map((value, cell) => {
          const layer = axis === 'row' ? Math.floor(cell / 3) : cell % 3;
          const position = axis === 'row' ? cell % 3 : Math.floor(cell / 3);
          return layer === next.index ? incoming[position] : value;
        }));
        setTurn(null);
      }, DURATION);
    }, INTERVAL);
    return () => { window.clearInterval(timer); window.clearTimeout(settle); };
  }, [cube, items.length]);

  if (!cube) return <div className="solution-cube solution-cube--static">{items.map(solution => <div className="solution-cube__cell" key={solution.id}><Card solution={solution} onContact={onContact} /></div>)}</div>;

  return <div ref={grid} className="solution-cube" onPointerEnter={() => { paused.current = true; }} onPointerLeave={() => { paused.current = false; }}
>
    {face.map((itemIndex, cell) => {
      const row = Math.floor(cell / 3), col = cell % 3;
      const turning = turn && (turn.axis === 'row' ? row : col) === turn.index;
      // Pivot every cell of the layer around the cube's centre, half a face-width behind the face.
      const style = turning ? {
        '--dir': turn.dir,
        transformOrigin: turn.axis === 'row'
          ? `calc(50% + ${1 - col} * (100% + ${GAP}px)) 50% ${-size.width / 2}px`
          : `50% calc(50% + ${1 - row} * (100% + ${GAP}px)) ${-size.height / 2}px`,
      } as CSSProperties : undefined;
      const incoming = turning ? items[turn.incoming[turn.axis === 'row' ? col : row]] : null;
      return <div className="solution-cube__cell" key={cell} data-turn={turning ? turn.axis : undefined}>
        <div className="solution-cube__face solution-cube__face--out" style={style} aria-hidden={turning || undefined}><Card solution={items[itemIndex]} onContact={onContact} /></div>
        {incoming && <div className="solution-cube__face solution-cube__face--in" style={style}><Card solution={incoming} onContact={onContact} /></div>}
      </div>;
    })}
  </div>;
}
