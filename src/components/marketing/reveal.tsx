import type {ReactNode} from "react";
import {motion, useReducedMotion} from "motion/react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// The one reveal pattern: fade in + 8px rise, 300ms, once (docs/design-system.md §9).
export function Reveal({children, delay = 0, className}: RevealProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : {opacity: 0, y: 8}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.3, ease: "easeOut", delay}}
    >
      {children}
    </motion.div>
  );
}
