import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Mail, MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react';
import { normalizeBookingUrl } from '@/lib/booking';
import { contactEmailHref } from '@/lib/contact';
import { contactEmail } from '@/lib/site';
import { SERVICE_OPTIONS } from '@/lib/enquiry';
import { enquiryHref } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Book a Meeting | Westford Operations',
  description: 'Choose an available time to discuss managed e-commerce operations, recurring workflows, and support for your team.',
};

type Query = { service?: string | string[]; audience?: string | string[] };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function BookPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const service = SERVICE_OPTIONS.find(([key]) => key === first(params.service))?.[1];
  const audience = first(params.audience);
  const audienceLabel = audience === 'agency' ? 'E-commerce agency' : audience === 'brand' ? 'E-commerce brand' : undefined;
  const bookingUrl = normalizeBookingUrl(process.env.NEXT_PUBLIC_BOOKING_URL);
  const emailHref = contactEmailHref(contactEmail, 'general');

  return <main id="main-content" className="relative overflow-hidden">
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#e6eee5] opacity-75 blur-[110px]" />
    <div className="shell relative z-10 pb-20 pt-10 sm:pb-24 sm:pt-14 lg:pt-16">
      <div className="mx-auto mb-10 max-w-[790px] text-center sm:mb-12">
        <p className="eyebrow">A good conversation is a good start</p>
        <h1 className="mt-4 font-editorial text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[1.08] tracking-[-.035em] text-balance">
          Let’s find a better way to <em className="text-teal">run the day-to-day.</em>
        </h1>
        <p className="copy-muted mx-auto mt-5 max-w-[610px] !text-[1rem]">Book an introductory conversation. Tell us where work gets stuck, and we’ll explore whether Westford is the right fit.</p>
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-[.76fr_1.24fr] lg:gap-7">
        <aside className="relative overflow-hidden rounded-[1.75rem] bg-forest p-7 text-white sm:p-9 lg:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10 shadow-[0_0_0_52px_#aec9b108,0_0_0_104px_#aec9b108]" />
          <div className="relative flex h-full flex-col">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10"><MessageSquareText size={23} strokeWidth={1.65} aria-hidden="true" /></div>
            <p className="mt-7 text-[.67rem] font-bold uppercase tracking-[.17em] text-[#bed2c5]">Meet Westford</p>
            <h2 className="mt-3 font-editorial text-[2.35rem] leading-[1.1]">A conversation with purpose.</h2>
            <p className="mt-4 text-[.86rem] leading-[1.9] text-[#cfe0da]">No long sales presentation. Just an opportunity to understand your operations and discuss a practical next step.</p>

            {(service || audienceLabel) && <div className="mt-6 rounded-xl border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-[.68rem] uppercase tracking-[.12em] text-[#c3d6cd]">You’re interested in</p>
              <p className="mt-1 text-[.87rem] font-semibold">{service || audienceLabel}</p>
            </div>}

            <div className="mt-8 space-y-6 border-t border-white/20 pt-7">
              {[
                { icon: Clock3, title: 'Find a convenient time', copy: 'Select an available slot in your own time zone.' },
                { icon: ShieldCheck, title: 'Tell us what matters', copy: 'You won’t need to share credentials or private customer data.' },
                { icon: Check, title: 'Leave with a clear next step', copy: 'We’ll discuss what makes sense before agreeing any work.' },
              ].map(({ icon: Icon, title, copy }) => <div key={title} className="flex gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#d9e7ce]"><Icon size={17} strokeWidth={1.8} aria-hidden="true" /></div>
                <div><h3 className="text-[.88rem] font-semibold">{title}</h3><p className="mt-1 text-[.78rem] leading-[1.7] text-[#c0d3cc]">{copy}</p></div>
              </div>)}
            </div>

            <div className="mt-auto pt-9">
              <div className="border-t border-white/20 pt-6">
                <p className="text-[.76rem] text-[#c0d3cc]">Would you rather start in writing?</p>
                <Link className="mt-2 inline-flex items-center gap-2 text-[.84rem] font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white" href={enquiryHref('trial')}>Request a two-week free trial <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </aside>

        <section aria-labelledby="booking-heading" className="min-w-0 overflow-hidden rounded-[1.75rem] border border-[#d9e2d8] bg-ivory shadow-[0_22px_70px_-40px_#17343d4a]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e5eae2] px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#edf2e9] text-teal"><CalendarDays size={21} strokeWidth={1.8} aria-hidden="true" /></div>
              <div><h2 id="booking-heading" className="text-[1.1rem] font-bold tracking-[-.03em] sm:text-[1.2rem]">Choose a time to talk</h2><p className="mt-1 text-[.79rem] leading-[1.7] text-muted">See live availability and reserve a meeting.</p></div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d7e4d6] bg-[#eff5eb] px-3 py-1.5 text-[.7rem] font-semibold text-teal"><Sparkles size={13} aria-hidden="true" /> Introductory call</span>
          </div>
          {bookingUrl ? <div className="px-2 pb-5 pt-3 sm:px-4 sm:pb-6">
            <iframe title="Westford Operations meeting scheduling calendar" src={bookingUrl} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className="block min-h-[760px] w-full border-0 bg-white sm:min-h-[800px]" />
            <p className="px-3 pt-3 text-center text-[.75rem] leading-6 text-muted">Having trouble with the calendar? <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-teal underline underline-offset-4">Open the booking page <ArrowUpRight size={13} className="inline" aria-hidden="true" /></a></p>
          </div> : <div className="flex min-h-[510px] flex-col items-center justify-center px-6 py-14 text-center sm:px-12">
            <div className="flex size-16 items-center justify-center rounded-[1.25rem] border border-[#dce6d9] bg-[#edf2e9] text-teal"><CalendarDays size={29} strokeWidth={1.5} aria-hidden="true" /></div>
            <h3 className="mt-6 max-w-md font-editorial text-[2.15rem] leading-[1.15]">Our booking calendar is being connected.</h3>
            <p className="mt-3 max-w-sm text-[.86rem] leading-[1.85] text-muted">We’re not displaying unverified appointment times. In the meantime, reach us directly to arrange a conversation.</p>
            {emailHref && <a className="btn-primary mt-6" href={emailHref}><Mail size={17} aria-hidden="true" /> Email to arrange a call <ArrowRight size={17} aria-hidden="true" /></a>}
            <p className="mt-5 max-w-sm text-[.75rem] leading-6 text-muted">Once Westford’s scheduling link is connected, available dates and times will appear here automatically.</p>
          </div>}
        </section>
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[.8rem] text-muted">
        <span>Not ready to schedule?</span>
        <Link href={enquiryHref('review')} className="inline-flex items-center gap-2 font-semibold text-teal hover:underline">Request a free operations review <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </div>
  </main>;
}
