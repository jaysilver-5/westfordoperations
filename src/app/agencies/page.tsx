import type { Metadata } from 'next';
import { AudiencePage } from '@/components/audience-page';
export const metadata: Metadata = {
  title: 'For Agencies | Westford Operations',
  description: 'Managed e-commerce operations behind your agency. Scope recurring client-store work, white-label delivery, clear handoffs and reporting around your process.',
};
export default function AgenciesPage() { return <AudiencePage kind="agencies" />; }
