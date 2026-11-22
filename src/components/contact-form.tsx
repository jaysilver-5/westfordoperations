'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, Check, ChevronDown, Clipboard, Download, Mail, Pencil, RotateCcw } from 'lucide-react';
import { Reveal } from '@/components/animations';
import { ArrowLink, Eyebrow } from '@/components/ui';
import data from '@/data/content.json';
import { enquiryHref, type EnquiryMode } from '@/lib/links';
import { useRouter } from 'next/navigation';
import { contactEmailHref, enquiryLabels } from '@/lib/contact';
import { contactEmail } from '@/lib/site';
import { enquiryText, SERVICE_OPTIONS, type EnquiryFields as Fields } from '@/lib/enquiry';

const STORAGE_KEY = 'westford.operations.enquiry-draft.v1';
const emptyFields: Fields = { name: '', email: '', company: '', audience: '', service: 'unsure', challenge: '', website: '', platform: '', workload: '', remember: false };

type Props = { initialIntent: EnquiryMode; initialService?: string; initialAudience?: string };

function isValidService(x: string) { return SERVICE_OPTIONS.some(([key]) => key === x); }

export function ContactForm({ initialIntent, initialService, initialAudience }: Props) {
  const router = useRouter();
  const [intent, setIntent] = useState<EnquiryMode>(initialIntent);
  const [fields, setFields] = useState<Fields>({ ...emptyFields, service: isValidService(initialService ?? '') ? initialService! : 'unsure', audience: ['agency','brand','other'].includes(initialAudience ?? '') ? initialAudience! : '' });
  const [ready, setReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [extrasOpen, setExtrasOpen] = useState(false);
  const requestHeading = useRef<HTMLHeadingElement>(null);
  const requestId = useRef<string | null>(null);
  const summary = useMemo(() => enquiryText(fields, enquiryLabels[intent]), [fields, intent]);
  const context = data.contact.contexts[intent];
  const directEmailHref = contactEmailHref(contactEmail, intent);
  const title = intent === 'trial' ? 'Let’s make a little room.' : intent === 'review' ? 'Your free operations review' : 'Let’s talk about your store.';

  useEffect(() => {
    if (submitted) requestHeading.current?.focus();
  }, [submitted]);

  useEffect(() => {
    // Route CTAs must select their intent even when there is no remembered draft.
    setIntent(initialIntent);
    setSubmitted(false);
    setStatus('');
    setFields(prev => ({
      ...prev,
      ...(initialService && isValidService(initialService) ? { service: initialService } : {}),
      ...(initialAudience && ['agency', 'brand', 'other'].includes(initialAudience) ? { audience: initialAudience } : {}),
    }));
    try {
      const remembered = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<Fields & { version: number; intent: EnquiryMode }> | null;
      if (remembered && remembered.version === 1 && remembered.remember === true) {
        const loaded: Fields = { ...emptyFields };
        const keys: (keyof Omit<Fields, 'remember'>)[] = ['name','email','company','audience','service','challenge','website','platform','workload'];
        for (const key of keys) if (typeof remembered[key] === 'string') loaded[key] = String(remembered[key]).slice(0, key === 'challenge' ? 2000 : 300);
        loaded.remember = true;
        loaded.service = initialService && isValidService(initialService) ? initialService : isValidService(loaded.service) ? loaded.service : 'unsure';
        if (initialAudience && ['agency','brand','other'].includes(initialAudience)) loaded.audience = initialAudience;
        if (loaded.website || loaded.platform || loaded.workload) setExtrasOpen(true);
        setFields(loaded);
        // An explicit CTA intent takes priority over a previous draft's intent.
        setIntent(initialIntent);
      }
    } catch { /* Restricted storage still supports an in-memory draft. */ }
    setReady(true);
  }, [initialAudience, initialIntent, initialService]);

  useEffect(() => {
    if (!ready) return;
    try {
      if (fields.remember) localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...fields, intent, version: 1 }));
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* Show no false storage-success messages when storage is blocked. */ }
  }, [fields, intent, ready]);

  const change = (name: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields(prev => ({...prev, [name]: e.target.value}));
    requestId.current = null;
    setSendError('');
    setStatus('');
  };
  const chooseIntent = (next: EnquiryMode) => {
    setIntent(next);
    setSubmitted(false);
    setSendError('');
    setStatus('');
    requestId.current = null;
    router.replace(enquiryHref(next, fields.service === 'unsure' ? undefined : fields.service, fields.audience || undefined), { scroll: false });
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const websiteConfirm = new FormData(event.currentTarget).get('websiteConfirm') ?? '';
    setSending(true);
    setSendError('');
    setStatus('');
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, intent, requestId: requestId.current, websiteConfirm }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (!response.ok || result?.ok !== true) {
        setSendError(result?.error || 'We couldn’t send your request. Please try again or email us directly.');
        return;
      }
      setSubmitted(true);
      setStatus('Your request has been submitted. We’ll be in touch to discuss the next step.');
      requestId.current = null;
    } catch {
      setSendError('We couldn’t connect to send your request. Please try again or email us directly.');
    } finally {
      setSending(false);
    }
  };
  const clearDraft = () => {
    setFields({ ...emptyFields });
    setSubmitted(false);
    setExtrasOpen(false);
    setStatus('Draft cleared from this page and browser storage, if available.');
    setSendError('');
    requestId.current = null;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* no-op */ }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setStatus('Enquiry summary copied to your clipboard.'); }
    catch { setStatus('Copy is unavailable in this browser. Select the summary text below to copy it manually.'); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([summary + '\n'], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'westford-enquiry-draft.txt';
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Your enquiry draft has been downloaded.');
  };

  return <div className="grid items-start gap-11 md:grid-cols-[.82fr_1.18fr] md:gap-8 lg:gap-18">
    <div id="contact-form" className="order-1 min-w-0 scroll-mt-29 rounded-2xl border border-[#dce4d8] bg-ivory p-5 shadow-[0_9px_35px_#17343d0a] sm:p-8 md:order-2 lg:p-9">
      <fieldset>
        <legend className="mb-3 text-[.75rem] font-extrabold">How would you like to start?</legend>
        <div className="grid grid-cols-3 gap-1 rounded-lg border border-[#e0e7da] bg-[#edf1e9] p-1">
          {([['trial', '2 weeks free'], ['general', 'Let’s talk'], ['review', 'Free review']] as const).map(([value, label]) => <label key={value} className="cursor-pointer">
            <input type="radio" name="intent" value={value} checked={intent === value} disabled={sending} onChange={() => chooseIntent(value)} className="peer sr-only" />
            <span className="flex min-h-[48px] items-center justify-center rounded-md px-1.5 py-2 text-center text-[.68rem] font-bold leading-[1.5] text-muted transition-colors peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal sm:text-[.75rem]">{label}</span>
          </label>)}
        </div>
      </fieldset>
      <div className="mt-7 mb-6">
        <h2 className="font-editorial text-[2rem] leading-[1.15] tracking-[-.02em]">{title}</h2>
        <p className="mt-2 text-[.78rem] leading-[1.85] text-muted">{intent === 'trial' ? 'A few details are all we need to plan your two-week free trial.' : intent === 'review' ? 'Tell us about one workflow and where the work gets stuck.' : 'Tell us which operational work your team needs covered.'}</p>
        {directEmailHref && <p className="mt-3 text-[.75rem] leading-6 text-muted">Prefer a quick hello? <a href={directEmailHref} className="font-semibold text-teal underline underline-offset-4 hover:text-ink">Email us directly</a>.</p>}
      </div>

      {!submitted ? <form onSubmit={handleSubmit} aria-busy={sending}>
        <div className="hidden" aria-hidden="true"><label htmlFor="website-confirm">Leave this field empty</label><input id="website-confirm" name="websiteConfirm" type="text" tabIndex={-1} autoComplete="off" /></div>
        <fieldset disabled={sending}>
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
          <div><label className="field-label" htmlFor="enquiry-name">Your name</label><input className="input-field" id="enquiry-name" name="name" autoComplete="name" required maxLength={100} value={fields.name} onChange={change('name')} /></div>
          <div><label className="field-label" htmlFor="enquiry-email">Work email</label><input className="input-field" type="email" id="enquiry-email" name="email" autoComplete="email" required maxLength={254} value={fields.email} onChange={change('email')} /></div>
          <div><label className="field-label" htmlFor="enquiry-company">Company</label><input className="input-field" id="enquiry-company" name="company" autoComplete="organization" required maxLength={200} value={fields.company} onChange={change('company')} /></div>
          <div><label className="field-label" htmlFor="enquiry-audience">You are part of</label><select className="input-field" id="enquiry-audience" name="audience" required value={fields.audience} onChange={change('audience')}><option value="">Select your business</option><option value="agency">An e-commerce agency</option><option value="brand">An e-commerce brand</option><option value="other">Another type of business</option></select></div>
          <div className="sm:col-span-2 md:col-span-1 xl:col-span-2"><label className="field-label" htmlFor="enquiry-service">Where do you need support?</label><select className="input-field" name="service" id="enquiry-service" value={fields.service} onChange={change('service')}>{SERVICE_OPTIONS.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          <div className="sm:col-span-2 md:col-span-1 xl:col-span-2"><label className="field-label" htmlFor="enquiry-challenge">What is slowing your team down?</label><textarea className="input-field min-h-[120px] resize-y leading-[1.7]" id="enquiry-challenge" name="challenge" rows={4} maxLength={2000} required value={fields.challenge} onChange={change('challenge')} placeholder="Tell us what happens today and where work gets stuck." aria-describedby="challenge-help" /><p className="field-help mt-2" id="challenge-help">Please leave out passwords, customer records and confidential information.</p></div>
        </div>

        <details open={extrasOpen} onToggle={e => setExtrasOpen(e.currentTarget.open)} className="mt-6 border-y border-line">
          <summary className="flex min-h-14 list-none items-center justify-between gap-2 py-4 text-[.76rem] font-bold marker:hidden [&::-webkit-details-marker]:hidden">
            <span>Add your website and workload</span><span className="ml-auto text-[.7rem] font-normal text-muted">Optional</span><ChevronDown className={`h-4 w-4 transition-transform ${extrasOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </summary>
          <div className="grid gap-4 pb-5 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
            <div className="sm:col-span-2 md:col-span-1 xl:col-span-2"><label className="field-label" htmlFor="enquiry-website">Website</label><input className="input-field" type="text" id="enquiry-website" name="website" inputMode="url" autoComplete="url" maxLength={300} placeholder="yourstore.com" value={fields.website} onChange={change('website')} /></div>
            <div><label className="field-label" htmlFor="enquiry-platform">Platform or tools</label><input className="input-field" id="enquiry-platform" name="platform" maxLength={200} placeholder="e.g. Shopify, Amazon" value={fields.platform} onChange={change('platform')} /></div>
            <div><label className="field-label" htmlFor="enquiry-workload">Approximate workload</label><input className="input-field" id="enquiry-workload" name="workload" maxLength={200} placeholder="e.g. 40 product updates a week" value={fields.workload} onChange={change('workload')} /></div>
          </div>
        </details>
        <label className="my-5 flex cursor-pointer items-start gap-2.5 text-[.76rem] leading-[1.7] text-muted"><input type="checkbox" name="remember" className="mt-1 h-4 w-4 shrink-0" checked={fields.remember} onChange={e => setFields(prev => ({ ...prev, remember: e.target.checked }))} />Remember this draft on this device</label>
        <p id="draft-notice" className="rounded-lg border border-[#dee7d7] bg-[#edf2e8] p-3.5 text-[.73rem] leading-[1.85] text-[#50604f]">{intent === 'trial' ? 'We’ll get in touch to agree your trial’s scope and start date. Sending this request doesn’t start any paid service.' : 'Send your enquiry straight to our team. We’ll get in touch to discuss a useful next step.'}</p>
        {sendError && <div role="alert" className="mt-4 rounded-lg border border-[#d9b7aa] bg-[#faf0e9] p-3.5 text-[.78rem] leading-6 text-[#7b4031]"><p>{sendError}</p>{directEmailHref && <a href={contactEmailHref(contactEmail, intent, summary)!} className="mt-1 inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"><Mail size={15} aria-hidden="true" />Email {contactEmail}</a>}</div>}
        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:flex-col md:items-stretch xl:flex-row xl:items-center">
          <button type="submit" disabled={sending} aria-describedby="draft-notice" className="btn-primary flex-1 disabled:cursor-wait disabled:opacity-60">{sending ? 'Sending your request…' : intent === 'trial' ? 'Let’s start my free trial' : 'Send my enquiry'} <ArrowUpRight size={18} aria-hidden="true" /></button>
        </div>
        </fieldset>
      </form> : <div aria-live="polite">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7efe3] text-teal"><Check size={22} strokeWidth={2} /></div>
        <h3 ref={requestHeading} tabIndex={-1} className="mt-4 scroll-mt-24 font-editorial text-[2rem] leading-[1.13] outline-none">Thanks. Your request is on its way.</h3>
        <p className="copy-muted mt-2 !text-[.82rem]">{intent === 'trial' ? 'We’ll get in touch to agree your workflow and trial start date. You can keep a copy of your request below.' : 'We’ll get in touch to talk through the support you need. You can keep a copy of your enquiry below.'}</p>
        <textarea readOnly aria-label="Your enquiry draft summary" className="input-field mt-5 min-h-[230px] resize-y whitespace-pre-wrap !bg-paper font-mono text-[.73rem] leading-[1.75]" value={summary} />
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button className="btn-primary !min-h-[47px]" type="button" onClick={copy}><Clipboard size={16} aria-hidden="true" /> Copy summary</button>
          <button className="btn-outline !min-h-[47px]" type="button" onClick={download}><Download size={16} aria-hidden="true" /> Download text</button>
          <button className="text-cta justify-center" type="button" onClick={() => {setSubmitted(false);setStatus('');}}><Pencil size={15} aria-hidden="true" /> Edit draft</button>
          <button className="text-cta justify-center" type="button" onClick={clearDraft}><RotateCcw size={15} aria-hidden="true" /> Clear draft</button>
        </div>
      </div>}
      {status && <p role="status" className="mt-4 text-[.75rem] leading-[1.75] text-teal">{status}</p>}
    </div>

    <aside className="order-2 max-w-[510px] md:order-1 md:pt-8">
      <Reveal>
        <Eyebrow>{context.intro.eyebrow}</Eyebrow>
        <h2 className="heading-editorial mt-5">{context.intro.title}</h2>
        <p className="copy-muted mt-5">{context.intro.description}</p>
      </Reveal>
      <div className="mt-7">
        {context.items.map((x,i) => <Reveal key={x.title} delay={i * .08} className="grid grid-cols-[34px_1fr] gap-4 border-t border-line py-5">
          <span className="number-chip">{String(i+1).padStart(2, '0')}</span>
          <div><h3 className="text-[.91rem] font-bold">{x.title}</h3><p className="mt-2 text-[.78rem] leading-[1.9] text-muted">{x.description}</p></div>
        </Reveal>)}
      </div>
      <Reveal><p className="mt-1 text-[.75rem] leading-[1.9] text-muted">{context.assurance}</p><ArrowLink href="/services" className="mt-3">See our service areas</ArrowLink></Reveal>
      {directEmailHref && <div className="mt-6 border-t border-line pt-5"><p className="text-[.75rem] text-muted">Prefer to write to us?</p><a href={directEmailHref} className="mt-1 inline-flex min-h-11 max-w-full items-center gap-2 break-all text-[.85rem] font-semibold text-teal underline underline-offset-4 hover:text-ink"><Mail size={16} className="shrink-0" aria-hidden="true" />{contactEmail}</a></div>}
    </aside>
  </div>;
}
