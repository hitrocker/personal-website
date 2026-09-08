import { about } from "@/lib/content";

export function About() {
  return (
    <div id="about" className="min-w-0">
      <p className="kicker">{about.kicker}</p>
      <h2 className="display mt-3 text-[clamp(1.7rem,3.6vw,2.55rem)] tracking-[-0.05em] leading-[1.05]">
        {about.heading}{" "}
        <em className="serif-italic">{about.headingAccent}</em>
      </h2>
      <div className="mt-5 space-y-3.5 text-[15px] leading-7 text-[color-mix(in_srgb,var(--ink)_86%,var(--muted))]">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
