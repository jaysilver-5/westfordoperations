'use client';

import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  as?: 'div' | 'li';
  onLoad?: boolean;
};

/** Reveal elements once on entry. Respect OS-level reduced-motion preference. */
export function Reveal({ children, className, delay = 0, distance = 22, as = 'div', onLoad = false }: RevealProps) {
  const reduced = useReducedMotion();
  const animation = onLoad ? { animate: { opacity: 1, y: 0 } } : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.13, margin: '0px 0px -36px 0px' } };
  const transition = { duration: reduced ? 0 : 0.62, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const };
  if (as === 'li') return <motion.li className={className} initial={reduced ? false : { opacity: 0, y: distance }} {...animation} transition={transition}>{children}</motion.li>;
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: distance }} {...animation} transition={transition}>{children}</motion.div>;
}

export function AnimationSettings({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
