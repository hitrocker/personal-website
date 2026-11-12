import { SectionHeading } from "@/designs/classic/components/ui/section-heading";
import { Reveal } from "@/designs/classic/components/ui/reveal";
import { expertise } from "@/lib/content";

export function Expertise() {
  return (
    <section id="expertise" className="section-pad relative z-[1]">
      <Reveal>
        <SectionHeading
          kicker={expertise.kicker}
          title={expertise.heading}
          accent={expertise.headingAccent}
          description={expertise.intro}
        />
      </Reveal>
      <div className="grid gap-4 md:grid-cols-3">
        {expertise.groups.map((group, index) => (
          <Reveal key={group.title} delay={index * 0.05}>
            <article className="card h-full p-6">
              <h3 className="display text-2xl">{group.title}</h3>
              <ul className="mt-5 grid gap-2 text-muted">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
