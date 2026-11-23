'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { Reveal } from './animations';
import { enquiryHref } from '@/lib/links';

type Card = { key: string; title: string; description: string; icon: number };
type Scope = { key: string; title: string; description: string; tasks: string[]; condition: string };

export function ServiceCards({ cards, scopes }: { cards: Card[]; scopes: Scope[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = scopes.find(s => s.key === selected);
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (selected && !el.open) el.showModal();
    if (!selected && el.open) el.close();
  }, [selected]);

  return <>
    <div className="mt-9 grid border-t border-line md:grid-cols-2 md:gap-x-12" aria-label="Westford service areas">
      {cards.map((card, i) => <Reveal key={card.key} delay={(i % 2) * .06} className="border-b border-line py-7 sm:py-8">
        <article className="h-full">
          <button
            type="button"
            onClick={() => setSelected(card.key)}
            aria-haspopup="dialog"
            aria-label={`View scope for ${card.title}`}
            className="group flex h-full w-full flex-col items-start rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
          >
            <span className="flex w-full items-center justify-between">
              <span className="text-[.71rem] font-bold tracking-[.08em] text-teal tabular-nums">{String(i + 1).padStart(2, '0')} / 06</span>
              <ArrowUpRight size={19} strokeWidth={1.55} className="text-[#748982] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-editorial text-[2rem] leading-[1.15] tracking-[-.02em] text-ink transition-colors group-hover:text-teal sm:text-[2.17rem]">{card.title}</h3>
            <p className="mt-3 max-w-[440px] flex-1 text-[.87rem] leading-[1.85] text-muted">{card.description}</p>
            <span className="mt-4 text-[.8rem] font-semibold text-teal underline decoration-[#b7c9bb] underline-offset-4 group-hover:decoration-teal">View scope</span>
          </button>
        </article>
      </Reveal>)}
    </div>
    <dialog ref={dialogRef} onClose={() => setSelected(null)} onClick={e => { if (e.target === dialogRef.current) setSelected(null); }} aria-labelledby="service-dialog-title" className="m-auto max-h-[calc(100dvh-2rem)] w-[min(650px,calc(100%-2rem))] overflow-y-auto rounded-xl border border-line bg-ivory p-6 text-ink shadow-2xl backdrop:bg-[#102c3677] sm:p-10">
      {active && <>
        <button type="button" onClick={() => setSelected(null)} aria-label="Close service details" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-mist transition-colors hover:bg-[#e0eade]"><X size={19} /></button>
        <p className="eyebrow pr-10">Service scope</p>
        <h2 id="service-dialog-title" className="mt-4 pr-4 font-editorial text-[2.5rem] leading-[1.1] sm:text-[3rem]">{active.title}</h2>
        <p className="copy-muted mt-4">{active.description}</p>
        <h3 className="mt-7 text-[.92rem] font-bold">Typical work included</h3>
        <ul className="check-list mt-3 space-y-2">{active.tasks.map(task => <li key={task}>{task}</li>)}</ul>
        <p className="mt-6 rounded-lg bg-mist p-4 text-[.77rem] leading-[1.85] text-muted">{active.condition}</p>
        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link onClick={() => setSelected(null)} className="btn-primary" href={enquiryHref('trial', active.key)}>Ask about a free trial <ArrowUpRight aria-hidden="true" size={18} /></Link>
          <Link onClick={() => setSelected(null)} className="text-cta justify-center" href={`/services#scope-${active.key}`}>Full service details <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
      </>}
    </dialog>
  </>;
}
