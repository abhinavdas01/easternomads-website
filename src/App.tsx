import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Arrow, Mark } from './components/Primitives';
import SiteHeader from './components/SiteHeader';
import { Apis, Saas, Solutions } from './components/Catalog';
import FlowField from './components/FlowField';
import ContactForm from './components/ContactForm';
import { contactEmail } from './contactModel';

import FaqSection from './components/FaqSection';
import People from './components/People';
import ServiceJourney from './components/ServiceJourney';
import DeliveryJourney from './components/DeliveryJourney';
import { InfinityBrand } from '@/components/ui/infinity-brand';
import './index.css';
import './tailwind.css';
import './readability.css';
import './components/disclosure-cue.css';

export default function App() {
  const heroCross = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [interest, setInterest] = useState('scope');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [industry, setIndustry] = useState('all');
  const dialog = useRef<HTMLDialogElement>(null);
  const still = Boolean(reduced);

  function openContact(nextInterest = 'scope') {
    setInterest(nextInterest); setShowPrivacy(false);
    dialog.current?.showModal();
  }

  return <div className="site" data-motion={still ? 'paused' : 'running'}>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader still={still} onContact={openContact} onIndustry={setIndustry} />

    <main id="main" tabIndex={-1}>
      <section className="hero" id="top" data-theme-section="hero" aria-labelledby="hero-title">
        <FlowField paused={still} anchorRef={heroCross} /><div className="hero__veil" aria-hidden="true" />
        <div className="hero__content wrap"><p className="eyebrow hero__eyebrow"><span /> Independent minds. Enterprise possibilities.</p><motion.h1 id="hero-title" aria-label="Built for what’s next." initial={still ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>Built for<br />what’s <span className="hero__next">ne<span className="hero__cross" ref={heroCross}>x</span>t.</span></motion.h1><p className="hero__lead">Your ambition. Our craft.<br />Software that moves your business forward.</p><div className="hero__actions"><button type="button" className="btn btn--primary hero__primary" onClick={() => openContact()}>Talk to us <Arrow diagonal /></button><a className="hero__cta" href="#services">See what we build <span className="round-arrow"><Arrow diagonal /></span></a></div></div>
        <div className="hero__bottom wrap"><span className="micro-label">Enterprise software. Human by design.</span></div>
      </section>
      <ServiceJourney onContact={openContact} still={still} />
      <Solutions industry={industry} onIndustry={setIndustry} onContact={openContact} />
      <Apis onContact={openContact} />
      <DeliveryJourney still={still} />
      <Saas onContact={openContact} />
      <People />
      <section aria-label="Technologies we build with" className='border-0 border-t border-solid border-border bg-background py-10'>
        <div className='wrap mb-6 text-center'><span className='micro-label text-[15px]!'>Technologies we build with</span></div>
        <InfinityBrand />
      </section>
      <FaqSection />
      <section id="contact" className="contact-section" data-theme-section="contact" aria-labelledby="contact-title"><div className="contact-orbit" aria-hidden="true" /><div className="wrap contact-inner"><p className="eyebrow">The next chapter starts with a conversation.</p><h2 id="contact-title">What’s next?<br /><span>Let’s build it.</span></h2><button className="contact-cta" onClick={() => openContact()}>Tell us what you have in mind <span className="round-arrow"><Arrow diagonal /></span></button><a className="contact-email" href={`mailto:${contactEmail}`}>{contactEmail}<Arrow diagonal /></a></div></section>
    </main>

    <footer className="footer wrap" data-theme-section="footer"><div className="footer__top"><a className="nav__brand" href="#top"><Mark /><span>eastern<span className="brand-second">nomads</span></span></a><p>Rooted in curiosity.<br />Built to go further.</p><nav className="footer__links" aria-label="Footer">{[['services', 'Services'], ['solutions', 'Solutions'], ['saas', 'SaaS'], ['apis', 'APIs'], ['about', 'Company']].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav><a className="text-link" href="#top">Back to top <span aria-hidden="true">↑</span></a></div><div className="footer__bottom"><span>© {new Date().getFullYear()} Eastern Nomads</span><span>Based in India. Connected everywhere.</span><a href="#faq">Questions? Start here <Arrow /></a></div></footer>

    <dialog ref={dialog} className="contact-dialog" aria-labelledby="inquiry-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="contact-dialog__inner"><div className="contact-dialog__heading"><div><p className="eyebrow">Let’s make a start</p><h2 id="inquiry-title">Your next chapter.</h2></div><button className="dialog-close" aria-label="Close project inquiry" onClick={() => dialog.current?.close()}>×</button></div><ContactForm interest={interest} onInterestChange={setInterest} onPrivacy={() => setShowPrivacy(!showPrivacy)} />{showPrivacy && <div className="privacy-note" role="region" aria-label="How we handle inquiries"><h3>Your project inquiry</h3><p>Your details are used to discuss your project. If you prepare an email, you control when it is sent through your email provider. If direct submission is configured, the form sends your details to our contact service. To ask about an inquiry, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></div>}</div></dialog>
  </div>;
}
