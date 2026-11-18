'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Boxes, ClipboardList, Globe2, Headset, Megaphone, Wrench, X } from 'lucide-react';
import { Reveal } from './animations';
import { enquiryHref } from '@/lib/links';

type Card = { key: string; title: string; description: string; icon: number };
type Scope = { key: string; title: string; description: string; tasks: string[]; condition: string };
const icons = [Boxes, ClipboardList, Headset, Globe2, Megaphone, Wrench];

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
    <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => {
        const Icon = icons[i % icons.length];
        return <Reveal key={card.key} delay={(i % 3) * .08}>
          <article className="card-soft group flex h-full min-h-[245px] flex-col p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#afc3b4] hover:shadow-[0_16px_34px_#17343d12] sm:p-7">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#dce5db] bg-[#f0f4ec] text-teal"><Icon size={23} strokeWidth={1.45} aria-hidden="true" /></span>
              <span className="text-[.65rem] font-semibold tabular-nums text-[#7b8b7e]">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="mt-5 text-[1.03rem] font-bold leading-[1.5] tracking-[-.025em]">{card.title}</h3>
            <p className="mt-2.5 flex-1 text-[.8rem] leading-[1.88] text-muted">{card.description}</p>
            <button type="button" onClick={() => setSelected(card.key)} aria-label={`View scope for ${card.title}`} className="mt-5 flex min-h-10 w-full items-center justify-between gap-3 border-t border-line/70 pt-3 text-left text-[.77rem] font-bold transition-colors group-hover:text-teal">
              View scope <ArrowRight size={17} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </article>
        </Reveal>;
      })}
    </div>
    <dialog ref={dialogRef} onClose={() => setSelected(null)} onClick={e => { if (e.target === dialogRef.current) setSelected(null); }} aria-labelledby="service-dialog-title" className="m-auto max-h-[calc(100dvh-2rem)] w-[min(650px,calc(100%-2rem))] overflow-y-auto rounded-2xl border border-line bg-ivory p-6 text-ink shadow-[0_25px_100px_#0b272f3d] backdrop:bg-[#102c3699] backdrop:backdrop-blur-[4px] sm:p-10">
      {active && <>
        <button type="button" onClick={() => setSelected(null)} aria-label="Close service details" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-mist transition-colors hover:bg-[#e0eade]"><X size={19} /></button>
        <p className="eyebrow pr-10">Service scope</p>
        <h2 id="service-dialog-title" className="mt-4 pr-4 font-editorial text-[2.5rem] leading-[1.1] sm:text-[3rem]">{active.title}</h2>
        <p className="copy-muted mt-4">{active.description}</p>
        <h3 className="mt-7 text-[.92rem] font-bold">Typical work included</h3>
        <ul className="check-list mt-3 space-y-2">{active.tasks.map(task => <li key={task}>{task}</li>)}</ul>
        <p className="mt-6 rounded-lg bg-mist p-4 text-[.77rem] leading-[1.85] text-muted">{active.condition}</p>
        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link onClick={() => setSelected(null)} className="btn-primary" href={enquiryHref('general', active.key)}>Discuss this service <ArrowUpRight aria-hidden="true" size={18} /></Link>
          <Link onClick={() => setSelected(null)} className="text-cta justify-center" href={`/services#scope-${active.key}`}>Full service details <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
      </>}
    </dialog>
  </>;
}
