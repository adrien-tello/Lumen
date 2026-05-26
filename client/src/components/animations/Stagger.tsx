import { ReactNode } from 'react';
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/** Wraps a list so children reveal in a staggered sequence. */
export const Stagger = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={className}
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-60px' }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div variants={item} className={className}>
    {children}
  </motion.div>
);
