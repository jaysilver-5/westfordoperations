import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';
import data from '@/data/content.json';
import { Reveal } from '@/components/animations';
import { ArrowLink, ClosingCta, EnquiryLink, FaqSection, PageHero, SectionIntro } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Services | Westford Operations',
  description: 'Explore managed e-commerce support across store and catalogue, orders, customer support, marketplaces, marketing and technical operations.',
};
const d = data.services;

export default function ServicesPage() {
  return <main id="main-content">
    <PageHero data={d.hero}><EnquiryLink mode="trial">Find your fit. Try 2 weeks free.</EnquiryLink></PageHero>
    <nav className="shell grid gap-x-7 rounded-xl border border-[#d7e2d0] bg-[#edf2e8] px-5 py-2 sm:grid-cols-2 sm:px-8 lg:grid-cols-3" aria-label="Service areas">
      {d.scopes.map((scope, i) => <Link key={scope.key} href={`#scope-${scope.key}`} className="group flex min-h-[68px] items-center gap-3 border-t border-[#d4dece] py-3.5 text-[.81rem] font-semibold first:border-t-0 hover:text-teal sm:[&:nth-child(2)]:border-t-0 lg:[&:nth-child(3)]:border-t-0">
        <span className="text-[.67rem] font-bold tabular-nums text-teal">{String(i + 1).padStart(2, '0')}</span>
        <span className="flex-1">{scope.title}</span>
        <ArrowDownRight size={17} strokeWidth={1.55} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
      </Link>)}
    </nav>

    <section aria-label="Service scopes" className="pb-10 pt-7 sm:pb-17 sm:pt-10">
      <div className="shell">
        {d.scopes.map((s) => <article id={s.id} key={s.key} className="scroll-mt-28 border-b border-line py-10 last:border-0 sm:py-12 lg:py-14">
          <div className="grid gap-6 md:grid-cols-[.87fr_1.13fr] md:gap-12 lg:gap-24">
            <Reveal>
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="mt-4 font-editorial text-[2.25rem] leading-[1.15] tracking-[-.025em] sm:text-[2.45rem]">{s.title}</h2>
              <p className="copy-muted mt-4 !text-[.86rem]">{s.description}</p>
            </Reveal>
            <Reveal delay={.1}>
              <ul className="check-list space-y-2">{s.tasks.map(task => <li key={task}>{task}</li>)}</ul>
              <p className="mt-5 text-[.76rem] leading-[1.9] text-muted">{s.condition}</p>
              <ArrowLink href={`/book?service=${encodeURIComponent(s.key)}`} className="mt-3">{s.action?.label ?? 'Discuss this service'}</ArrowLink>
            </Reveal>
          </div>
        </article>)}
      </div>
    </section>

    <section className="section-pad bg-softsage">
      <div className="shell">
        <Reveal className="mx-auto max-w-[650px] text-center"><SectionIntro data={d.approach.intro} centered /></Reveal>
        <div className="mx-auto mt-10 grid max-w-[1020px] gap-4 md:grid-cols-2 md:gap-6">
          {d.approach.columns.map((c, i) => <Reveal key={c.title} delay={i * .09} className="card-soft h-full p-6 sm:p-8">
            <h3 className="text-[.97rem] font-bold">{c.title}</h3>
            <ul className="check-list mt-4 space-y-2">{c.tasks.map(task => <li key={task}>{task}</li>)}</ul>
          </Reveal>)}
        </div>
        {d.approach.note && <p className="mt-7 text-center text-[.8rem] leading-[1.8] text-muted">{d.approach.note}</p>}
      </div>
    </section>
    <FaqSection data={d.faq} />
    <ClosingCta data={d.cta} />
  </main>;
}
