import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface PhoneMockupProps {
  children: ReactNode;
  className?: string;
  /** Subtle idle float animation delay. */
  delay?: number;
  rotate?: number;
}

/**
 * A realistic floating phone frame used to showcase the responsive
 * mobile layout as a decorative composition element on desktop.
 */
export const PhoneMockup = ({ children, className, delay = 0, rotate = 0 }: PhoneMockupProps) => (
  <motion.div
    className={cn('pointer-events-none select-none', className)}
    initial={{ opacity: 0, y: 40, rotate }}
    animate={{ opacity: 1, y: 0, rotate }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
      className="relative h-[420px] w-[210px] rounded-[2.4rem] border-[7px] border-ink bg-surface shadow-lift"
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-ink" />
      {/* Screen */}
      <div className="h-full w-full overflow-hidden rounded-[1.8rem] bg-bg">{children}</div>
    </motion.div>
  </motion.div>
);
