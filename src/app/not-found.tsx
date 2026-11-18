import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Eyebrow } from '@/components/ui';

export default function NotFound() {
  return <main id="main-content" className="shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
    <Eyebrow>Page not found</Eyebrow>
    <h1 className="mt-6 font-editorial text-[clamp(3rem,8vw,5rem)] leading-[1.1]">This page isn&apos;t here.</h1>
    <p className="copy-muted mx-auto mt-5 max-w-lg">The link may have moved or the address may have changed. You can return to Westford Operations.</p>
    <Link href="/" className="btn-primary mt-8"><ArrowLeft size={18} aria-hidden="true" /> Back to home</Link>
  </main>;
}
