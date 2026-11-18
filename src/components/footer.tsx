'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { enquiryHref } from '@/lib/links';

export function Footer() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  return <footer className="bg-paper">
    <div className="shell grid gap-10 border-b border-line py-14 sm:grid-cols-[1.4fr_1fr_1fr] sm:gap-9 lg:gap-20 lg:py-17">
      <div className="mx-auto max-w-[310px] text-center sm:mx-0 sm:text-left">
        <Link href="/" aria-label="Westford Operations home" className="inline-block"><Image src="/images/westford-logo.webp" alt="Westford Operations" width={248} height={49} className="mx-auto h-auto w-[194px] sm:mx-0 sm:w-[210px]" /></Link>
        <p className="mt-5 text-[.77rem] leading-[1.95] text-muted">Managed e-commerce operations for agencies and growing brands.</p>
      </div>
      <nav aria-label="Explore" className="flex flex-col items-center gap-1 sm:items-start">
        <h2 className="mb-2 text-[.67rem] font-extrabold uppercase tracking-[.16em] text-teal">Explore</h2>
        <Link className="min-h-10 py-2 text-[.78rem] text-muted transition-colors hover:text-teal" href="/services">Services</Link>
        <Link className="min-h-10 py-2 text-[.78rem] text-muted transition-colors hover:text-teal" href="/#how-we-work">How we work</Link>
        <Link className="min-h-10 py-2 text-[.78rem] text-muted transition-colors hover:text-teal" href="/about">About Westford</Link>
      </nav>
      <nav aria-label="Work with us" className="flex flex-col items-center gap-1 sm:items-start">
        <h2 className="mb-2 text-[.67rem] font-extrabold uppercase tracking-[.16em] text-teal">Work with us</h2>
        <Link className="min-h-10 py-2 text-[.78rem] text-muted transition-colors hover:text-teal" href="/agencies">For agencies</Link>
        <Link className="min-h-10 py-2 text-[.78rem] text-muted transition-colors hover:text-teal" href="/brands">For brands</Link>
        <Link className="min-h-10 py-2 text-[.78rem] text-muted transition-colors hover:text-teal" href={enquiryHref('general')}>Discuss your operations</Link>
      </nav>
    </div>
    <div className="shell flex flex-col items-center justify-between gap-1 py-4 text-center text-[.7rem] text-muted sm:flex-row sm:text-left">
      <span>© {new Date().getFullYear()} Westford Operations</span>
      <div className="flex items-center gap-5 sm:gap-7">
        <button className="min-h-11 transition-colors hover:text-teal" onClick={() => setOpen(true)} type="button">Draft storage</button>
        <Link href="#page-top" className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-teal">Back to top <ArrowUp size={14} aria-hidden="true" /></Link>
      </div>
    </div>
    <p className="shell pb-6 text-center text-[.69rem] leading-[1.8] text-muted sm:text-left">Interactive preview. Enquiry forms save drafts locally and do not send enquiries.</p>
    <dialog ref={dialog} onClose={() => setOpen(false)} onClick={e => { if (e.target === dialog.current) setOpen(false); }} className="m-auto max-h-[calc(100dvh-2rem)] w-[min(590px,calc(100%-2rem))] overflow-y-auto rounded-xl border border-line bg-ivory p-6 text-ink shadow-2xl backdrop:bg-[#102c3699] backdrop:backdrop-blur-sm sm:p-10">
      <button type="button" onClick={() => setOpen(false)} aria-label="Close draft storage details" className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-mist hover:bg-[#dce5d6]"><X size={18} /></button>
      <p className="eyebrow mb-4">About this preview</p>
      <h2 className="font-editorial text-[2.45rem] leading-[1.14]">Your draft stays with you.</h2>
      <p className="copy-muted mt-4">This interactive preview does not send enquiry forms to Westford.</p>
      <ul className="mt-5 list-disc space-y-3 pl-5 text-[.84rem] leading-[1.8] text-muted">
        <li>An unremembered draft remains only in the open page and is cleared on refresh or close.</li>
        <li>Choose “Remember this draft on this device” to save it in this browser&apos;s local storage.</li>
        <li>To remove a remembered draft, open the form and uncheck that option or use Clear draft.</li>
        <li>You can copy or download an enquiry summary for your own records.</li>
      </ul>
      <p className="mt-6 rounded-lg bg-mist p-4 text-[.8rem] leading-[1.8] text-muted">This explains the preview&apos;s draft behaviour. It is not a privacy policy for a live enquiry service.</p>
    </dialog>
  </footer>;
}
