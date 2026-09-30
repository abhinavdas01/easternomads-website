import { useRef } from 'react';
import { Arrow, Reveal } from './Primitives';
import { apis, saasBenefits, saasIncludes, saasPricing, saasProducts, solutions } from '../catalog';
import IndustryPicker from './IndustryPicker';
import SolutionCube from './SolutionCube';
import './catalog.css';

type Contact = (interest?: string) => void;

function Heading({ id, eyebrow, title, muted }: { id: string; eyebrow: string; title: string; muted: string }) {
  return <Reveal className="catalog-head">
    <div><p className="eyebrow">{eyebrow}</p><h2 id={id}>{title}<br /><span>{muted}</span></h2></div>
  </Reveal>;
}

export function Solutions({ industry, onIndustry, onContact }: { industry: string; onIndustry: (id: string) => void; onContact: Contact }) {
  const visible = industry === 'all' ? solutions : solutions.filter(solution => solution.industry === industry);
  return <section id="solutions" className="catalog catalog--band" data-theme-section="solutions" aria-labelledby="solutions-title"><div className="wrap">
    <Heading id="solutions-title" eyebrow="02 / Ready-made solutions" title="Proven foundations." muted="Shaped to your business." />
    <IndustryPicker industry={industry} onIndustry={onIndustry} />
    <SolutionCube key={industry} items={visible} onContact={onContact} />
  </div></section>;
}

export function Saas({ onContact }: { onContact: Contact }) {
  const products = saasProducts.map(id => solutions.find(solution => solution.id === id)!);
  const plans = useRef<HTMLDialogElement>(null);
  return <section id="saas" className="catalog catalog--band catalog--saas" data-theme-section="saas" aria-labelledby="saas-title"><div className="wrap">
    <Heading id="saas-title" eyebrow="05 / SaaS" title="Ready when you are." muted="On subscription." />
    <div className="saas-layout">
      <ol className="saas-benefits">{saasBenefits.map((benefit, index) => <li key={benefit.title}><span className="saas-benefits__number">{String(index + 1).padStart(2, '0')}</span><div><h3>{benefit.title}</h3><p>{benefit.body}</p></div></li>)}</ol>
      <div className="saas-plans">
        <p className="micro-label">Subscription plans</p>
        <h3 className="saas-plans__statement">Know about<br /><span>our plans.</span></h3>
        <p>What each subscription includes, the products you can run, and how pricing works.</p>
        <button type="button" className="saas-plans__open" aria-haspopup="dialog" aria-label="Open subscription plans" onClick={() => plans.current?.showModal()}><Arrow diagonal /></button>
      </div>
    </div>
    <dialog ref={plans} className="contact-dialog plans-dialog" aria-labelledby="plans-title" onClick={event => { if (event.target === event.currentTarget) plans.current?.close(); }}><div className="contact-dialog__inner">
      <div className="contact-dialog__heading"><div><p className="eyebrow">SaaS subscription</p><h2 id="plans-title">Our plans.</h2></div><button type="button" className="dialog-close" aria-label="Close subscription plans" onClick={() => plans.current?.close()}>×</button></div>
      <p className="micro-label">Every plan includes</p>
      <ul className="plans-dialog__includes">{saasIncludes.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="micro-label">Available as a service</p>
      <ul className="plans-dialog__products">{products.map(({ id, title, icon: Icon }) => <li key={id}><Icon size={18} strokeWidth={1.5} aria-hidden="true" />{title}</li>)}</ul>
      <p className="micro-label">Pricing</p>
      <p className="plans-dialog__pricing">{saasPricing}</p>
      <button type="button" className="btn btn--primary plans-dialog__cta" onClick={() => { plans.current?.close(); onContact('saas'); }}>Ask about plans <Arrow diagonal /></button>
    </div></dialog>
  </div></section>;
}

export function Apis({ onContact }: { onContact: Contact }) {
  return <section id="apis" className="catalog" data-theme-section="apis" aria-labelledby="apis-title"><div className="wrap">
    <Heading id="apis-title" eyebrow="03 / API integrations" title="Your product," muted="plugged into everything." />
    <ul className="api-list">{apis.map(({ id, title, icon: Icon, summary }) => <li key={id} id={`api-${id}`} className="api-item catalog-target">
      <Icon className="api-item__logo" size={22} strokeWidth={1.5} aria-hidden="true" /><div><h3>{title}</h3><p>{summary}</p></div>
    </li>)}</ul>
    <div className="catalog-foot"><p>Need something that isn’t listed?</p><button type="button" className="text-link" onClick={() => onContact('api')}>Tell us what to connect <Arrow diagonal /></button></div>
  </div></section>;
}
