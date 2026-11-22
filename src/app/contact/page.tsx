import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ContactForm } from '@/components/contact-form';
import { parseEnquiryMode } from '@/lib/links';

type Query = { intent?: string | string[]; audience?: string | string[]; service?: string | string[] };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export async function generateMetadata({ searchParams }: { searchParams: Promise<Query> }): Promise<Metadata> {
  const params = await searchParams;
  return first(params.intent) === 'review'
    ? { title: 'Free Operations Review | Westford Operations', description: 'Share a workflow with Westford and request a free operations review.' }
    : { title: 'Start Your Two-Week Trial | Westford Operations', description: 'Tell us which e-commerce operations you need help with and request a two-week trial.' };
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const intent = parseEnquiryMode(first(params.intent));
  const service = first(params.service);
  const audience = first(params.audience);
  // Old discussion links should lead to the actual booking flow.
  if (intent === 'general') {
    const bookingParams = new URLSearchParams();
    if (service) bookingParams.set('service', service);
    if (audience) bookingParams.set('audience', audience);
    redirect('/book' + (bookingParams.size ? '?' + bookingParams.toString() : ''));
  }
  return <main id="main-content">
    <ContactForm key={`${intent}:${service || ''}:${audience || ''}`} initialIntent={intent} initialService={service} initialAudience={audience} />
  </main>;
}
