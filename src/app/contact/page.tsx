import type { Metadata } from 'next';
import data from '@/data/content.json';
import { ContactForm } from '@/components/contact-form';
import { FaqSection, PageHero } from '@/components/ui';
import type { EnquiryMode } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Contact & Free Operations Review | Westford Operations',
  description: 'Discuss your e-commerce operations or start with a free review of one workflow and a one-page plan with three practical next steps.',
};

type Query = { intent?: string | string[]; audience?: string | string[]; service?: string | string[] };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function ContactPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const intent: EnquiryMode = first(params.intent) === 'general' ? 'general' : 'review';
  return <main id="main-content">
    <PageHero data={data.contact.hero} />
    <section className="pb-17 sm:pb-22 lg:pb-27" aria-label="Your operations enquiry">
      <div className="shell">
        <ContactForm initialIntent={intent} initialService={first(params.service)} initialAudience={first(params.audience)} />
      </div>
    </section>
    <FaqSection data={data.contact.faq} className="bg-softsage" />
  </main>;
}
