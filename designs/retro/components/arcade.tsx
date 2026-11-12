"use client";

import {
  ArrowPuzzleVisual,
  Grid2048Visual,
  MazeVisual,
  SkyHopperVisual,
} from "@/components/game-previews";
import { projects, type Project } from "@/lib/content";
import { isHttpUrl } from "@/lib/site";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { sfx } from "./sfx";

const AUTO_ADVANCE_MS = 9000;

function Screen({ project }: { project: Project }) {
  switch (project.visual) {
    case "grid2048":
      return <Grid2048Visual />;
    case "maze":
      return <MazeVisual />;
    case "arrows":
      return <ArrowPuzzleVisual />;
    default:
      return <SkyHopperVisual />;
  }
}

/** ARCADE.EXE: a CRT "cabinet" that cycles through the shipped games using their live preview animations. */
export function ArcadeCabinet() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPicked, setUserPicked] = useState(false);
  const project = projects[index] ?? projects[0];

  useEffect(() => {
    if (reduce || hovered || userPicked) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % projects.length), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [index, reduce, hovered, userPicked]);

  if (!project) return null;

  const go = (next: number) => {
    sfx.blip();
    setUserPicked(true);
    setIndex((next + projects.length) % projects.length);
  };
  const links = project.links.filter((link) => isHttpUrl(link.href));

  return (
    <div
      className="r-box self-start p-[3px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="r-title r-title--teal">
        <span>ARCADE.EXE — NOW PLAYING</span>
        <span className="shrink-0 bg-[#2e5f5c] px-1.5 text-[10px] tabular-nums">
          [{index + 1}/{projects.length}]
        </span>
      </div>

      <div className="bg-[#ede6d6] p-3">
        {/* CRT screen */}
        <div className="r-sunken bg-[#1a1a1a] p-2.5">
          <div className="relative overflow-hidden border-2 border-black">
            <div key={project.id} className="r-bezel r-arcade-screen">
              <Screen project={project} />
            </div>
            <div className="r-arcade-scan pointer-events-none absolute inset-0" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-center justify-between px-0.5 r-label text-[10px] text-[#33ff33]">
            <span>● ON AIR</span>
            <span>{project.kind.toUpperCase()}</span>
          </div>
        </div>

        {/* Cartridge label */}
        <div className="mt-3" aria-live="polite">
          <h2 className="r-headline text-[1.25rem]">
            {project.name} <span className="text-[13px] text-[#2e7d78]">{"// "}{project.role}</span>
          </h2>
          <p className="mt-1.5 text-[12.5px] leading-5 text-[#3e4949]">{project.summary}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((item) => (
              <span key={item} className="r-chip">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#c8c0ae] pt-3">
          <button type="button" className="r-btn" data-sfx="blip" onClick={() => go(index - 1)} aria-label="Previous game">
            ◀ PREV
          </button>
          <div className="flex gap-1.5" role="tablist" aria-label="Choose a game">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                data-sfx="blip"
                aria-selected={i === index}
                aria-label={p.name}
                onClick={() => go(i)}
                className={`h-3 w-3 border border-black ${i === index ? "bg-[#2e7d78]" : "bg-white"}`}
              />
            ))}
          </div>
          <button type="button" className="r-btn" data-sfx="blip" onClick={() => go(index + 1)} aria-label="Next game">
            NEXT ▶
          </button>
        </div>
        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`r-btn justify-center ${links.length === 1 ? "sm:col-span-2" : ""}`}
            >
              {link.label === "GitHub" ? "‹› [SOURCE]" : "▶ [PLAY STORE]"}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
