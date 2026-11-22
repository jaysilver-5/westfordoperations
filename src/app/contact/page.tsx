import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import data from '@/data/content.json';
import { ContactForm } from '@/components/contact-form';
import { FaqSection, PageHero } from '@/components/ui';
import { parseEnquiryMode } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Start Your Free Trial | Westford Operations',
  description: 'Try Westford free for two weeks. Tell us about your store operations and we’ll agree a workflow and start date together.',
};

type Query = { intent?: string | string[]; audience?: string | string[]; service?: string | string[] };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function ContactPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const intent = parseEnquiryMode(first(params.intent));
  // Legacy general-enquiry CTAs now open live meeting scheduling.
  if (intent === 'general') {
    const bookingParams = new URLSearchParams();
    const service = first(params.service);
    const audience = first(params.audience);
    if (service) bookingParams.set('service', service);
    if (audience) bookingParams.set('audience', audience);
    redirect('/book' + (bookingParams.size ? '?' + bookingParams.toString() : ''));
  }
  return <main id="main-content">
    <PageHero data={intent === 'trial' ? data.contact.trialHero : data.contact.hero} />
    <section className="pb-17 sm:pb-22 lg:pb-27" aria-label="Your operations enquiry">
      <div className="shell">
        <ContactForm initialIntent={intent} initialService={first(params.service)} initialAudience={first(params.audience)} />
      </div>
    </section>
    <FaqSection data={data.contact.faq} className="bg-softsage" />
  </main>;
}
