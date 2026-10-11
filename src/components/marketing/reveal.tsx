import type {ReactNode} from "react";
import {domAnimation, LazyMotion, useReducedMotion} from "motion/react";
import {div as MotionDiv} from "motion/react-m";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// The one reveal pattern: fade in + 8px rise, 300ms, once (docs/design-system.md §9).
// LazyMotion + `m` keeps the full framer feature bundle out of the page chunk.
export function Reveal({children, delay = 0, className}: RevealProps) {
  const reduceMotion = useReducedMotion();
  return (
    <LazyMotion features={domAnimation}>
      <MotionDiv
        className={className}
        initial={reduceMotion ? false : {opacity: 0, y: 8}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.3, ease: "easeOut", delay}}
      >
        {children}
      </MotionDiv>
    </LazyMotion>
  );
}
