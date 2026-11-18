'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/** Lightweight route-entry transition; template remounts when the route changes. */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div
    initial={reduced ? false : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: reduced ? 0 : .31, ease: 'easeOut' }}
  >{children}</motion.div>;
}
