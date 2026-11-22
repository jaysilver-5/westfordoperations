import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Check, LockKeyhole } from 'lucide-react';
import { normalizeBookingUrl } from '@/lib/booking';
import { SERVICE_OPTIONS } from '@/lib/enquiry';
import { enquiryHref } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Book a Meeting | Westford Operations',
  description: 'Choose a meeting time with Westford Operations. Book directly and receive a calendar invitation.',
};

type Query = { service?: string | string[]; audience?: string | string[] };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function BookPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const service = SERVICE_OPTIONS.find(([key]) => key !== 'unsure' && key === first(params.service))?.[1];
  const audience = first(params.audience);
  const audienceLabel = audience === 'agency' ? 'an e-commerce agency' : audience === 'brand' ? 'an e-commerce brand' : null;
  const bookingUrl = normalizeBookingUrl(process.env.BOOKING_URL || process.env.NEXT_PUBLIC_BOOKING_URL);

  return <main id="main-content" className="shell pb-20 pt-11 sm:pb-24 sm:pt-16 lg:pt-20">
    <div className="mb-11 max-w-[850px] sm:mb-12">
      <p className="eyebrow">Book a meeting</p>
      <h1 className="mt-4 font-editorial text-[clamp(3rem,5.5vw,4.75rem)] leading-[1.08] tracking-[-.035em] text-balance">
        Let’s talk about your <em className="font-normal text-teal">operations.</em>
      </h1>
      <p className="mt-5 max-w-[570px] text-[1rem] leading-[1.85] text-muted">
        Choose a time that works for you. We’ll discuss the work your team handles and where Westford may be able to help.
      </p>
    </div>

    <div className="grid items-stretch gap-5 lg:grid-cols-[.72fr_1.28fr] lg:gap-7">
      <aside className="rounded-2xl bg-forest p-7 text-white sm:p-9 lg:p-10">
        <p className="text-[.7rem] font-bold uppercase tracking-[.14em] text-[#c7dacd]">Introductory meeting</p>
        <h2 className="mt-4 font-editorial text-[2.35rem] leading-[1.14] tracking-[-.02em]">A useful first conversation.</h2>
        <p className="mt-4 text-[.86rem] leading-[1.9] text-[#d1ded9]">
          A chance to understand how things run today, the challenges you’re facing and the kind of support you need.
        </p>

        {(service || audienceLabel) && <div className="mt-7 border-t border-white/20 pt-6">
          <p className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#bdd2c8]">Your interest</p>
          <p className="mt-1.5 text-[.9rem] font-medium text-white">{service || audienceLabel}</p>
          <p className="mt-1 text-[.75rem] leading-6 text-[#d1ded9]">We can discuss other areas during the meeting too.</p>
        </div>}

        <div className="mt-8 border-t border-white/20 pt-7">
          <h3 className="text-[.9rem] font-semibold">What happens next</h3>
          <ol className="mt-5 space-y-5">
            {[
              ['Choose a time', 'Select an available date and time that suits your schedule.'],
              ['Confirm your details', 'Add your name and email in the booking calendar.'],
              ['Receive your invitation', 'Your confirmation and meeting details are sent automatically.'],
            ].map(([title, description], i) => <li key={title} className="flex items-start gap-4">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-[.69rem] font-bold text-[#d5e2d6]">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="text-[.86rem] font-semibold">{title}</p>
                <p className="mt-1 text-[.77rem] leading-[1.7] text-[#ccdad5]">{description}</p>
              </div>
            </li>)}
          </ol>
        </div>

        <div className="mt-10 flex items-start gap-2.5 border-t border-white/20 pt-6 text-[.76rem] leading-[1.75] text-[#d1ded9]">
          <LockKeyhole size={17} className="mt-0.5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
          <span>No passwords or customer records are needed for this meeting.</span>
        </div>
      </aside>

      <section aria-labelledby="booking-heading" className="min-w-0 overflow-hidden rounded-2xl border border-[#d9e1d9] bg-ivory shadow-[0_15px_55px_-38px_#17343d45]">
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-6 sm:px-9">
          <div className="flex items-center gap-3">
            <CalendarDays size={22} strokeWidth={1.7} className="shrink-0 text-teal" aria-hidden="true" />
            <div>
              <h2 id="booking-heading" className="text-[1.03rem] font-bold tracking-[-.015em]">Select an available time</h2>
              <p className="mt-1 text-[.78rem] text-muted">Dates and times come directly from our calendar.</p>
            </div>
          </div>
        </div>
        {bookingUrl ? <div className="px-2 pb-5 pt-4 sm:px-4 sm:pb-7">
          <iframe
            title="Choose and confirm a Westford Operations meeting time"
            src={bookingUrl}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="block min-h-[780px] w-full border-0 bg-white sm:min-h-[820px]"
          />
          <div className="mx-4 mt-3 flex items-center justify-center gap-2 text-center text-[.76rem] leading-6 text-muted">
            <Check size={15} className="shrink-0 text-teal" aria-hidden="true" />
            <span>Once booked, you’ll receive your calendar invitation and meeting details.</span>
          </div>
          <p className="mt-3 text-center text-[.75rem] leading-6">
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal underline underline-offset-4 hover:text-ink">Open the calendar in a new tab <ArrowUpRight size={13} className="inline" aria-hidden="true" /></a>
          </p>
        </div> : <div className="flex min-h-[470px] flex-col items-center justify-center px-7 py-14 text-center sm:px-12">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#e9f0e7] text-teal"><CalendarDays size={27} strokeWidth={1.5} aria-hidden="true" /></span>
          <h3 className="mt-6 max-w-[380px] font-editorial text-[2.25rem] leading-[1.16]">Online booking is not available yet.</h3>
          <p className="mt-4 max-w-[370px] text-[.85rem] leading-[1.85] text-muted">
            Our calendar is not connected. Booking will open here once availability and invitations are configured.
          </p>
        </div>}
      </section>
    </div>

    <p className="mt-9 text-center text-[.82rem] leading-7 text-muted">
      Prefer to describe your needs in writing?{' '}
      <Link href={enquiryHref('review')} className="font-semibold text-teal underline underline-offset-4 hover:text-ink">Request a free operations review</Link>
    </p>
  </main>;
}
