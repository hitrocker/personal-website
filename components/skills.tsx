"use client";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { skillGroups } from "@/lib/content";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const filters = [
  { id: "all", label: "All" },
  ...skillGroups.map((group) => ({ id: group.id, label: group.label })),
];

export function Skills() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return skillGroups
      .filter((group) => active === "all" || group.id === active)
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          needle ? item.toLowerCase().includes(needle) : true,
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [active, query]);

  return (
    <section id="skills" className="section-pad relative z-[1]">
      <Reveal>
        <SectionHeading
          kicker="Skills"
          title="The working set."
          accent="No scorebars."
          description="Searchable if you are looking for a specific tool. These are methods and systems from the CV - not a self-graded chart."
        />
      </Reveal>

      <Reveal>
        <label className="relative mb-6 block w-full max-w-md">
          <span className="sr-only">Search skills</span>
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint"
          />
          <input
            type="text"
            inputMode="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills"
            className="h-11 w-full rounded-full border border-[var(--line)] bg-[var(--bg-2)] pr-4 pl-10 text-sm outline-none placeholder:text-faint focus:border-[var(--lime)]"
          />
        </label>
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={active === filter.id}
              className={`tag ${active === filter.id ? "tag-active" : ""}`}
              onClick={() => setActive(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.length === 0 ? (
            <p className="text-sm text-muted">No skills match that filter.</p>
          ) : (
            visible.map((group) => (
              <article key={group.id} className="card p-6">
                <h3 className="display text-xl">{group.label}</h3>
                <ul className="mt-4 grid gap-2 text-muted">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))
          )}
        </div>
      </Reveal>
    </section>
  );
}
