import type { Metadata } from 'next';
import data from '@/data/content.json';
import { Reveal } from '@/components/animations';
import { ArrowLink, ClosingCta, EnquiryLink, PageHero, SectionIntro } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About | Westford Operations',
  description: 'Learn how Westford approaches managed e-commerce operations for agencies and growing brands, with clear scope, documented processes and accountable work.',
};
const d = data.about;

export default function AboutPage() {
  return <main id="main-content">
    <PageHero data={d.hero}><EnquiryLink mode="trial">Get to know us. Try 2 weeks free.</EnquiryLink><ArrowLink href="/services">Explore our services</ArrowLink></PageHero>
    <section className="section-pad !pt-8 sm:!pt-12">
      <div className="shell grid items-start gap-8 md:grid-cols-[.87fr_1.13fr] md:gap-13 lg:gap-24">
        <Reveal className="mx-auto max-w-[470px] text-center md:mx-0 md:text-left"><SectionIntro data={d.statement.intro} /></Reveal>
        <Reveal delay={.1} className="space-y-5">
          {d.statement.paragraphs.map((paragraph,i) => <p key={i} className="text-[.89rem] leading-[1.95] text-muted">{paragraph}</p>)}
        </Reveal>
      </div>
    </section>
    <section className="section-pad relative overflow-hidden bg-forest text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-64 -top-52 h-[520px] w-[520px] rounded-full border border-white/10 shadow-[0_0_0_68px_#aec9b108,0_0_0_138px_#aec9b106]" />
      <div className="shell relative z-10">
        <Reveal className="mx-auto max-w-[680px] text-center"><SectionIntro data={d.principles.intro} inverse centered /></Reveal>
        <div className="mx-auto mt-12 grid max-w-[1010px] gap-x-17 gap-y-7 md:grid-cols-2 md:gap-y-10">
          {d.principles.items.map((p, i) => <Reveal key={p.title} delay={i * .075} className="grid grid-cols-[26px_1fr] gap-4 border-t border-white/20 pt-6">
            <span className="pt-1 text-[.72rem] font-semibold tabular-nums text-[#bfceaa]">{String(i+1).padStart(2,'0')}</span>
            <div><h3 className="text-[1.04rem] font-semibold">{p.title}</h3><p className="mt-2 text-[.8rem] leading-[1.9] text-[#c7d8d4]">{p.description}</p></div>
          </Reveal>)}
        </div>
      </div>
    </section>
    <section className="section-pad">
      <div className="shell">
        <Reveal className="mx-auto max-w-[700px] text-center"><SectionIntro data={d.audiences.intro} centered /></Reveal>
        <div className="mx-auto mt-10 grid max-w-[1030px] gap-4 md:grid-cols-2 md:gap-6">
          {d.audiences.items.map((item, i) => <Reveal key={item.title} delay={i * .09} className="card-soft flex h-full flex-col p-7 sm:p-9">
            <h3 className="font-editorial text-[2rem] leading-[1.15]">{item.title}</h3>
            <p className="mt-4 flex-1 text-[.84rem] leading-[1.9] text-muted">{item.description}</p>
            {item.action?.href && <ArrowLink href={item.action.href} className="mt-5">{item.action.label}</ArrowLink>}
          </Reveal>)}
        </div>
      </div>
    </section>
    <ClosingCta data={d.cta} />
  </main>;
}
