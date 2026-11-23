import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { BookingEmbed } from '@/components/booking-embed';
import { normalizeBookingUrl } from '@/lib/booking';

// Public Cal.com profile supplied by Westford. An environment variable can override it.
export const defaultBookingUrl = 'https://cal.com/westford';

export const metadata: Metadata = {
  title: 'Talk to Us | Westford Operations',
  description: 'Choose an available date and time to speak with Westford Operations. Confirm your meeting and receive a calendar invitation.',
};

export default function BookPage() {
  const bookingUrl = normalizeBookingUrl(process.env.BOOKING_URL || process.env.NEXT_PUBLIC_BOOKING_URL || defaultBookingUrl);

  return <main id="main-content" className="pb-20 pt-5 sm:pb-24 sm:pt-9">
    <div className="shell">
      <div className="mb-5 sm:mb-7">
        <p className="eyebrow">Westford Operations / Meetings</p>
        <h1 className="mt-2 font-editorial text-[clamp(2.25rem,4.2vw,3.3rem)] leading-[1.1] tracking-[-.025em]">Choose a time to talk.</h1>
        <p className="mt-2 max-w-[640px] text-[.9rem] leading-7 text-muted">
          Pick an available time, confirm your details, and receive your calendar invitation.
        </p>
      </div>

      <section aria-label="Meeting calendar" className="-mx-5 overflow-hidden border-y border-[#d9e1d9] bg-ivory sm:mx-0 sm:rounded-2xl sm:border sm:shadow-[0_15px_55px_-38px_#17343d45]">
        {bookingUrl ? <>
          <BookingEmbed url={bookingUrl} />
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-line px-5 py-4 sm:px-8">
            <p className="text-[.76rem] leading-6 text-muted">Times shown are live and adjusted to your time zone.</p>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[.78rem] font-semibold text-teal underline underline-offset-4 hover:text-ink">
              Open calendar separately <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </> : <div className="flex min-h-[410px] flex-col items-center justify-center px-6 py-14 text-center sm:min-h-[520px]">
          <CalendarDays size={30} strokeWidth={1.4} className="text-teal" aria-hidden="true" />
          <h2 className="mt-6 font-editorial text-[2rem] leading-[1.2]">Booking is not available yet.</h2>
          <p className="mt-3 max-w-[360px] text-[.87rem] leading-[1.8] text-muted">
            Our scheduling calendar has not been connected. Available appointments will appear here once it is ready.
          </p>
        </div>}
      </section>

      <div className="mt-7 flex flex-col justify-between gap-3 border-t border-line pt-6 text-[.82rem] leading-7 text-muted sm:flex-row sm:gap-6">
        <p>We’ll talk about your day-to-day operations and where additional support could help.</p>
        <p className="shrink-0">No store access or customer data needed.</p>
      </div>
      <div className="mt-3 text-[.78rem] text-muted">
        Looking for a free trial instead?{' '}
        <Link href="/contact?intent=trial#contact-form" className="font-semibold text-teal underline underline-offset-4 hover:text-ink">Make an enquiry</Link>
      </div>
    </div>
  </main>;
}
