import type { Metadata } from 'next';
import Image from 'next/image';
import data from '@/data/content.json';
import { Reveal } from '@/components/animations';
import { ArrowLink, EnquiryLink, Eyebrow, SectionIntro } from '@/components/ui';
import { ServiceCards } from '@/components/service-cards';
import { TrialOffer } from '@/components/trial-offer';

export const metadata: Metadata = {
  title: 'Westford Operations | Keep your stores moving',
  description: 'Try Westford free for two weeks. Managed e-commerce operations for agencies and growing brands, from store updates to orders and customer support.',
};

const h = data.home;

export default function HomePage() {
  return <main id="main-content">
    <section id="home" aria-labelledby="hero-heading" className="pb-10 pt-9 sm:pb-12 sm:pt-12 lg:pb-14 lg:pt-14">
      <div className="shell">
        <div className="mx-auto max-w-[840px] text-center">
          <Reveal onLoad delay={0.03}>
            <Eyebrow>Managed e-commerce operations</Eyebrow>
            <h1 id="hero-heading" className="mx-auto mt-5 max-w-[800px] text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-[1.1] tracking-[-.052em] text-balance">
              Keep your stores moving.
              <span className="block font-editorial text-[1.08em] font-normal italic tracking-[-.03em] text-teal">We’ll handle the details.</span>
            </h1>
          </Reveal>
          <Reveal onLoad delay={0.12}>
            <p className="mx-auto mt-5 max-w-[570px] text-[.96rem] leading-[1.85] text-muted sm:text-[1.04rem]">
              Product updates, orders and customer support, managed with care for growing brands and agencies.
            </p>
          </Reveal>
          <Reveal onLoad delay={0.2} className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <EnquiryLink mode="trial">Start a free trial</EnquiryLink>
            <ArrowLink href="/book">Talk to us</ArrowLink>
          </Reveal>
        </div>
        <Reveal onLoad delay={0.25} distance={12} className="relative mx-auto mt-9 h-[190px] overflow-hidden rounded-xl sm:mt-11 sm:h-[260px] lg:mt-12 lg:h-[300px]">
          <Image
            src="/images/westford-workspace.webp"
            fill
            priority
            sizes="(max-width: 640px) 94vw, (max-width: 1024px) 90vw, 1120px"
            alt="A calm workspace with a notebook and laptop"
            className="object-cover object-center"
          />
        </Reveal>
      </div>
    </section>

    <section id="services" aria-labelledby="services-heading" className="section-pad bg-softsage">
      <div className="shell">
        <Reveal className="max-w-[690px]"><SectionIntro data={h.services.intro} className="max-w-[660px]" /></Reveal>
        <ServiceCards cards={h.services.items} scopes={data.services.scopes} />

      </div>
    </section>

    <section id="how-we-work" aria-labelledby="process-heading" className="section-pad">
      <div className="shell">
        <Reveal className="mx-auto max-w-[680px] text-center"><SectionIntro data={h.process.intro} centered className="max-w-[580px]" /></Reveal>
        <ol className="mx-auto mt-8 grid max-w-[1030px] gap-0 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-5 lg:gap-0" aria-label="Five stages of an engagement">
          {h.process.items.map((step, i) => <Reveal key={step.title} as="li" delay={i * .075} className="relative grid grid-cols-[42px_1fr] gap-x-4 pb-8 last:pb-0 sm:block sm:pb-10 lg:pb-0 lg:pr-5">
            {i < h.process.items.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[21px] top-[42px] w-px bg-[#d5dfd3] sm:hidden lg:left-[42px] lg:top-[21px] lg:h-px lg:w-[calc(100%-42px)]" />}
            <span className={`relative z-10 inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#cdd9cc] text-[.67rem] font-bold tabular-nums ${i === 0 ? 'border-teal bg-teal text-white' : 'bg-paper text-teal'}`}>{String(i + 1).padStart(2, '0')}</span>
            <div className="sm:mt-5">
              <h3 className="mt-1.5 text-[1rem] font-bold sm:mt-0">{step.title}</h3>
              <p className="mt-2 max-w-xs text-[.79rem] leading-[1.85] text-muted">{step.description}</p>
            </div>
          </Reveal>)}
        </ol>

      </div>
    </section>

    <section id="for-agencies" aria-labelledby="agency-heading" className="relative mx-3 overflow-hidden rounded-2xl bg-forest py-12 text-white sm:mx-5 sm:py-14 lg:mx-auto lg:w-[min(1200px,calc(100%-3rem))] lg:py-16">
      <div className="shell relative z-10 grid items-center gap-9 md:grid-cols-[1.07fr_.93fr] md:gap-12 lg:gap-20">
        <Reveal className="mx-auto max-w-[490px] text-center md:mx-0 md:text-left">
          <SectionIntro data={h.agency.intro} inverse />
          <div className="mt-7"><EnquiryLink variant="light" audience="agency" mode="trial">Try us with your agency</EnquiryLink></div>
        </Reveal>
        <div className="md:border-l md:border-white/20 md:pl-9">
          {h.agency.items.map((x,i) => <Reveal key={x.title} delay={i * .08} className="border-t border-white/15 py-5 first:border-0 first:pt-0 last:pb-0">
            <h3 className="text-[1rem] font-semibold">{x.title}</h3><p className="mt-2 text-[.82rem] leading-[1.9] text-[#c7d8d4]">{x.description}</p>
          </Reveal>)}
        </div>
      </div>
    </section>

    <TrialOffer />
  </main>;
}
