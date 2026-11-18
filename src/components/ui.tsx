import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Reveal } from './animations';
import { enquiryHref, type EnquiryMode } from '@/lib/links';
import type { ReactNode } from 'react';

export type Intro = { eyebrow: string; title: string; description: string };
export type Action = { label: string; href: string | null; mode: string | null; service: string | null; audience: string | null };
export type FaqData = { intro: Intro; items: { q: string; a: string }[] };
export type CtaData = { intro: Intro; action: Action | null };

export function Eyebrow({ children, inverse = false, className = '' }: { children: ReactNode; inverse?: boolean; className?: string }) {
  return <p className={`eyebrow ${inverse ? '!text-[#bfceaa]' : ''} ${className}`}>{children}</p>;
}

export function ArrowLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={`text-cta group ${className}`}>{children}<ArrowUpRight size={17} strokeWidth={1.7} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>;
}

export function PrimaryLink({ href, children, variant = 'primary', className = '' }: { href: string; children: ReactNode; variant?: 'primary' | 'light' | 'outline'; className?: string }) {
  const variantClass = { primary: 'btn-primary', light: 'btn-light', outline: 'btn-outline' }[variant];
  return <Link href={href} className={`${variantClass} group ${className}`}>{children}<ArrowUpRight aria-hidden="true" className="h-[17px] w-[17px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} /></Link>;
}

export function EnquiryLink({ mode = 'review', service, audience, children, className = '', variant = 'primary' }: { mode?: EnquiryMode; service?: string | null; audience?: string | null; children: ReactNode; className?: string; variant?: 'primary' | 'light' | 'outline' }) {
  return <PrimaryLink href={enquiryHref(mode, service, audience)} className={className} variant={variant}>{children}</PrimaryLink>;
}

export function ActionButton({ action, variant = 'primary', className = '' }: { action: Action | null | undefined; variant?: 'primary' | 'light' | 'outline'; className?: string }) {
  if (!action) return null;
  const href = action.href ?? enquiryHref(action.mode === 'general' ? 'general' : 'review', action.service, action.audience);
  return <PrimaryLink href={href} variant={variant} className={className}>{action.label}</PrimaryLink>;
}

export function SectionIntro({ data, centered = false, className = '', inverse = false }: { data: Intro; centered?: boolean; className?: string; inverse?: boolean }) {
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} ${className}`}>
      <Eyebrow inverse={inverse}>{data.eyebrow}</Eyebrow>
      <h2 className={`heading-editorial mt-4 ${inverse ? 'text-ivory' : ''}`}>{data.title}</h2>
      {data.description && <p className={`copy-muted mt-4 ${centered ? 'mx-auto' : ''} ${inverse ? '!text-[#c7d8d4]' : ''}`}>{data.description}</p>}
    </div>
  );
}

export function PageHero({ data, children }: { data: Intro; children?: ReactNode }) {
  return <section className="relative overflow-hidden px-0 pb-9 pt-7 text-center sm:pb-11 sm:pt-9 lg:pb-12 lg:pt-10">
    <div className="pointer-events-none absolute -top-72 left-1/2 h-[490px] w-[680px] -translate-x-1/2 rounded-full bg-[#e2ebdf]/45 blur-[100px]" aria-hidden="true" />
    <div className="shell relative z-10 mx-auto flex max-w-[850px] flex-col items-center">
      <Reveal onLoad delay={0.06}><Eyebrow>{data.eyebrow}</Eyebrow></Reveal>
      <Reveal onLoad delay={0.15} className="w-full">
        <h1 className="mt-4 font-editorial text-[clamp(2.35rem,5.3vw,3.5rem)] leading-[1.1] tracking-[-.025em] text-balance">{data.title}</h1>
      </Reveal>
      <Reveal onLoad delay={0.23} className="w-full">
        {data.description && <p className="copy-muted mx-auto mt-4 max-w-[645px] !text-[.9rem] sm:!text-[.9375rem]">{data.description}</p>}
      </Reveal>
      {children && <Reveal onLoad delay={0.3} className="mt-5 flex w-full flex-wrap items-center justify-center gap-3 sm:gap-6">{children}</Reveal>}
    </div>
  </section>;
}

export function FaqSection({ data, className = '' }: { data: FaqData; className?: string }) {
  return <section className={`section-pad ${className}`} aria-label="Frequently asked questions">
    <div className="shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
      <Reveal className="mx-auto max-w-[480px] text-center lg:mx-0 lg:text-left"><SectionIntro data={data.intro} /></Reveal>
      <Reveal delay={0.08} className="w-full">
        {data.items.map((item, i) => <details className="faq-item group" key={`${i}-${item.q}`}>
          <summary className="flex min-h-[56px] list-none items-center justify-between gap-4 py-4 text-left text-[.85rem] font-semibold leading-[1.75] marker:hidden sm:text-[.9rem] [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span><ChevronDown className="faq-chevron h-5 w-5 shrink-0 text-teal" strokeWidth={1.6} aria-hidden="true" />
          </summary>
          <p className="faq-answer max-w-[620px] pb-6 pr-7 text-[.81rem] leading-[1.95] text-muted">{item.a}</p>
        </details>)}
      </Reveal>
    </div>
  </section>;
}

export function ClosingCta({ data }: { data: CtaData }) {
  return <section className="section-pad overflow-hidden bg-palesage text-center">
    <Reveal className="shell mx-auto max-w-[760px]">
      <Eyebrow>{data.intro.eyebrow}</Eyebrow>
      <h2 className="heading-editorial mt-5">{data.intro.title}</h2>
      {data.intro.description && <p className="copy-muted mx-auto mt-5 max-w-[610px]">{data.intro.description}</p>}
      <div className="mt-7"> <ActionButton action={data.action} className="w-full max-w-[350px] sm:w-auto" /></div>
    </Reveal>
  </section>;
}

export function NumberedList({ items, inverse = false }: { items: { title: string; description: string }[]; inverse?: boolean }) {
  return <div className="w-full">
    {items.map((item, i) => <Reveal key={item.title} delay={Math.min(i * 0.07, 0.24)} className={`grid grid-cols-[2.15rem_1fr] gap-4 border-t py-4 first:border-0 first:pt-0 ${inverse ? 'border-white/20' : 'border-line'} `}>
      <span aria-hidden="true" className={`number-chip ${inverse ? '!bg-white/10 !text-[#bfceaa]' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
      <div><h3 className={`text-[.99rem] font-bold tracking-[-.025em] ${inverse ? 'text-white' : ''}`}>{item.title}</h3><p className={`mt-2 text-[.79rem] leading-[1.9] ${inverse ? 'text-[#c7d8d4]' : 'text-muted'}`}>{item.description}</p></div>
    </Reveal>)}
  </div>;
}

export function ThreeStepList({ items }: { items: { title: string; description: string }[] }) {
  return <ol className="mx-auto mt-8 grid max-w-[1040px] gap-7 md:grid-cols-3">
    {items.map((item, i) => <Reveal as="li" key={item.title} delay={i * 0.085} className="relative border-t border-line pt-6 md:border-t-0 md:pt-0">
      <span className="number-chip !border !border-[#cdd9cc] !bg-paper">{String(i + 1).padStart(2, '0')}</span>
      <h3 className="mt-5 text-[1rem] font-semibold">{item.title}</h3>
      <p className="mt-2 text-[.81rem] leading-[1.9] text-muted">{item.description}</p>
    </Reveal>)}
  </ol>;
}
