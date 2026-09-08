"use client";

import { About } from "@/components/about";
import { hero, profile } from "@/lib/content";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="top" className="relative">
      <div className="relative z-[1] grid items-start gap-12 px-[6vw] py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] lg:items-center lg:gap-16 lg:py-20">
        <div className="hero-copy max-w-3xl">
          <motion.p className="mb-5 inline-flex items-center gap-2.5 text-[13px] text-lime" {...enter(0.05)}>
            <span className="pulse-dot" />
            {hero.availability}
          </motion.p>
          <motion.h1
            className="hero-name display tracking-[-0.07em] leading-[0.92]"
            {...enter(0.12)}
          >
            <span className="hero-first">{profile.firstName}</span>
            <span className="serif-italic mt-1 block tracking-[-0.04em]">
              {profile.lastName}
            </span>
          </motion.h1>
          <motion.p className="mt-5 text-lg text-muted" {...enter(0.22)}>
            {hero.role}
          </motion.p>
          <motion.p
            className="mt-4 max-w-xl text-lg leading-8 text-[color-mix(in_srgb,var(--ink)_82%,var(--muted))]"
            {...enter(0.3)}
          >
            {hero.lead}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3" {...enter(0.4)}>
            <a href={hero.primaryCta.href} className="btn btn-lime">
              {hero.primaryCta.label}
            </a>
          </motion.div>
        </div>

        <motion.div className="min-w-0 w-full" {...enter(0.28)}>
          <About />
        </motion.div>
      </div>
    </section>
  );
}
