import type { Metadata } from 'next';
import Image from 'next/image';
import { BadgeCheck, ClipboardCheck, LockKeyhole, ShieldCheck } from 'lucide-react';
import data from '@/data/content.json';
import { Reveal } from '@/components/animations';
import { ArrowLink, EnquiryLink, Eyebrow, NumberedList, SectionIntro } from '@/components/ui';
import { ServiceCards } from '@/components/service-cards';

export const metadata: Metadata = {
  title: 'Westford Operations | Keep your stores moving',
  description: 'Managed e-commerce operations for agencies and growing brands. Practical support with store updates, orders and customer service.',
};

const h = data.home;
const principleIcons = [LockKeyhole, ClipboardCheck, BadgeCheck, ShieldCheck];

export default function HomePage() {
  return <main id="main-content">
    <section id="home" aria-labelledby="hero-heading" className="relative overflow-hidden pt-6 sm:pt-7 lg:pt-8">
      <div className="hero-ambient pointer-events-none absolute left-1/2 top-5 -z-0 h-72 w-[680px] -translate-x-1/2 rounded-full bg-[#e1e9dd]/55 blur-[100px]" aria-hidden="true" />
      <div className="shell relative z-10 text-center">
        <Reveal onLoad delay={0.02}><Eyebrow>{h.hero.eyebrow}</Eyebrow></Reveal>
        <Reveal onLoad delay={0.13}>
          <h1 id="hero-heading" className="mx-auto mt-4 max-w-[880px] text-[clamp(2rem,4.1vw,3.375rem)] font-semibold leading-[1.13] tracking-[-.045em] text-balance">
            Keep your stores moving.<br /> We handle the <em className="font-editorial text-[1.1em] font-normal tracking-[-.035em] text-teal">day-to-day.</em>
          </h1>
        </Reveal>
        <Reveal onLoad delay={0.22}>
          <p className="copy-muted mx-auto mt-4 max-w-[650px] !text-[.9rem] sm:!text-[.9375rem]">{h.hero.description}</p>
        </Reveal>
        <Reveal onLoad delay={0.31} className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
          <EnquiryLink className="w-full max-w-[340px] sm:w-auto" mode="review">Get my free operations review</EnquiryLink>
          <ArrowLink className="justify-center" href="/services">Explore our services</ArrowLink>
        </Reveal>
        <Reveal onLoad delay={0.38}>
          <p className="mt-3 text-[.73rem] leading-[1.9] text-[#61726f]">One workflow. Three practical next steps. <span className="mx-2 hidden text-[#9aab9a] sm:inline">•</span><span className="block sm:inline">No store login required.</span></p>
        </Reveal>
        <Reveal onLoad delay={0.4} distance={13} className="relative mx-auto mt-6 h-[140px] overflow-hidden rounded-xl shadow-[0_20px_35px_-28px_#17343d88] sm:h-[clamp(150px,25svh,210px)]">
          <Image src="/images/westford-workspace.webp" fill priority sizes="(max-width: 640px) 94vw, (max-width: 1024px) 90vw, 1120px" alt="A quiet sunlit workspace with a notebook and laptop" className="object-cover object-[center_62%]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl border border-ink/5" />
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
            <ArrowLink href="/contact?intent=review#contact-form" className="mt-2">Find your starting point</ArrowLink>
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
          <ArrowLink href="/contact?intent=general#contact-form" className="shrink-0">Discuss your operations</ArrowLink>
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
        <Reveal className="mt-4 text-center lg:mt-9"><ArrowLink href="/contact?intent=general#contact-form">Discuss your operations</ArrowLink></Reveal>
      </div>
    </section>

    <section id="for-agencies" aria-labelledby="agency-heading" className="relative mx-3 overflow-hidden rounded-2xl bg-forest py-12 text-white sm:mx-5 sm:py-14 lg:mx-auto lg:w-[min(1200px,calc(100%-3rem))] lg:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute -right-64 -top-56 h-[500px] w-[500px] rounded-full border border-[#aec9b125] shadow-[0_0_0_68px_#aec9b108,0_0_0_138px_#aec9b106]" />
      <div className="shell relative z-10 grid items-center gap-9 md:grid-cols-[1.07fr_.93fr] md:gap-12 lg:gap-20">
        <Reveal className="mx-auto max-w-[490px] text-center md:mx-0 md:text-left">
          <SectionIntro data={h.agency.intro} inverse />
          <div className="mt-7"><EnquiryLink variant="light" audience="agency" mode="general">Discuss agency support</EnquiryLink></div>
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

    <section id="free-review" aria-labelledby="review-heading" className="section-pad bg-palesage text-center">
      <Reveal className="shell mx-auto max-w-[765px]">
        <Eyebrow>{h.review.intro.eyebrow}</Eyebrow>
        <h2 id="review-heading" className="heading-editorial mt-5">{h.review.intro.title}</h2>
        <p className="copy-muted mx-auto mt-5 max-w-[600px]">{h.review.intro.description}</p>
        <div className="mt-7"><EnquiryLink className="w-full max-w-[345px] sm:w-auto" mode="review">Get my free operations review</EnquiryLink></div>
        <p className="mt-4 text-[.75rem] leading-[1.8] text-muted">One workflow. Three practical next steps. <span className="block sm:inline">No store login required.</span></p>
        <div className="mx-auto mt-7 max-w-[500px] border-t border-[#cedac7] pt-5"><h3 className="text-[.75rem] font-extrabold">Helpful to bring</h3><p className="mt-2 text-[.74rem] leading-[1.9] text-muted">Your platform, the task that keeps getting stuck, and an approximate product, order or enquiry volume.</p></div>
      </Reveal>
    </section>
  </main>;
}
