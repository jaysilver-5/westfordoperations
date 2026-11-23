import { EnquiryLink, Eyebrow } from './ui';

export function TrialOffer() {
  return <section id="free-trial" aria-labelledby="trial-heading" className="bg-palesage py-16 sm:py-20">
    <div className="shell flex flex-col items-start justify-between gap-7 md:flex-row md:items-end md:gap-12">
      <div className="max-w-[670px]">
        <Eyebrow>Start with one workflow</Eyebrow>
        <h2 id="trial-heading" className="mt-4 font-editorial text-[clamp(2.35rem,4.25vw,3.65rem)] leading-[1.12] tracking-[-.025em]">
          See what two weeks of support can do.
        </h2>
        <p className="mt-4 max-w-[535px] text-[.92rem] leading-[1.85] text-muted">
          Agree the work and start date with us. There is no paid commitment.
        </p>
      </div>
      <EnquiryLink mode="trial" className="shrink-0">Request a free trial</EnquiryLink>
    </div>
  </section>;
}
