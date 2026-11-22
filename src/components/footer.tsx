import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp, Mail } from 'lucide-react';
import { enquiryHref } from '@/lib/links';
import { contactEmailHref } from '@/lib/contact';
import { contactEmail } from '@/lib/site';

export function Footer() {
  const emailHref = contactEmailHref(contactEmail);
  return <footer className="bg-paper">
    <div className="shell grid gap-10 border-t border-line py-11 sm:grid-cols-[1.5fr_1fr_1fr] sm:gap-9 lg:gap-16 lg:py-14">
      <div className="max-w-[330px]">
        <Link href="/" aria-label="Westford Operations home" className="inline-block">
          <Image src="/images/westford-logo.webp" alt="Westford Operations" width={248} height={49} className="h-auto w-[172px]" />
        </Link>
        <p className="mt-5 text-[.84rem] leading-[1.85] text-muted">Managed e-commerce operations for agencies and growing brands.</p>
        {emailHref && <a href={emailHref} className="mt-3 inline-flex min-h-10 items-center gap-2 break-all text-[.82rem] font-semibold text-teal underline underline-offset-4 hover:text-ink">
          <Mail size={15} className="shrink-0" aria-hidden="true" />{contactEmail}
        </a>}
      </div>
      <nav aria-label="Explore" className="flex flex-col items-start gap-1">
        <h2 className="mb-3 text-[.7rem] font-bold uppercase tracking-[.13em] text-teal">Explore</h2>
        <Link className="min-h-10 py-2 text-[.83rem] text-muted hover:text-teal" href="/services">Services</Link>
        <Link className="min-h-10 py-2 text-[.83rem] text-muted hover:text-teal" href="/#how-we-work">How we work</Link>
        <Link className="min-h-10 py-2 text-[.83rem] text-muted hover:text-teal" href="/about">About Westford</Link>
      </nav>
      <nav aria-label="Work with us" className="flex flex-col items-start gap-1">
        <h2 className="mb-3 text-[.7rem] font-bold uppercase tracking-[.13em] text-teal">Work with us</h2>
        <Link className="min-h-10 py-2 text-[.83rem] text-muted hover:text-teal" href="/agencies">For agencies</Link>
        <Link className="min-h-10 py-2 text-[.83rem] text-muted hover:text-teal" href="/brands">For brands</Link>
        <Link className="min-h-10 py-2 text-[.83rem] font-semibold text-teal hover:text-ink" href="/book">Book a meeting</Link>
        <Link className="min-h-10 py-2 text-[.83rem] text-muted hover:text-teal" href={enquiryHref('trial')}>Two-week free trial</Link>
      </nav>
    </div>
    <div className="shell flex flex-col items-start justify-between gap-2 border-t border-line py-5 text-[.73rem] text-muted sm:flex-row sm:items-center">
      <span>© {new Date().getFullYear()} Westford Operations</span>
      <Link href="#page-top" className="inline-flex min-h-10 items-center gap-2 hover:text-teal">Back to top <ArrowUp size={14} aria-hidden="true" /></Link>
    </div>
  </footer>;
}
