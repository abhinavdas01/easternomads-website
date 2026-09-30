import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { Arrow, Mark } from './Primitives';
import { apis, companyLinks, industries, offerings, solutions } from '../catalog';
import './mega-nav.css';

type MenuItem = { key: string; href: string; title: string; summary?: string; icon: LucideIcon; onSelect?: () => void };
type Menu = { kind: 'menu'; id: string; label: string; eyebrow: string; lede: string; href: string; cta: string; columns: number; items: MenuItem[] };
type Entry = { kind: 'link'; label: string; href: string } | Menu;

const DESKTOP = '(min-width: 1101px)';

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/* Scroll after menus close, so the body scroll lock is released first. */
function go(href: string) {
  requestAnimationFrame(() => {
    if (window.location.hash === href) document.querySelector(href)?.scrollIntoView();
    else window.location.hash = href;
  });
}

export default function SiteHeader({ still, onContact, onIndustry }: { still: boolean; onContact: (interest?: string) => void; onIndustry: (id: string) => void }) {
  const desktop = useMedia(DESKTOP);
  const [open, setOpen] = useState<string | null>(null);
  const [drawerState, setDrawer] = useState(false);
  const drawer = drawerState && !desktop; // the drawer only exists below the desktop breakpoint
  const hoverTimer = useRef(0);
  const openedByHover = useRef(false);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const toggle = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const [current, setCurrent] = useState('#top');

  const entries: Entry[] = [
    { kind: 'link', label: 'Home', href: '#top' },
    { kind: 'menu', id: 'services', label: 'Services', eyebrow: 'Services', lede: 'Design, build, launch, and grow. Everything under one roof.', href: '#all-services', cta: 'All services', columns: 3,
      items: offerings.map(item => ({ key: item.id, href: `#service-${item.id}`, title: item.title, summary: item.summary, icon: item.icon })) },
    { kind: 'menu', id: 'industries', label: 'Industries', eyebrow: 'Industries', lede: 'Software for the way your industry works.', href: '#industries', cta: 'See every industry', columns: 4,
      items: industries.map(item => {
        const count = solutions.filter(solution => solution.industry === item.id).length;
        return { key: item.id, href: '#industries', title: item.title, summary: `${count} solution${count === 1 ? '' : 's'}`, icon: item.icon, onSelect: () => onIndustry(item.id) };
      }) },
    { kind: 'menu', id: 'apis', label: 'APIs', eyebrow: 'API integrations', lede: 'Connect your product to the services it depends on.', href: '#apis', cta: 'All integrations', columns: 3,
      items: apis.map(item => ({ key: item.id, href: `#api-${item.id}`, title: item.title, icon: item.icon })) },
    { kind: 'link', label: 'SaaS', href: '#saas' },
    { kind: 'menu', id: 'company', label: 'Company', eyebrow: 'Company', lede: 'Independent minds. Enterprise possibilities.', href: '#about', cta: 'About Eastern Nomads', columns: 2,
      items: companyLinks.map(item => ({ key: item.href, href: item.href, title: item.title, summary: item.summary, icon: item.icon, onSelect: item.open ? () => { const fold = document.getElementById(item.open!); if (fold instanceof HTMLDetailsElement) fold.open = true; } : undefined })) },
  ];

  function close() { window.clearTimeout(hoverTimer.current); setOpen(null); setDrawer(false); }

  function navigate(event: MouseEvent, href: string, onSelect?: () => void) {
    event.preventDefault();
    close(); onSelect?.(); go(href);
  }

  function hover(event: PointerEvent, id: string | null) {
    if (!desktop || event.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => { openedByHover.current = id !== null; setOpen(id); }, id ? (open ? 0 : 90) : 180);
  }

  function clickTrigger(id: string) {
    window.clearTimeout(hoverTimer.current);
    // A mouse user who hovered the menu open expects the click to keep it open.
    if (open === id && openedByHover.current) { openedByHover.current = false; return; }
    openedByHover.current = false;
    setOpen(open === id ? null : id);
  }

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Which nav entry the reader is in: the topmost section whose top has passed the header.
  useEffect(() => {
    const sections: [string, string][] = [['top', '#top'], ['services', '#all-services'], ['solutions', '#industries'], ['apis', '#apis'], ['process', '#top'], ['saas', '#saas'], ['about', '#about'], ['faq', '#about'], ['contact', '#top']];
    let frame = 0;
    const update = () => {
      frame = 0;
      let next = '#top';
      for (const [id, href] of sections) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= 120) next = href; }
      setCurrent(next);
    };
    const queue = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener('scroll', queue, { passive: true });
    queue();
    return () => { window.removeEventListener('scroll', queue); window.cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!open && !drawer) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (open) { triggers.current[open]?.focus(); setOpen(null); }
      else { setDrawer(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, drawer]);

  const fade = { duration: still ? 0 : .18, ease: [.22, 1, .36, 1] as const };

  return <>
    <header className={`nav${open && desktop ? ' nav--mega' : ''}`} data-theme-section="nav"><div className="nav__inner wrap">
      <a className="nav__brand" href="#top" aria-label="Eastern Nomads home" onClick={event => navigate(event, '#top')}><Mark /><span>eastern<span className="brand-second">nomads</span></span></a>
      <nav id="primary-navigation" className={`mega${drawer ? ' is-open' : ''}`} aria-label="Primary navigation">
        <ul className="mega__list">{entries.map(entry => entry.kind === 'link'
          ? <li key={entry.label} className="mega__entry"><a className="mega__top" href={entry.href} aria-current={current === entry.href ? 'location' : undefined} onClick={event => navigate(event, entry.href)}>{entry.label}</a></li>
          : <li key={entry.id} className="mega__entry" onPointerEnter={event => hover(event, entry.id)} onPointerLeave={event => hover(event, null)}
              onBlur={event => { if (open === entry.id && !event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(null); }}>
            <button ref={element => { triggers.current[entry.id] = element; }} type="button" className={`mega__top mega__trigger${current === entry.href ? ' is-current' : ''}`} aria-expanded={open === entry.id} aria-controls={`mega-${entry.id}`} onClick={() => clickTrigger(entry.id)}>
              {entry.label}<ChevronDown className="mega__chevron" size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>{open === entry.id && <motion.div key="panel" id={`mega-${entry.id}`} className="mega__panel" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: still ? 0 : .12 } }} transition={fade}>
              <div className="mega__panel-inner wrap">
                <div className="mega__intro">
                  <p className="eyebrow">{entry.eyebrow}</p>
                  <span className="mega__lede">{entry.lede}</span>
                  <a className="text-link" href={entry.href} onClick={event => navigate(event, entry.href, entry.id === 'industries' ? () => onIndustry('all') : undefined)}>{entry.cta} <Arrow /></a>
                </div>
                <ul className="mega__grid" style={{ '--mega-columns': entry.columns } as CSSProperties}>{entry.items.map(({ key, href, title, summary, icon: Icon, onSelect }) => <li key={key}>
                  <a className="mega__link" href={href} onClick={event => navigate(event, href, onSelect)}>
                    <span className="mega__icon"><Icon size={18} strokeWidth={1.5} aria-hidden="true" /></span>
                    <span className="mega__text"><span className="mega__title">{title}</span>{summary && <span className="mega__summary">{summary}</span>}</span>
                  </a>
                </li>)}</ul>
              </div>
            </motion.div>}</AnimatePresence>
          </li>)}</ul>
      </nav>
      <button className="nav__cta" onClick={() => { close(); onContact(); }}>Contact us <Arrow diagonal /></button>
      <button ref={toggle} className="nav__toggle" aria-expanded={drawer} aria-controls="primary-navigation" aria-label={drawer ? 'Close menu' : 'Open menu'} onClick={() => { setOpen(null); setDrawer(!drawer); }}><span /><span /></button>
    </div><motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} /></header>
    <AnimatePresence>{open && desktop && <motion.div className="mega-scrim" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade} onClick={() => setOpen(null)} />}</AnimatePresence>
  </>;
}
