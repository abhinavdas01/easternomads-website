import { useEffect, useRef, useState, type FormEvent } from 'react';
import { services } from '../content';
import { contactEmail, contactEndpoint, inquiryText, mailtoInquiry, sendInquiry, type Inquiry } from '../contactModel';
import { Arrow } from './Primitives';




export default function ContactForm({ interest, onInterestChange, onPrivacy }: { interest: string; onInterestChange: (value: string) => void; onPrivacy: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'draft' | 'error'>('idle');
  const [copyStatus, setCopyStatus] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);
  function getInquiry(form: HTMLFormElement): Inquiry {
    const data = new FormData(form);
    return { name: String(data.get('name') || ''), email: String(data.get('email') || ''), company: String(data.get('company') || ''), interest, message: String(data.get('message') || '') };
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending' || abortRef.current) return;
    const form = event.currentTarget;
    if (new FormData(form).get('website')) return;
    const inquiry = getInquiry(form);
    if (!contactEndpoint) { window.location.href = mailtoInquiry(inquiry); setStatus('draft'); return; }
    const controller = new AbortController(); abortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    setStatus('sending');
    try { await sendInquiry(contactEndpoint, inquiry, controller.signal); setStatus('sent'); }
    catch { setStatus('error'); }
    finally { clearTimeout(timeout); abortRef.current = null; }
  }
  async function copyBrief() {
    if (!formRef.current?.reportValidity()) return;
    try { await navigator.clipboard.writeText(inquiryText(getInquiry(formRef.current))); setCopyStatus('Project brief copied. Paste it into your email.'); }
    catch { setCopyStatus('Copy is unavailable in this browser. Your entries remain here to select manually.'); }
  }
  return <form ref={formRef} className="contact-form" onSubmit={submit} aria-busy={status === 'sending'} onChange={() => { if (status !== 'sending') setStatus('idle'); setCopyStatus(''); }}>
    <div className="contact-form__head"><span className="micro-label">Start a conversation</span><span className="micro-label">01 / Your brief</span></div>
    <fieldset disabled={status === 'sending'}>
      <legend className="sr-only">Your project details</legend>
      <div className="form-row"><label>Your name<input name="name" required maxLength={120} autoComplete="name" placeholder="Alex Morgan" /></label><label>Work email<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="alex@company.com" /></label></div>
      <label>Company <span className="optional">optional</span><input name="company" maxLength={180} autoComplete="organization" placeholder="Company name" /></label>
      <label>What would you like to build?<select id="contact-interest" name="interest" value={interest} onChange={e => onInterestChange(e.target.value)}>{services.map(service => <option key={service.id} value={service.id}>{service.short}</option>)}<option value="scope">Help defining the scope</option></select></label>
      <label>A little about your project<textarea name="message" required maxLength={4000} rows={4} placeholder="The process you want to improve, who will use it, and what a useful outcome looks like." /></label>
      <div className="form-trap" aria-hidden="true"><label>Leave this field empty<input name="website" autoComplete="off" tabIndex={-1} /></label></div>
      <p className="form-note">{contactEndpoint ? 'Your details and brief will be sent to our configured contact service.' : 'This prepares a draft in your email app. You review and send it there.'} Please leave out passwords and confidential business data. <button type="button" className="inline-button" onClick={onPrivacy}>How we handle inquiries</button></p>
      <button className="btn btn--primary contact-form__submit" type="submit">{status === 'sending' ? 'Sending your brief…' : contactEndpoint ? 'Send project inquiry' : 'Prepare project email'}<Arrow diagonal /></button>
    </fieldset>
    {status === 'draft' && <div className="form-status" role="status">Your email app should open with a draft. This website has not sent your inquiry. If nothing opens, copy your brief and email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</div>}
    {status === 'sent' && <div className="form-status" role="status">Your inquiry was submitted successfully. You can keep a copy of your brief below.</div>}
    {status === 'error' && <div className="form-status form-status--error" role="alert">We couldn’t confirm submission. Your brief is still here. You can retry or copy it and email us directly.</div>}
    <div className="contact-form__alternative"><button type="button" className="inline-button" onClick={copyBrief}>Copy project brief <Arrow /></button><span>No attachments needed</span></div>
    {copyStatus && <p className="form-note" role="status">{copyStatus}</p>}
  </form>;
}
