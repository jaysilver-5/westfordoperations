'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const navItems = [
  { text: 'Services', href: '/services' },
  { text: 'For agencies', href: '/agencies' },
  { text: 'For brands', href: '/brands' },
  { text: 'How we work', href: '/#how-we-work' },
  { text: 'About', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 150, damping: 26, mass: .2 });

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return <header id="page-top" className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-[background,border-color,box-shadow] duration-300 ${scrolled ? 'border-line/90 bg-paper/96 shadow-[0_5px_24px_#17343d09]' : 'border-transparent bg-paper/95'}`}>
    <div className="shell flex min-h-[68px] items-center justify-between gap-5 py-2.5 lg:min-h-[76px]">
      <Link href="/" aria-label="Westford Operations home" className="relative z-20 shrink-0" onClick={() => setOpen(false)}>
        <Image src="/images/westford-logo.webp" alt="Westford Operations" width={248} height={49} priority className="h-auto w-[156px] object-contain sm:w-[170px] xl:w-[180px]" />
      </Link>
      <nav className="hidden items-center gap-4 lg:flex xl:gap-7" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`group relative whitespace-nowrap py-3 text-[.73rem] font-semibold transition-colors ${active ? 'text-teal' : 'text-[#465c62] hover:text-teal'}`}>
            {item.text}<span className={`absolute bottom-[4px] left-0 h-[1px] bg-teal transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>;
        })}
      </nav>
      <Link href="/book" className="group hidden shrink-0 items-center gap-3 rounded-lg border border-ink bg-ink px-4 py-3 text-[.72rem] font-bold text-white transition-colors hover:bg-forest lg:inline-flex">
        Talk to us<ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
      <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" className="relative z-20 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#d2ddcd] text-ink transition-colors hover:bg-[#e9eee7] lg:hidden" onClick={() => setOpen(v => !v)}>
        {open ? <X size={23} strokeWidth={1.8} /> : <Menu size={23} strokeWidth={1.8} />}
      </button>
    </div>
    <AnimatePresence>
      {open && <motion.div id="mobile-navigation" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .23, ease: 'easeOut' }} className="absolute inset-x-5 top-[calc(100%-2px)] z-30 rounded-xl border border-line bg-ivory p-3 shadow-[0_25px_55px_#17343d1b] sm:inset-x-8 lg:hidden">
        <nav aria-label="Mobile navigation" className="flex flex-col">
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? 'page' : undefined} className={`rounded-lg px-4 py-3.5 text-sm font-semibold hover:bg-mist ${pathname === item.href ? 'text-teal' : 'text-ink'}`}>{item.text}</Link>)}
          <Link href="/book" onClick={() => setOpen(false)} className="mt-2 flex min-h-12 items-center justify-between gap-3 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white">
            Talk to us<ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </nav>
      </motion.div>}
    </AnimatePresence>
    <motion.div aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-teal/65" style={{ scaleX: smoothProgress }} />
  </header>;
}
