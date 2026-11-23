'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { type EnquiryMode } from '@/lib/links';
import { type EnquiryFields } from '@/lib/enquiry';

type Props = {
  initialIntent: EnquiryMode;
  initialService?: string;
  initialAudience?: string;
};

export function ContactForm({ initialIntent, initialService, initialAudience }: Props) {
  const intent = initialIntent === 'review' ? 'review' : 'trial';
  const isTrial = intent === 'trial';
  const [fields, setFields] = useState<EnquiryFields>({
    name: '', email: '', company: '', challenge: '',
    // Keep optional context from the referring page, without asking visitors to select a category.
    audience: ['agency', 'brand', 'other'].includes(initialAudience ?? '') ? initialAudience! : 'unspecified',
    service: ['store', 'orders', 'support', 'marketplaces', 'marketing', 'technical'].includes(initialService ?? '') ? initialService! : 'unsure',
    website: '', platform: '', workload: '', remember: false,
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
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      setError('We could not send your request right now. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return <section className="shell max-w-[840px] pb-20 pt-9 sm:pb-24 sm:pt-14" aria-labelledby="enquiry-heading">
    <div className="max-w-[720px]">
      <p className="eyebrow">{isTrial ? 'Two-week free trial' : 'Free operations review'}</p>
      <h1 id="enquiry-heading" className="mt-3 font-editorial text-[clamp(2.7rem,5.7vw,4.25rem)] leading-[1.1] tracking-[-.03em]">
        {isTrial ? 'Tell us what you need.' : 'Tell us what needs a closer look.'}
      </h1>
      <p className="mt-3 max-w-[570px] text-[.95rem] leading-[1.8] text-muted">
        Share a few details. We’ll reply by email to arrange the next step.
      </p>
    </div>

    <div id="contact-form" className="mt-8 scroll-mt-24 border-t border-line pt-7 sm:mt-9 sm:pt-9">
      {submitted ? <div ref={feedbackRef} role="status" tabIndex={-1} className="max-w-[640px] py-6 outline-none">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#e8f0e7] text-teal"><Check size={21} aria-hidden="true" /></span>
        <h2 className="mt-5 font-editorial text-[2.7rem] leading-[1.13]">Request sent.</h2>
        <p className="mt-3 text-[.95rem] leading-[1.8] text-muted">
          Thank you. We’ve received your request and will get back to you by email.
        </p>
        <Link href="/" className="text-cta mt-6">Back to homepage <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div> : <form onSubmit={handleSubmit} aria-busy={sending} className="max-w-[730px]">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website-confirm">Leave this field empty</label>
          <input id="website-confirm" name="websiteConfirm" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <fieldset disabled={sending} className="min-w-0">
          <div>
            <label className="field-label" htmlFor="enquiry-challenge">How can we help?</label>
            <textarea
              id="enquiry-challenge"
              name="challenge"
              className="input-field min-h-[150px] resize-y leading-[1.8]"
              rows={4}
              required
              maxLength={2000}
              value={fields.challenge}
              onChange={change('challenge')}
              placeholder="Tell us briefly what you need help with."
            />
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="enquiry-name">Your name</label>
              <input className="input-field" id="enquiry-name" name="name" autoComplete="name" required maxLength={100} value={fields.name} onChange={change('name')} placeholder="Full name" />
            </div>
            <div>
              <label className="field-label" htmlFor="enquiry-email">Email address</label>
              <input className="input-field" id="enquiry-email" name="email" type="email" autoComplete="email" required maxLength={254} value={fields.email} onChange={change('email')} placeholder="you@company.com" />
            </div>
          </div>
          <div className="mt-5">
            <label className="field-label" htmlFor="enquiry-company">Business name <span className="font-normal text-muted">(optional)</span></label>
            <input className="input-field" id="enquiry-company" name="company" autoComplete="organization" maxLength={200} value={fields.company} onChange={change('company')} placeholder="Your company or store" />
          </div>
          {error && <div ref={feedbackRef} tabIndex={-1} role="alert" className="mt-5 rounded-lg border border-[#dfc6bd] bg-[#fff7f3] p-4 text-[.86rem] leading-[1.7] text-[#844537] outline-none">{error}</div>}
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <button type="submit" disabled={sending} className="btn-primary min-w-[195px] disabled:cursor-wait disabled:opacity-60">
              {sending ? 'Sending…' : 'Send request'}
              {!sending && <ArrowUpRight size={17} aria-hidden="true" />}
            </button>
            <span className="text-[.78rem] leading-6 text-muted">No commitment. No sensitive information needed.</span>
          </div>
        </fieldset>
      </form>}
    </div>

    <p className="mt-8 border-t border-line pt-6 text-[.85rem] text-muted">
      Prefer a conversation?{' '}
      <Link href="/book" className="font-semibold text-teal underline underline-offset-4 hover:text-ink">Book a meeting</Link>
    </p>
  </section>;
}
