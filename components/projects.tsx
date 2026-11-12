"use client";

import {
  ArrowPuzzleVisual,
  Grid2048Visual,
  MazeVisual,
  SkyHopperVisual,
} from "@/components/project-visuals";
import { OutLink } from "@/components/ui/out-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/lib/content";
import { isHttpUrl } from "@/lib/site";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  return (
    <section id="projects" className="section-pad relative z-[1]">
      <Reveal>
        <SectionHeading
          kicker="Selected work"
          title="Four games, shipped solo."
          accent="Held to a team bar."
          description="Four mobile games on Google Play, each designed, built, tested, and released on my own. Evaluation is one half of the story. These are the other."
        />
      </Reveal>

      <div className="grid gap-6">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.04}>
            <article className="card overflow-hidden p-6 sm:p-7 lg:p-8">
              <div
                className={`grid items-center gap-6 lg:gap-10 ${
                  index % 2 === 1
                    ? "lg:grid-cols-[auto_minmax(0,1fr)]"
                    : "lg:grid-cols-[minmax(0,1fr)_auto]"
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                    {project.kind} · {project.role}
                  </p>
                  <h3 className="display mt-2 text-[2.6rem] tracking-[-0.05em]">
                    {project.name}
                  </h3>
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted">
                    {project.summary}
                  </p>
                  <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                    {project.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span key={item} className="tag">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.links.filter((link) => isHttpUrl(link.href)).map((link) => (
                      <OutLink key={link.label} href={link.href} className="btn btn-ghost">
                        {link.label}
                        <ArrowUpRight size={15} />
                      </OutLink>
                    ))}
                  </div>
                </div>
                <div
                  className={`flex w-full justify-center lg:w-[28rem] ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  {project.visual === "grid2048" ? (
                    <Grid2048Visual />
                  ) : project.visual === "maze" ? (
                    <MazeVisual />
                  ) : project.visual === "arrows" ? (
                    <ArrowPuzzleVisual />
                  ) : (
                    <SkyHopperVisual />
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
