"use client";

import { education, experience, hero, profile, projects, skillGroups } from "@/lib/content";
import { isHttpUrl } from "@/lib/site";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { REBOOT_EVENT, setWallpaper, WALLPAPERS, type Wallpaper } from "./extras";
import { sfx } from "./sfx";

type Line = { id: number; kind: "cmd" | "out" | "err"; text: ReactNode };

const PROMPT = "C:\\USERS\\AHMED>";

const HELP = [
  "Available commands:",
  "  HELP          this list",
  "  WHOAMI        who I am",
  "  STATUS        what I'm open to",
  "  EXPERIENCE    roles and dates",
  "  PROJECTS      shipped games",
  "  PLAY <n>      open game n on Google Play",
  "  SKILLS        tech inventory",
  "  EDUCATION     degree",
  "  CV            open my resume",
  "  GITHUB / LINKEDIN / EMAIL",
  "  CONTACT       jump to the message form",
  "  COLOR <name>  wallpaper: TEAL, NAVY, PLUM or CRT (night mode)",
  "  REBOOT        restart MA/OS",
  "  DATE / VER    system date, version",
  "  CLS           clear the screen",
];

export const CHIPS = ["help", "whoami", "projects", "cv", "color crt", "contact"];

function run(raw: string): { out: ReactNode[]; err?: boolean; clear?: boolean } {
  const [cmd = "", ...args] = raw.trim().split(/\s+/);
  const c = cmd.toLowerCase();
  const playable = projects.filter((p) => p.links.some((l) => isHttpUrl(l.href)));

  switch (c) {
    case "":
      return { out: [] };
    case "help":
    case "?":
      return { out: HELP };
    case "whoami":
      return { out: [`${profile.name} - ${profile.role}`, hero.lead] };
    case "status":
      return { out: [`[STATUS: OPEN] ${hero.availability}.`] };
    case "experience":
    case "exp":
      return {
        out: experience.flatMap((item) => [
          `${item.dates.padEnd(22)} ${item.role} @ ${item.organization}`,
          `${" ".repeat(23)}${item.summary}`,
        ]),
      };
    case "projects":
    case "dir":
    case "ls":
      return {
        out: [
          " Directory of A:\\SHIPPED_GAMES",
          ...projects.map((p, i) => `  ${i + 1}. ${p.name.toUpperCase().padEnd(14)} ${p.kind}`),
          `  ${projects.length} file(s). Type PLAY <n> to open one on Google Play.`,
        ],
      };
    case "play":
    case "open": {
      const n = Number(args[0]);
      const project = projects[n - 1] ?? playable.find((p) => p.name.toLowerCase().startsWith((args[0] ?? "").toLowerCase()));
      const link = project?.links.find((l) => l.label !== "GitHub" && isHttpUrl(l.href)) ?? project?.links.find((l) => isHttpUrl(l.href));
      if (!project || !link) return { out: ["Usage: PLAY <n>   (see PROJECTS)"], err: true };
      window.open(link.href, "_blank", "noopener,noreferrer");
      return { out: [`Launching ${project.name} (${link.label})...`] };
    }
    case "skills":
      return { out: skillGroups.map((g) => `${g.label.toUpperCase().padEnd(20)} ${g.items.join(", ")}`) };
    case "education":
    case "edu":
      return { out: [`${education.degree} - ${education.school} (${education.dates})`] };
    case "cv":
    case "resume":
      window.open(profile.cvHref, "_blank");
      return { out: ["Opening RESUME.PDF..."] };
    case "github":
      window.open(profile.social.github, "_blank", "noopener,noreferrer");
      return { out: ["Opening GitHub..."] };
    case "linkedin":
      window.open(profile.social.linkedin, "_blank", "noopener,noreferrer");
      return { out: ["Opening LinkedIn..."] };
    case "email":
    case "mail":
      return { out: [<a key="m" className="underline" href={`mailto:${profile.email}`}>{profile.email}</a>] };
    case "contact":
    case "message": {
      const field = document.querySelector<HTMLInputElement>('#contact input[name="name"]');
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => field?.focus({ preventScroll: true }), 350);
      return { out: ["Message form ready below. Fill it in and press DISPATCH."] };
    }
    case "cls":
    case "clear":
      return { out: [], clear: true };
    case "ver":
      return { out: ["MA/OS Version 4.0 (portfolio edition)"] };
    case "date":
    case "time":
      return { out: [`Current date is ${new Date().toLocaleString()}`] };
    case "color":
    case "colour":
    case "wallpaper": {
      const name = (args[0] ?? "").toLowerCase();
      const match = WALLPAPERS.find((w) => w.id === name);
      if (!match) return { out: [`Usage: COLOR ${WALLPAPERS.map((w) => w.id.toUpperCase()).join(" | ")}`], err: true };
      setWallpaper(match.id as Wallpaper);
      return { out: [`Wallpaper set to ${match.label}.`] };
    }
    case "reboot":
    case "restart":
      window.setTimeout(() => window.dispatchEvent(new Event(REBOOT_EVENT)), 250);
      return { out: ["Rebooting MA/OS..."] };
    case "exit":
    case "quit":
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
      return { out: ["Closing COMMAND.COM... thanks for stopping by."] };
    case "sudo":
      return { out: ["Nice try. This is DOS - everyone is root here."] };
    default:
      return { out: [`Bad command or file name: ${cmd}. Type HELP.`], err: true };
  }
}

/** A typeable MS-DOS prompt answering from the real portfolio content. */
export function DosPrompt() {
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: "out", text: "Type HELP for a list of commands. Try WHOAMI or PROJECTS." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const nextId = useRef(1);
  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Real "last login": the visitor's own previous visit, from this browser.
  useEffect(() => {
    let previous: string | null = null;
    try {
      previous = window.localStorage.getItem("maos-last-login");
      window.localStorage.setItem("maos-last-login", new Date().toISOString());
    } catch {}
    const text = previous
      ? `Last login: ${new Date(previous).toLocaleString()}`
      : "Last login: never - welcome, new user!";
    const id = window.setTimeout(
      () => setLines((prev) => [{ id: nextId.current++, kind: "out", text }, ...prev]),
      0,
    );
    return () => window.clearTimeout(id);
  }, []);

  const execute = (raw: string) => {
    setInput("");
    setCursor(-1);
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30));
    const result = run(raw);
    if (result.err) sfx.error();
    const make = (kind: Line["kind"], text: ReactNode): Line => ({ id: nextId.current++, kind, text });
    if (result.clear) {
      setLines([]);
      return;
    }
    setLines((prev) => [
      ...prev,
      make("cmd", raw),
      ...result.out.map((text) => make(result.err ? "err" : "out", text)),
    ]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.length === 1 || event.key === "Backspace") sfx.key();
    if (event.key === "Enter") {
      event.preventDefault();
      execute(input);
    } else if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      setCursor(next);
      setInput(history[next] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = cursor - 1;
      setCursor(next);
      setInput(next < 0 ? "" : (history[next] ?? ""));
    }
  };

  return (
    <div className="relative z-[3] mt-4" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div ref={screenRef} className="max-h-[320px] overflow-y-auto pr-1" aria-live="polite">
        {lines.map((line) =>
          line.kind === "cmd" ? (
            <p key={line.id} className="mt-2 text-[#33ff33]">
              {PROMPT} <span className="text-white">{line.text}</span>
            </p>
          ) : (
            <p key={line.id} className={`whitespace-pre-wrap ${line.kind === "err" ? "text-[#ffb000]" : "text-[#9cff9c]"}`}>
              {line.text}
            </p>
          ),
        )}
      </div>
      <label className="mt-2 flex items-center gap-2 text-[#33ff33]">
        <span className="shrink-0">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="MS-DOS command"
          placeholder="type HELP and press Enter"
          className="r-dos-input"
        />
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Quick commands">
        <span className="r-label text-[11px] text-[#9cff9c]/70">QUICK:</span>
        {CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            className="r-dos-chip"
            onClick={(event) => {
              event.stopPropagation();
              sfx.key();
              execute(chip);
            }}
          >
            {chip.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Menu-bar shortcut that jumps to the terminal and focuses the prompt. */
export function TerminalShortcut() {
  return (
    <button
      type="button"
      className="r-btn px-2 py-0.5 text-[11px]"
      aria-label="Open the terminal"
      onClick={() => {
        const input = document.querySelector<HTMLInputElement>("input.r-dos-input");
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => input?.focus({ preventScroll: true }), 450);
      }}
    >
      ▶ <span className="hidden sm:inline">Terminal</span>
    </button>
  );
}
