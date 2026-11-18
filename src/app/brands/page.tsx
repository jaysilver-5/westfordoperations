import type { Metadata } from 'next';
import { AudiencePage } from '@/components/audience-page';
export const metadata: Metadata = {
  title: 'For Brands | Westford Operations',
  description: 'Practical operational support for growing e-commerce brands. Keep store updates, order follow-ups and customer requests moving through an agreed process.',
};
export default function BrandsPage() { return <AudiencePage kind="brands" />; }
