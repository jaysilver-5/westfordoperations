import type { Metadata } from 'next';
import Image from 'next/image';
import { BadgeCheck, ClipboardCheck, LockKeyhole, ShieldCheck } from 'lucide-react';
import data from '@/data/content.json';
import { Reveal } from '@/components/animations';
import { ArrowLink, EnquiryLink, Eyebrow, NumberedList, SectionIntro } from '@/components/ui';
import { ServiceCards } from '@/components/service-cards';
import { TrialOffer } from '@/components/trial-offer';

export const metadata: Metadata = {
  title: 'Westford Operations | Keep your stores moving',
  description: 'Try Westford free for two weeks. Managed e-commerce operations for agencies and growing brands, from store updates to orders and customer support.',
};

const h = data.home;
const principleIcons = [LockKeyhole, ClipboardCheck, BadgeCheck, ShieldCheck];

export default function HomePage() {
  return <main id="main-content">
    <section id="home" aria-labelledby="hero-heading" className="overflow-hidden pb-7 pt-10 sm:pb-10 sm:pt-14 lg:pb-13 lg:pt-18">
      <div className="shell">
        <div className="grid items-end gap-7 md:gap-10 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
          <Reveal onLoad delay={0.04} className="max-w-[720px]">
            <Eyebrow>{h.hero.eyebrow}</Eyebrow>
            <h1 id="hero-heading" className="mt-5 text-[clamp(2.8rem,5.4vw,4.8rem)] font-semibold leading-[1.075] tracking-[-.055em] text-balance">
              Keep your stores moving.
              <span className="mt-1 block font-editorial text-[1.08em] font-normal tracking-[-.035em] text-teal">We handle the day-to-day.</span>
            </h1>
          </Reveal>
          <Reveal onLoad delay={0.15} className="max-w-[520px] lg:pb-1">
            <p className="text-[.96rem] leading-[1.9] text-muted sm:text-[1.04rem]">{h.hero.description}</p>
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start xl:flex-row xl:items-center">
              <EnquiryLink className="sm:w-auto" mode="trial">Try Westford free for 2 weeks</EnquiryLink>
              <ArrowLink className="justify-center sm:justify-start" href="/book">Talk to us</ArrowLink>
            </div>
          </Reveal>
        </div>
        <Reveal onLoad delay={0.21} distance={12} className="relative mt-9 h-[195px] overflow-hidden rounded-xl shadow-[0_18px_45px_-36px_#17343d80] sm:mt-11 sm:h-[250px] lg:mt-14 lg:h-[315px]">
          <Image
            src="/images/westford-workspace.webp"
            fill
            priority
            sizes="(max-width: 640px) 94vw, (max-width: 1024px) 90vw, 1120px"
            alt="Quiet, sunlit workspace with a notebook and laptop"
            className="object-cover object-center"
          />
        </Reveal>
      </div>
    </section>

    <section id="everyday" aria-labelledby="everyday-heading" className="section-pad">
      <div className="shell grid items-start gap-10 md:grid-cols-[.93fr_1.07fr] md:gap-14 lg:gap-24">
        <Reveal className="mx-auto max-w-[430px] text-center md:mx-0 md:text-left">
          <SectionIntro data={h.everyday.intro} />
          <ArrowLink href="/#services" className="mt-4">See where we can help</ArrowLink>
        </Reveal>
        <div>
          <NumberedList items={h.everyday.items} />
          <Reveal className="border-t border-line pt-5 md:ml-[3.25rem]">
            <p className="text-[.79rem] leading-[1.85] text-muted">{h.everyday.close}</p>
            <ArrowLink href="/contact?intent=trial#contact-form" className="mt-2">Let’s find your starting point</ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>

    <section id="services" aria-labelledby="services-heading" className="section-pad bg-softsage">
      <div className="shell">
        <Reveal className="mx-auto max-w-[690px] text-center"><SectionIntro data={h.services.intro} centered className="max-w-[660px]" /></Reveal>
        <ServiceCards cards={h.services.items} scopes={data.services.scopes} />
        <Reveal className="mt-6 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="max-w-[660px] text-[.73rem] leading-[1.9] text-muted">{h.services.note}</p>
          <ArrowLink href="/book" className="shrink-0">Discuss your operations</ArrowLink>
        </Reveal>
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
        <Reveal className="mt-4 text-center lg:mt-9"><ArrowLink href="/book">Discuss your operations</ArrowLink></Reveal>
      </div>
    </section>

    <section id="for-agencies" aria-labelledby="agency-heading" className="relative mx-3 overflow-hidden rounded-2xl bg-forest py-12 text-white sm:mx-5 sm:py-14 lg:mx-auto lg:w-[min(1200px,calc(100%-3rem))] lg:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute -right-64 -top-56 h-[500px] w-[500px] rounded-full border border-[#aec9b125] shadow-[0_0_0_68px_#aec9b108,0_0_0_138px_#aec9b106]" />
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

    <section id="principles" aria-labelledby="principles-heading" className="section-pad">
      <div className="shell grid items-center gap-10 md:grid-cols-[.9fr_1.1fr] md:gap-14 lg:gap-24">
        <Reveal className="mx-auto max-w-[460px] text-center md:mx-0 md:text-left"><SectionIntro data={h.principles.intro} /></Reveal>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-9">
          {h.principles.items.map((p, i) => {const Icon = principleIcons[i];return <Reveal key={p.title} delay={i * .08}>
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf0e6] text-teal"><Icon aria-hidden="true" size={21} strokeWidth={1.55} /></span>
            <h3 className="text-[.9rem] font-bold leading-[1.5]">{p.title}</h3><p className="mt-2 text-[.75rem] leading-[1.9] text-muted">{p.description}</p>
          </Reveal>;})}
        </div>
      </div>
    </section>

    <TrialOffer />
  </main>;
}
