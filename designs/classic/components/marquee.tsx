import { marquee } from "@/lib/content";

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="relative z-[1] overflow-hidden border-y border-[var(--line)] bg-[var(--bg-2)] py-4">
      <div className="marquee-track" aria-hidden="true">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="display text-lg tracking-[-0.03em] text-[color-mix(in_srgb,var(--ink)_72%,transparent)] uppercase"
          >
            {item}
          </span>
        ))}
      </div>
      <p className="sr-only">{marquee.join(", ")}</p>
    </div>
  );
}
