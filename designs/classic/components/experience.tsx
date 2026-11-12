"use client";

import { SectionHeading } from "@/designs/classic/components/ui/section-heading";
import { Reveal } from "@/designs/classic/components/ui/reveal";
import { experience } from "@/lib/content";

export function Experience() {
  return (
    <section id="experience" className="section-pad relative z-[1]">
      <Reveal>
        <SectionHeading
          kicker="Experience"
          title="The evaluation loop,"
          accent="held to a high bar."
          description="Two assignments inside frontier evaluation. Turing carries extra weight because the work included day-to-day coordination across an international team."
        />
      </Reveal>

      <ol className="grid gap-4">
        {experience.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.05}>
            <li className="card grid gap-6 p-7 md:grid-cols-[180px_1fr]">
              <div>

                <time className="block text-sm text-muted">{item.dates}</time>
              </div>
              <div>
                <h3 className="display text-[1.7rem] tracking-[-0.03em]">{item.role}</h3>
                <p className="mt-1 text-muted">{item.organization}</p>
                <p className="mt-4 text-[15px] leading-7 text-[color-mix(in_srgb,var(--ink)_84%,var(--muted))]">
                  {item.summary}
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[color-mix(in_srgb,var(--ink)_84%,var(--muted))]">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.areas.map((area) => (
                    <span key={area} className="tag">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
