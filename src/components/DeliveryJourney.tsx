import { useRef, useState, type KeyboardEvent } from 'react';
import { process } from '../content';
import './delivery-journey.css';

const artifacts = ['The brief', 'The blueprint', 'Working software', 'Life after launch'];
const outcomes = ['A shared starting point', 'A plan you can explore', 'Progress you can try', 'Ready for what comes next'];

function DeliveryArtifact({ active }: { active: number }) {
  return <div className="delivery-scene" data-stage={active} aria-hidden="true">
    <div className="delivery-scene__grid" />
    <div className="delivery-scene__top"><span>Idea to everyday impact</span><span>0{active + 1} / 04</span></div>
    <div className="delivery-object">
      <div className="delivery-object__shadow" />
      <div className="delivery-layer delivery-layer--base"><span>Foundation</span><i /></div>
      <div className="delivery-layer delivery-layer--middle"><span>Connections</span><i /><i /><i /></div>
      <div className="delivery-layer delivery-layer--surface">
        <div className="delivery-sheet__header"><img src="/mark.png" alt="" width="34" height="34" /><span>{artifacts[active]}</span><span className="delivery-sheet__signal" /></div>
        <div className={`delivery-drawing delivery-drawing--brief ${active === 0 ? 'is-visible' : ''}`}>
          <div className="delivery-brief__heading">Start with why.</div>
          <div className="delivery-brief__row"><span>01</span><span>People</span><i /></div>
          <div className="delivery-brief__row"><span>02</span><span>Workflows</span><i /></div>
          <div className="delivery-brief__row"><span>03</span><span>Priorities</span><i /></div>
        </div>
        <div className={`delivery-drawing delivery-drawing--blueprint ${active === 1 ? 'is-visible' : ''}`}>
          <div className="delivery-blueprint__node delivery-blueprint__node--one">People</div>
          <span className="delivery-blueprint__path delivery-blueprint__path--one" />
          <div className="delivery-blueprint__node delivery-blueprint__node--two">Experience</div>
          <span className="delivery-blueprint__path delivery-blueprint__path--two" />
          <div className="delivery-blueprint__node delivery-blueprint__node--three">Systems</div>
          <div className="delivery-blueprint__cross delivery-blueprint__cross--one" />
          <div className="delivery-blueprint__cross delivery-blueprint__cross--two" />
        </div>
        <div className={`delivery-drawing delivery-drawing--software ${active > 1 ? 'is-visible' : ''}`}>
          <div className="delivery-software__nav"><i /><i /><i /><i /></div>
          <div className="delivery-software__main"><span>{active === 3 ? 'Ready for release.' : 'Taking shape.'}</span><div className="delivery-software__tiles"><i /><i /><i /></div><div className="delivery-software__row"><b />Workflows<span>✓</span></div><div className="delivery-software__row"><b />Connections<span>✓</span></div><div className="delivery-software__status"><i />{active === 3 ? 'Launch · handover · support' : 'Build · test · review'}</div></div>
        </div>
      </div>
      <div className="delivery-launch-ring" />
      <div className="delivery-launch-beacon"><span>↗</span></div>
    </div>
    <div className="delivery-scene__bottom"><span className="delivery-scene__dot" /><span>{outcomes[active]}</span></div>
  </div>;
}

export default function DeliveryJourney({ still }: { still: boolean }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function onStageKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % process.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + process.length - 1) % process.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = process.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  return <section id="process" className="delivery-journey" data-still={still} data-theme-section="process" aria-labelledby="process-title">
    <div className="wrap">
      <header className="delivery-heading"><div><p className="eyebrow">03 / From possibility to progress</p><h2 id="process-title">You see the work.<br /><span>At every step.</span></h2></div><p>From the first question to life after launch. A shared process, with something tangible at every turn.</p></header>
      <div className="delivery-tabs" role="tablist" aria-label="Explore our delivery process">{process.map((step, index) => <button type="button" key={step.name} ref={element => { tabs.current[index] = element; }} role="tab" id={`delivery-tab-${index}`} aria-controls={`delivery-panel-${index}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => onStageKey(event, index)}><span className="delivery-tabs__number">0{index + 1}</span><span className="delivery-tabs__name">{step.name}</span><span className="delivery-tabs__arrow" aria-hidden="true">↗</span></button>)}</div>
      <div className="delivery-workbench">
        <DeliveryArtifact active={active} />
        <div className="delivery-copy">{process.map((step, index) => <div key={step.name} className={`delivery-copy__panel ${active === index ? 'is-active' : ''}`} id={`delivery-panel-${index}`} role="tabpanel" aria-labelledby={`delivery-tab-${index}`} aria-hidden={active !== index} inert={active !== index} tabIndex={active === index ? 0 : -1}>
          <p className="delivery-copy__artifact">{artifacts[index]}</p><h3>{step.heading}</h3><p className="delivery-copy__description">{step.body}</p>
          <dl><div><dt>You receive</dt><dd>{step.output}</dd></div><div><dt>Your part</dt><dd>{step.review}</dd></div></dl>
        </div>)}</div>
      </div>
      <div className="delivery-foot"><p>Your context shapes the plan. Your feedback shapes the product.</p><button type="button" className="delivery-next" onClick={() => setActive((active + 1) % process.length)} aria-label={`Explore ${process[(active + 1) % process.length].name}`}><span>{active === process.length - 1 ? 'Back to the beginning' : `Next: ${process[active + 1].name}`}</span><span aria-hidden="true">→</span></button></div>
    </div>
  </section>;
}
