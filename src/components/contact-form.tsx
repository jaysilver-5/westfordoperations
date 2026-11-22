'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, LockKeyhole } from 'lucide-react';
import { enquiryHref, type EnquiryMode } from '@/lib/links';
import { SERVICE_OPTIONS, type EnquiryFields } from '@/lib/enquiry';

type Props = {
  initialIntent: EnquiryMode;
  initialService?: string;
  initialAudience?: string;
};

const emptyFields: EnquiryFields = {
  name: '', email: '', company: '', audience: '', service: 'unsure',
  challenge: '', website: '', platform: '', workload: '', remember: false,
};

export function ContactForm({ initialIntent, initialService, initialAudience }: Props) {
  const intent = initialIntent === 'review' ? 'review' : 'trial';
  const isTrial = intent === 'trial';
  const [fields, setFields] = useState<EnquiryFields>({
    ...emptyFields,
    // The incoming service is useful context, not a limit on what visitors can request.
    service: SERVICE_OPTIONS.some(([key]) => key === initialService) ? initialService! : 'unsure',
    audience: ['agency', 'brand', 'other'].includes(initialAudience ?? '') ? initialAudience! : '',
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef<string | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted || error) feedbackRef.current?.focus();
  }, [submitted, error]);

  const change = (name: keyof EnquiryFields) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFields(previous => ({ ...previous, [name]: event.target.value }));
    requestId.current = null;
    if (error) setError('');
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const websiteConfirm = new FormData(event.currentTarget).get('websiteConfirm') ?? '';
    setSending(true);
    setError('');
    requestId.current ??= crypto.randomUUID();

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, intent, requestId: requestId.current, websiteConfirm }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (!response.ok || result?.ok !== true) {
        setError(result?.error || 'Your request could not be sent. Please try again.');
        return;
      }
      requestId.current = null;
      setSubmitted(true);
    } catch {
      setError('We could not connect to send your request. Please try again.');
    } finally {
      setSending(false);
    }
  }

  const secondaryHref = enquiryHref(isTrial ? 'review' : 'trial');

  return <section className="shell grid items-start gap-10 py-11 sm:py-16 lg:grid-cols-[.78fr_1.22fr] lg:gap-20 lg:py-24" aria-label="Get started with Westford">
    <div className="max-w-[500px] lg:sticky lg:top-28 lg:pt-6">
      <p className="eyebrow">{isTrial ? 'Two weeks, on us' : 'Free operations review'}</p>
      <h1 className="mt-5 font-editorial text-[clamp(2.9rem,5vw,4.45rem)] leading-[1.075] tracking-[-.035em] text-balance">
        Tell us where you need <em className="font-normal text-teal">support.</em>
      </h1>
      <p className="mt-6 max-w-[450px] text-[1rem] leading-[1.85] text-muted">
        From store updates and orders to customer support, tell us what your team needs help with. One area or several — we'll work through the details with you.
      </p>
      <div className="mt-10 max-w-[425px] border-t border-line pt-6">
        <h2 className="text-[.82rem] font-bold text-ink">{isTrial ? 'How the free trial works' : 'What the review covers'}</h2>
        <p className="mt-2 text-[.87rem] leading-[1.9] text-muted">
          {isTrial
            ? 'We’ll confirm the workload, approvals and start date before your two-week trial begins. There is no paid commitment.'
            : 'We’ll look at one workflow and share three practical next steps. No store access is needed for the review.'}
        </p>
      </div>
      <div className="mt-7 flex items-center gap-2.5 text-[.8rem] text-muted">
        <LockKeyhole size={17} className="shrink-0 text-teal" strokeWidth={1.7} aria-hidden="true" />
        <span>No passwords or customer records needed.</span>
      </div>
    </div>

    <div id="contact-form" className="min-w-0 scroll-mt-28 rounded-2xl border border-[#d9e1d9] bg-ivory p-6 shadow-[0_15px_55px_-38px_#17343d45] sm:p-9 lg:p-10">
      {submitted ? <div ref={feedbackRef} tabIndex={-1} className="py-9 outline-none" role="status">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#e8f0e7] text-teal"><Check size={23} strokeWidth={2} aria-hidden="true" /></span>
        <h2 className="mt-6 font-editorial text-[2.7rem] leading-[1.1] tracking-[-.02em]">Your request is with us.</h2>
        <p className="mt-4 max-w-md text-[.92rem] leading-[1.85] text-muted">
          Thank you for sharing the details. We’ll review your request and get in touch to discuss the next step.
        </p>
        <Link href="/services" className="text-cta mt-7">Explore our services <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div> : <>
        <div className="border-b border-line pb-6">
          <p className="text-[.7rem] font-bold uppercase tracking-[.12em] text-teal">{isTrial ? 'Free trial enquiry' : 'Operations review enquiry'}</p>
          <h2 className="mt-3 font-editorial text-[2.2rem] leading-[1.16] tracking-[-.025em]">A little about your business.</h2>
          <p className="mt-2 max-w-[450px] text-[.85rem] leading-[1.8] text-muted">Tell us what you need. You don’t have to choose a service or know exactly where to start.</p>
        </div>
        <form className="mt-7" onSubmit={handleSubmit} aria-busy={sending}>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website-confirm">Leave this field empty</label>
            <input id="website-confirm" name="websiteConfirm" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <fieldset disabled={sending} className="min-w-0">
            <div>
              <label htmlFor="enquiry-challenge" className="field-label">What would you like help with? <span aria-hidden="true">*</span></label>
              <textarea id="enquiry-challenge" name="challenge" className="input-field min-h-[175px] resize-y leading-[1.8]" rows={5} required maxLength={2000} value={fields.challenge} onChange={change('challenge')} placeholder="Tell us about the tasks, challenges or day-to-day work you'd like help managing." />
              <p className="field-help mt-2">A short description is fine. You can mention as many areas as you need.</p>
            </div>
            <div className="mt-7 grid gap-x-4 gap-y-5 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="enquiry-name">Full name <span aria-hidden="true">*</span></label>
                <input className="input-field" id="enquiry-name" name="name" autoComplete="name" required maxLength={100} value={fields.name} onChange={change('name')} placeholder="Your name" />
              </div>
              <div>
                <label className="field-label" htmlFor="enquiry-email">Work email <span aria-hidden="true">*</span></label>
                <input className="input-field" id="enquiry-email" name="email" type="email" autoComplete="email" required maxLength={254} value={fields.email} onChange={change('email')} placeholder="you@company.com" />
              </div>
              <div>
                <label className="field-label" htmlFor="enquiry-company">Company <span aria-hidden="true">*</span></label>
                <input className="input-field" id="enquiry-company" name="company" autoComplete="organization" required maxLength={200} value={fields.company} onChange={change('company')} placeholder="Business name" />
              </div>
              <div>
                <label className="field-label" htmlFor="enquiry-audience">Business type <span aria-hidden="true">*</span></label>
                <select className="input-field" id="enquiry-audience" name="audience" required value={fields.audience} onChange={change('audience')}>
                  <option value="">Select one</option>
                  <option value="agency">E-commerce agency</option>
                  <option value="brand">E-commerce brand</option>
                  <option value="other">Other business</option>
                </select>
              </div>
            </div>
            <div className="mt-5">
              <label className="field-label" htmlFor="enquiry-website">Website <span className="font-normal text-muted">(optional)</span></label>
              <input className="input-field" id="enquiry-website" name="website" type="text" inputMode="url" autoComplete="url" maxLength={300} value={fields.website} onChange={change('website')} placeholder="yourbusiness.com" />
            </div>
            {error && <div ref={feedbackRef} tabIndex={-1} role="alert" className="mt-6 rounded-lg border border-[#e2c9bd] bg-[#fff7f3] p-4 text-[.84rem] leading-[1.75] text-[#8a4537] outline-none">{error}</div>}
            <button type="submit" disabled={sending} className="btn-primary mt-7 !min-h-13 w-full !rounded-lg !text-[.92rem] disabled:cursor-wait disabled:opacity-60">
              {sending ? 'Sending request…' : isTrial ? 'Request my free trial' : 'Request my free review'}
              {!sending && <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />}
            </button>
            <p className="mt-3 text-center text-[.77rem] leading-[1.75] text-muted">We’ll discuss the details before any work begins.</p>
          </fieldset>
        </form>
      </>}
      <div className="mt-7 border-t border-line pt-5 text-center text-[.8rem] leading-6 text-muted">
        <span>{isTrial ? 'Prefer a review first?' : 'Ready to try Westford?'}</span>{' '}
        <Link href={secondaryHref} className="font-semibold text-teal underline underline-offset-4 hover:text-ink">{isTrial ? 'Request a free review' : 'Explore the two-week trial'}</Link>
        <span className="mx-2 text-[#bcc9bd]">·</span>
        <Link href="/book" className="font-semibold text-teal underline underline-offset-4 hover:text-ink">Book a meeting</Link>
      </div>
    </div>
  </section>;
}
