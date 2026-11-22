import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { EnquiryLink, Eyebrow } from './ui';
import { enquiryHref } from '@/lib/links';

export function TrialBanner() {
  return <aside aria-label="Two-week free trial offer" className="bg-forest text-ivory">
    <div className="shell flex min-h-11 flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center text-[.73rem] leading-5">
      <span className="inline-flex items-center gap-2"><Sparkles size={14} className="text-[#d4dfb8]" aria-hidden="true" /><strong className="font-semibold">A little breathing room for your team.</strong><span className="hidden text-white/75 sm:inline">Try Westford free for 2 weeks.</span></span>
      <Link href={enquiryHref('trial')} className="inline-flex min-h-7 items-center gap-2 font-bold text-[#e0e9c6] underline decoration-white/30 underline-offset-4 transition-colors hover:text-white focus-visible:!outline-white">Get my 2 weeks free<ArrowRight size={14} aria-hidden="true" /></Link>
    </div>
  </aside>;
}

export function TrialOffer() {
  return <section id="free-trial" aria-labelledby="trial-heading" className="section-pad bg-palesage">
    <div className="shell grid items-center gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
      <div>
        <Eyebrow>Two weeks. A fresh start.</Eyebrow>
        <h2 id="trial-heading" className="heading-editorial mt-4 max-w-[540px]">Less catching up.<br />More moving forward.</h2>
        <p className="copy-muted mt-4 max-w-[520px]">Let us take a piece of the day-to-day off your plate. Try Westford free for two weeks and see how a clearer workflow feels for your team.</p>
        <div className="mt-6"><EnquiryLink mode="trial">Let’s start my free trial</EnquiryLink></div>
        <p className="mt-3 text-[.73rem] leading-6 text-muted">We’ll agree the workflow, workload and start date together.</p>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-forest p-6 text-ivory sm:p-8">
        <div aria-hidden="true" className="absolute -right-12 -top-12 size-44 rounded-full border border-white/10" />
        <div className="relative flex items-baseline gap-3 border-b border-white/15 pb-5"><span className="font-editorial text-[4.5rem] leading-none text-[#dce6bc]">14</span><div><p className="text-sm font-semibold">days of support, on us.</p><p className="mt-1 text-[.73rem] text-white/70">Start with one agreed workflow.</p></div></div>
        <ul className="mt-5 space-y-4 text-[.8rem] leading-6">
          {['Tell us what’s taking your team’s time.', 'Agree a focused scope and get started.', 'See the work, review the fit, choose your next step.'].map(item => <li key={item} className="flex items-start gap-3"><Check size={16} className="mt-1 shrink-0 text-[#dce6bc]" aria-hidden="true" /><span>{item}</span></li>)}
        </ul>
      </div>
    </div>
  </section>;
}
