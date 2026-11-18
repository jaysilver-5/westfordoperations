import data from '@/data/content.json';
import { Reveal } from '@/components/animations';
import { ArrowLink, ClosingCta, EnquiryLink, FaqSection, NumberedList, PageHero, SectionIntro, ThreeStepList } from './ui';

type AudienceKind = 'agencies' | 'brands';

export function AudiencePage({ kind }: { kind: AudienceKind }) {
  const d = data[kind];
  return <main id="main-content">
    <PageHero data={d.hero}>
      {kind === 'agencies'
        ? <EnquiryLink mode="general" audience="agency" className="w-full max-w-[345px] sm:w-auto">Discuss agency support</EnquiryLink>
        : <EnquiryLink mode="review" audience="brand" className="w-full max-w-[345px] sm:w-auto">Get my free operations review</EnquiryLink>}
      <ArrowLink href="/services">Explore our services</ArrowLink>
    </PageHero>

    <section className="section-pad !pt-8 sm:!pt-12">
      <div className="shell grid items-start gap-10 md:grid-cols-[.87fr_1.13fr] md:gap-12 lg:gap-24">
        <Reveal className="mx-auto max-w-[450px] text-center md:mx-0 md:text-left"><SectionIntro data={d.split.intro} /></Reveal>
        <NumberedList items={d.split.points} />
      </div>
    </section>

    <section className="section-pad bg-softsage">
      <div className="shell">
        <Reveal className="mx-auto max-w-[700px] text-center"><SectionIntro data={d.support.intro} centered /></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {d.support.items.map((s, i) => <Reveal key={s.title} delay={i * .09} className="card-soft flex h-full flex-col p-6 sm:p-7">
            <h3 className="text-[1.04rem] font-bold leading-[1.55]">{s.title}</h3>
            <p className="mt-3 flex-1 text-[.8rem] leading-[1.9] text-muted">{s.description}</p>
            {s.action?.href && <ArrowLink className="mt-4 justify-between" href={s.action.href}>{s.action.label}</ArrowLink>}
          </Reveal>)}
        </div>
      </div>
    </section>

    <section className="section-pad">
      <div className="shell">
        <Reveal className="mx-auto max-w-[680px] text-center"><SectionIntro data={d.workflow.intro} centered /></Reveal>
        <ThreeStepList items={d.workflow.items} />
        {d.workflow.footnote && <Reveal className="mx-auto mt-9 max-w-[650px] text-center text-[.77rem] leading-[1.9] text-muted">{d.workflow.footnote}</Reveal>}
      </div>
    </section>
    <FaqSection data={d.faq} className="!pt-0" />
    <ClosingCta data={d.cta} />
  </main>;
}
