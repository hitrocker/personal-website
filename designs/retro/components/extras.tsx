"use client";

import { profile } from "@/lib/content";
import { useEffect, useRef, useState } from "react";
import { sfx } from "./sfx";

/* ------------------------------------------------------------------ */
/* Wallpaper switcher ("Display Properties")                           */
/* ------------------------------------------------------------------ */

export const WALLPAPERS = [
  { id: "teal", label: "Teal", swatch: "#008080" },
  { id: "navy", label: "Navy", swatch: "#0a1a5c" },
  { id: "plum", label: "Plum", swatch: "#5a2a5e" },
  { id: "crt", label: "CRT night mode", swatch: "#0c140c" },
] as const;
export type Wallpaper = (typeof WALLPAPERS)[number]["id"];
const WALLPAPER_KEY = "maos-wallpaper";
const WALLPAPER_EVENT = "maos:wallpaper";

function applyWallpaper(id: Wallpaper) {
  const root = document.querySelector<HTMLElement>(".retro-root");
  if (root) root.dataset.wallpaper = id;
}

/** Change the wallpaper from anywhere (Display menu or the DOS `color` command). */
export function setWallpaper(id: Wallpaper) {
  applyWallpaper(id);
  try {
    window.localStorage.setItem(WALLPAPER_KEY, id);
  } catch {}
  window.dispatchEvent(new CustomEvent<Wallpaper>(WALLPAPER_EVENT, { detail: id }));
}

export function WallpaperMenu() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Wallpaper>("teal");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let saved: Wallpaper = "teal";
    try {
      const value = window.localStorage.getItem(WALLPAPER_KEY);
      if (WALLPAPERS.some((w) => w.id === value)) saved = value as Wallpaper;
    } catch {}
    applyWallpaper(saved);
    const id = window.setTimeout(() => setCurrent(saved), 0);
    const onChange = (event: Event) => setCurrent((event as CustomEvent<Wallpaper>).detail);
    window.addEventListener(WALLPAPER_EVENT, onChange);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(WALLPAPER_EVENT, onChange);
      const root = document.querySelector<HTMLElement>(".retro-root");
      if (root) delete root.dataset.wallpaper;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => !ref.current?.contains(event.target as Node) && setOpen(false);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="r-btn px-2 py-0.5 text-[11px]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Display properties"
        onClick={() => setOpen((v) => !v)}
      >
        ▦ <span className="hidden sm:inline">Display</span>
      </button>
      {open ? (
        <div role="menu" className="r-box absolute top-[calc(100%+6px)] right-0 z-50 w-52 p-[3px]">
          <div className="r-title">
            <span>Display Properties</span>
          </div>
          <div className="grid gap-1 bg-[#c0c0c0] p-2">
            <p className="r-label text-[11px]">WALLPAPER:</p>
            {WALLPAPERS.map((w) => (
              <button
                key={w.id}
                type="button"
                role="menuitemradio"
                aria-checked={current === w.id}
                className={`flex items-center gap-2 px-1.5 py-1 text-left text-[12px] ${current === w.id ? "bg-[#000080] text-white" : "hover:bg-[#d0d4d8]"}`}
                onClick={() => {
                  setWallpaper(w.id);
                  setOpen(false);
                }}
              >
                <span className="h-3.5 w-5 border border-black" style={{ background: w.swatch }} aria-hidden="true" />
                {w.label}
              </button>
            ))}
            <p className="pt-1 text-[10.5px] text-[#3e4949]">Tip: type COLOR CRT in the terminal.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Click sounds (always on) + "ready" flag for the hourglass cursor    */
/* ------------------------------------------------------------------ */

export function ClickSounds() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".retro-root");
    if (root) root.dataset.ready = "1";
    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      // Controls that play their own sound opt out with data-sfx.
      if (target?.closest("[data-sfx]")) return;
      if (target?.closest(".r-btn, .r-ctl, [role='tab'], [role='menuitemradio']")) sfx.tick();
    };
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("click", click, true);
      if (root) delete root.dataset.ready;
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* Boot screen: first visit per session (or `reboot`), under a second  */
/* ------------------------------------------------------------------ */

const BOOT_KEY = "maos-booted";
export const REBOOT_EVENT = "maos:reboot";
const BOOT_LINES = [
  "MA/OS BIOS v4.0  (C) hitrocker.dev",
  "CPU: LLM-EVAL CORE @ 60Hz ........ OK",
  "Memory test: 640K ................ OK",
  `Loading ${profile.name.toUpperCase()}.EXE ...`,
];

export function BootScreen() {
  const [phase, setPhase] = useState<"boot" | "fade" | "done">("boot");
  const [run, setRun] = useState(0);

  useEffect(() => {
    const onReboot = () => {
      delete document.documentElement.dataset.maosBooted;
      window.scrollTo({ top: 0 });
      setPhase("boot");
      setRun((r) => r + 1);
    };
    window.addEventListener(REBOOT_EVENT, onReboot);
    return () => window.removeEventListener(REBOOT_EVENT, onReboot);
  }, []);

  useEffect(() => {
    let booted = false;
    try {
      booted = window.sessionStorage.getItem(BOOT_KEY) === "1";
      window.sessionStorage.setItem(BOOT_KEY, "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ((booted && run === 0) || reduce) {
      const id = window.setTimeout(() => setPhase("done"), 0);
      return () => window.clearTimeout(id);
    }
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setPhase("done");
      sfx.chime();
    };
    const fade = window.setTimeout(() => setPhase("fade"), 750);
    const done = window.setTimeout(finish, 1000);
    // Skip on the next key/tap (ignore the click/keypress that triggered a reboot).
    const arm = window.setTimeout(() => {
      window.addEventListener("keydown", finish);
      window.addEventListener("pointerdown", finish);
    }, 150);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
      window.clearTimeout(arm);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, [run]);

  if (phase === "done") return null;
  return (
    <>
      {/* Hide instantly (before paint) when this session has already booted. */}
      {run === 0 ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("${BOOT_KEY}")==="1")document.documentElement.dataset.maosBooted="1"}catch(e){}`,
          }}
        />
      ) : null}
      <div key={run} className={`r-boot ${phase === "fade" ? "r-boot--fade" : ""}`} aria-hidden="true">
        <div className="r-term text-[22px] leading-7 text-[#33ff33]">
          {BOOT_LINES.map((line, i) => (
            <p key={line} className="r-boot-line" style={{ animationDelay: `${i * 140}ms` }}>
              {line}
            </p>
          ))}
          <p className="mt-3 text-[#9cff9c]/70">
            Press any key to skip<span className="r-cursor">█</span>
          </p>
        </div>
      </div>
    </>
  );
}
