import { useState } from 'react';
import { journeys } from '../content';
import { Arrow, Panel, Tabs } from './Primitives';

export default function HeroDiagram({ onExplore }: { onExplore: (id: string) => void }) {
  const [active, setActive] = useState(0);
  return <div className="blueprint">
    <div className="blueprint__top"><span className="micro-label">Your business. Connected.</span><span className="blueprint__index" aria-hidden="true">0{active + 1} / 03</span></div>
    <Tabs id="hero-flow" label="Explore a business workflow" labels={journeys.map(j => j.label)} active={active} onChange={setActive} className="blueprint__tabs" />
    {journeys.map((journey, i) => <Panel key={journey.label} id="hero-flow" index={i} active={active} className="blueprint__panel">
      <div className="blueprint__sources">{journey.source.map((source, n) => <span key={source}><span className="node-icon" aria-hidden="true">{['↳', '⌘', '≡'][n]}</span>{source}</span>)}</div>
      <svg className="flow-lines" viewBox="0 0 420 52" preserveAspectRatio="none" aria-hidden="true"><path d="M67 0v20q0 6 6 6h131q6 0 6 6v20M210 0v52M353 0v20q0 6-6 6H216q-6 0-6 6v20" /><path className="flow-lines__signal" d="M67 0v20q0 6 6 6h131q6 0 6 6v20M210 0v52M353 0v20q0 6-6 6H216q-6 0-6 6v20" pathLength="1" /></svg>
      <div className="blueprint__core"><span className="core-symbol" aria-hidden="true"><span /><span /><span /><span /></span><span className="micro-label">Built around your business</span><h2>{journey.platform}</h2><p>{journey.capabilities}</p></div>
      <svg className="flow-lines flow-lines--out" viewBox="0 0 420 44" preserveAspectRatio="none" aria-hidden="true"><path d="M210 0v16q0 6-6 6h-96q-6 0-6 6v16M210 0v16q0 6 6 6h96q6 0 6 6v16" /></svg>
      <div className="blueprint__outputs">{journey.result.map(item => <span key={item}><span className="small-dot" />{item}</span>)}</div>
      <div className="blueprint__explanation"><h3>{journey.title}</h3><p>{journey.description}</p><a className="text-link" href="#services" onClick={() => onExplore(journey.service)}>Explore this capability <Arrow /></a></div>
    </Panel>)}
    <div className="blueprint__bottom"><span className="small-dot" /><span>Select a business area to explore the flow</span></div>
  </div>;
}
