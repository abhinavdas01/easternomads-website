import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { Arrow, Mark } from './components/Primitives';
import FlowField from './components/FlowField';
import Story from './components/Story';
import ContactForm from './components/ContactForm';
import { contactEmail } from './contactModel';

import FaqSection from './components/FaqSection';
import People from './components/People';
import ServiceJourney from './components/ServiceJourney';
import DeliveryJourney from './components/DeliveryJourney';
import './index.css';
import './readability.css';
import './components/story.css';
import './components/disclosure-cue.css';

export default function App() {
  const heroCross = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [interest, setInterest] = useState('scope');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const still = Boolean(reduced) || paused;
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menuOpen]);

  function openContact(nextInterest = 'scope') {
    setInterest(nextInterest); setMenuOpen(false); setShowPrivacy(false);
    dialog.current?.showModal();
  }

  return <div className="site" data-motion={still ? 'paused' : 'running'}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="nav" data-theme-section="nav"><div className="nav__inner wrap">
      <a className="nav__brand" href="#top" aria-label="Eastern Nomads home"><Mark /><span>eastern<span className="brand-second">nomads</span></span></a>
      <nav id="primary-navigation" className={`nav__links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">{[['services', 'What we do'], ['process', 'How we work'], ['about', 'Who we are']].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
      <button className="nav__cta" onClick={() => openContact()}>Let’s talk <Arrow diagonal /></button>
      <button ref={menuButton} className="nav__toggle" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </div><motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} /></header>

    <main id="main" tabIndex={-1}>
      <section className="hero" id="top" data-theme-section="hero" aria-labelledby="hero-title">
        <FlowField paused={still} anchorRef={heroCross} /><div className="hero__veil" aria-hidden="true" />
        <div className="hero__content wrap"><p className="eyebrow hero__eyebrow"><span /> Independent minds. Enterprise possibilities.</p><motion.h1 id="hero-title" aria-label="Built for what’s next." initial={still ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>Built for<br />what’s <span className="hero__next">ne<span className="hero__cross" ref={heroCross}>x</span>t.</span></motion.h1><p className="hero__lead">Your ambition. Our craft.<br />Software that moves your business forward.</p><a className="hero__cta" href="#story">Explore the possibilities <span className="round-arrow"><Arrow diagonal /></span></a></div>
        <div className="hero__bottom wrap"><span className="micro-label">Enterprise software. Human by design.</span><a href="#story" className="scroll-cue"><span>Scroll to discover</span><span aria-hidden="true">↓</span></a><button className="motion-control" aria-pressed={paused} disabled={Boolean(reduced)} onClick={() => setPaused(!paused)} aria-label={reduced ? 'Reduced motion enabled' : paused ? 'Resume animations' : 'Pause animations'}><span aria-hidden="true">{still ? '▷' : 'Ⅱ'}</span><span>{reduced ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion'}</span></button></div>
      </section>
      <Story still={still} />
      <ServiceJourney onContact={openContact} still={still} />
      <DeliveryJourney still={still} />
      <People />
      <FaqSection />
      <section id="contact" className="contact-section" data-theme-section="contact" aria-labelledby="contact-title"><div className="contact-orbit" aria-hidden="true" /><div className="wrap contact-inner"><p className="eyebrow">The next chapter starts with a conversation.</p><h2 id="contact-title">What’s next?<br /><span>Let’s build it.</span></h2><button className="contact-cta" onClick={() => openContact()}>Tell us what you have in mind <span className="round-arrow"><Arrow diagonal /></span></button><a className="contact-email" href={`mailto:${contactEmail}`}>{contactEmail}<Arrow diagonal /></a></div></section>
    </main>

    <footer className="footer wrap" data-theme-section="footer"><div className="footer__top"><a className="nav__brand" href="#top"><Mark /><span>eastern<span className="brand-second">nomads</span></span></a><p>Rooted in curiosity.<br />Built to go further.</p><a className="text-link" href="#top">Back to top <span aria-hidden="true">↑</span></a></div><div className="footer__bottom"><span>© {new Date().getFullYear()} Eastern Nomads</span><span>Based in India. Connected everywhere.</span><a href="#faq">Questions? Start here <Arrow /></a></div></footer>

    <dialog ref={dialog} className="contact-dialog" aria-labelledby="inquiry-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="contact-dialog__inner"><div className="contact-dialog__heading"><div><p className="eyebrow">Let’s make a start</p><h2 id="inquiry-title">Your next chapter.</h2></div><button className="dialog-close" aria-label="Close project inquiry" onClick={() => dialog.current?.close()}>×</button></div><ContactForm interest={interest} onInterestChange={setInterest} onPrivacy={() => setShowPrivacy(!showPrivacy)} />{showPrivacy && <div className="privacy-note" role="region" aria-label="How we handle inquiries"><h3>Your project inquiry</h3><p>Your details are used to discuss your project. If you prepare an email, you control when it is sent through your email provider. If direct submission is configured, the form sends your details to our contact service. To ask about an inquiry, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></div>}</div></dialog>
  </div>;
}
