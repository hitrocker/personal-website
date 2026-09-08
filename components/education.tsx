import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { education } from "@/lib/content";

export function Education() {
  return (
    <section id="education" className="section-pad relative z-[1]">
      <Reveal>
        <SectionHeading kicker="Education" title="Currently enrolled." />
      </Reveal>
      <Reveal>
        <div className="card flex flex-col justify-between gap-3 p-7 sm:flex-row sm:items-end">
          <div>
            <h3 className="display text-2xl">{education.degree}</h3>
            <p className="mt-2 text-muted">{education.school}</p>
          </div>
          <p className="font-mono text-xs text-faint">{education.dates}</p>
        </div>
      </Reveal>
    </section>
  );
}
