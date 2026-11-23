import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Check } from 'lucide-react';
import { normalizeBookingUrl } from '@/lib/booking';

// A public scheduling profile can be replaced with a specific event URL in Vercel.
const defaultBookingUrl = 'https://cal.com/westford';

export const metadata: Metadata = {
  title: 'Book an Appointment | Westford Operations',
  description: 'Book a conversation with Westford Operations. Choose an available time and receive your meeting invitation.',
};

export default function BookPage() {
  const bookingUrl = normalizeBookingUrl(
    process.env.BOOKING_URL || process.env.NEXT_PUBLIC_BOOKING_URL || defaultBookingUrl
  );

  return <main id="main-content" className="pb-20 pt-12 sm:pb-24 sm:pt-16">
    <div className="shell">
      <header className="mx-auto max-w-[720px] text-center">
        <p className="eyebrow">Talk to Westford</p>
        <h1 className="mt-4 font-editorial text-[clamp(2.7rem,5.5vw,4.15rem)] leading-[1.09] tracking-[-.03em]">
          Book a conversation.
        </h1>
        <p className="mx-auto mt-4 max-w-[510px] text-[.95rem] leading-[1.85] text-muted">
          A chance to discuss your operations and see where we can help.
        </p>
      </header>

      <section aria-labelledby="appointment-title" className="mx-auto mt-9 max-w-[740px] overflow-hidden rounded-2xl border border-[#d9e1d9] bg-ivory shadow-[0_18px_55px_-44px_#17343d45] sm:mt-11">
        <div className="flex items-start gap-5 p-6 sm:gap-6 sm:p-9">
          <div className="flex size-[54px] shrink-0 items-center justify-center rounded-xl bg-[#edf2e9] text-teal sm:size-[62px]">
            <CalendarDays size={28} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[.7rem] font-bold uppercase tracking-[.14em] text-teal">Westford Operations</p>
            <h2 id="appointment-title" className="mt-2 font-editorial text-[clamp(1.8rem,3vw,2.35rem)] leading-[1.18] tracking-[-.02em]">
              Introductory meeting
            </h2>
            <p className="mt-3 max-w-[430px] text-[.88rem] leading-[1.8] text-muted">
              Tell us about your business and the work you need help managing.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-line px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-9 sm:py-7">
          <div className="flex items-start gap-3">
            <Check size={18} strokeWidth={1.8} className="mt-1 shrink-0 text-teal" aria-hidden="true" />
            <p className="max-w-[360px] text-[.83rem] leading-[1.8] text-muted">
              Select a time and confirm your details. Cal.com will handle your calendar invitation.
            </p>
          </div>
          {bookingUrl ? <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full shrink-0 sm:w-auto sm:min-w-[186px]"
          >
            Choose a time <ArrowUpRight size={17} aria-hidden="true" />
          </a> : <span className="text-[.84rem] font-medium text-muted">Online scheduling is unavailable.</span>}
        </div>
      </section>

      {bookingUrl && <p className="mx-auto mt-4 max-w-[740px] text-center text-[.75rem] leading-6 text-muted">
        Booking opens on Cal.com in a new tab. Only available appointment times are shown.
      </p>}
      <p className="mx-auto mt-9 max-w-[740px] text-center text-[.83rem] leading-6 text-muted">
        Prefer to send a message?{' '}
        <Link href="/contact?intent=review#contact-form" className="font-semibold text-teal underline underline-offset-4 hover:text-ink">
          Make an enquiry
        </Link>
      </p>
    </div>
  </main>;
}
