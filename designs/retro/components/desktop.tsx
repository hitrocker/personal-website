import {
  ArrowPuzzleVisual,
  Grid2048Visual,
  MazeVisual,
  SkyHopperVisual,
} from "@/components/game-previews";
import {
  about,
  contact,
  education,
  experience,
  hero,
  profile,
  projects,
  skillGroups,
  type Project,
} from "@/lib/content";
import { isHttpUrl } from "@/lib/site";
import type { ReactNode } from "react";
import { ArcadeCabinet } from "./arcade";
import { RetroClock } from "./clock";
import { DosPrompt, TerminalShortcut } from "./dos-prompt";
import { BootScreen, ClickSounds, WallpaperMenu } from "./extras";
import { RetroContact } from "./retro-contact";
import { Taskbar, WinFrame, type Task } from "./windows";

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function Win(props: Parameters<typeof WinFrame>[0]) {
  return <WinFrame {...props} />;
}

function SubWin({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`r-box p-[3px] ${className}`}>
      <div className="r-title r-title--teal">
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Bar({ filled, tone = "teal" }: { filled: number; tone?: "teal" | "green" | "navy" }) {
  const cls = tone === "green" ? "r-bar r-bar--green" : tone === "navy" ? "r-bar r-bar--navy" : "r-bar";
  return (
    <div className={`${cls} r-sunken`} aria-hidden="true">
      {Array.from({ length: 20 }, (_, i) => (
        <i key={i} className={i < filled ? "on" : ""} />
      ))}
    </div>
  );
}

const fileName = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");

function ProjectVisual({ project }: { project: Project }) {
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

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

// Real numbers only, all taken from the project data on the main site.
const GAUGES = [
  { label: "SHIPPED", value: "4", unit: "GAMES", note: "LIVE ON GOOGLE PLAY", filled: 20, tone: "green" as const },
  { label: "CONTENT", value: "9,285", unit: "LEVELS", note: "6,500 PAINTMAZE + 2,785 ARROW", filled: 17, tone: "teal" as const },
  { label: "QUALITY", value: "39", unit: "TESTS", note: "24 JUNIT + 15 UNITY", filled: 13, tone: "navy" as const },
  { label: "EVALUATION", value: "3", unit: "MODEL FAMILIES", note: "OPENAI · ANTHROPIC · GOOGLE", filled: 15, tone: "green" as const },
];

// Running record numbers across all skill tables, like a single .DBF file.
const rowOffsets = skillGroups.map((_, index) =>
  skillGroups.slice(0, index).reduce((total, group) => total + group.items.length, 0),
);

const TASKS: Task[] = [
  { wid: "profile", href: "#about", label: "Profile.exe" },
  { wid: "experience", href: "#experience", label: "Experience.log" },
  { wid: "projects", href: "#projects", label: "Projects.dir" },
  { wid: "skills", href: "#skills", label: "Skills.dbf" },
  { wid: "contact", href: "#contact", label: "Command.com" },
];

export function RetroDesktop() {
  const current = experience.find((item) => item.current) ?? experience[0];

  return (
    <>
      <BootScreen />
      <ClickSounds />
      {/* 1. Top system menu bar */}
      <header className="r-topbar r-box flex items-center justify-between gap-3 px-2 py-1 shadow-none">
        <div className="flex min-w-0 items-center gap-3">
          <a href="#about" className="r-btn px-2 py-0.5 text-[11px]">
            <span className="text-[#000080]">■</span> MA/OS
          </a>
          <nav className="hidden items-center gap-4 r-label text-[12px] lg:flex" aria-label="Sections">
            {TASKS.map((task) => (
              <a key={task.href} href={task.href} className="hover:bg-[#000080] hover:text-white">
                [{task.label.split(".")[0]}]
              </a>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 r-label text-[11px]">
          <TerminalShortcut />
          <WallpaperMenu />
          <span className="r-sunken hidden bg-[#c0c0c0] px-2 py-0.5 sm:inline">
            <span className="text-[#00860a]">●</span> OPEN TO WORK
          </span>
          <a href={profile.cvHref} className="r-btn px-2 py-0.5 text-[11px]">
            CV.PDF
          </a>
          <span className="r-sunken bg-[#c0c0c0] px-2 py-0.5">
            <RetroClock />
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)] gap-6 px-3 pt-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-2 r-label text-[11px] text-white">
          <span className="r-path bg-black/30 px-2 py-0.5">C:\PORTFOLIO\{fileName(profile.name)}.EXE</span>
          <span className="r-path bg-black/30 px-2 py-0.5">STATION: HITROCKER.DEV {"//"} {profile.role.toUpperCase()}</span>
        </div>

        {/* 2. Profile window */}
        <Win wid="profile" id="about" title={`C:\\SYS\\WORKSTATION\\PROFILE - ${profile.name} (${profile.role})`} menu>
          <div className="r-paper grid gap-8 p-4 sm:p-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.55fr)_minmax(400px,1fr)]">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2.5">
                <span className="r-pill">
                  <span className="text-[#2f8a2f]">●</span> STATUS: {hero.availability.toUpperCase()}
                </span>
                {current ? (
                  <span className="r-pill">
                    ROLE: {current.role.toUpperCase()} @ {current.organization.toUpperCase()}
                  </span>
                ) : null}
                <span className="r-pill">HITROCKER.DEV {"//"} ONLINE</span>
              </div>

              <p className="mt-6 r-label text-[12px] text-[#2e7d78]">
                {"// OPERATOR DOSSIER: "}
                {profile.name.toUpperCase()} [SYS//HITROCKER]
              </p>
              <h1 className="r-headline mt-2 text-[clamp(1.7rem,4.6vw,2.6rem)]">
                LLM <mark>Engineer</mark> &amp; Software Developer
              </h1>
              <p className="mt-2 text-[12.5px] text-[#3e4949]">
                {about.heading} {about.headingAccent} Evaluating frontier models since 2024.
              </p>

              <p className="r-lead mt-6 px-4 py-3.5 text-[14px] leading-[1.6rem]">{hero.lead}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href={profile.cvHref} className="r-btn r-btn--lg">
                  <span aria-hidden="true">▤</span> [OPEN RESUME.PDF]
                </a>
                <a href="#projects" className="r-btn r-btn--lg">
                  <span aria-hidden="true">▢</span> [BROWSE ARTIFACTS.DIR]
                </a>
                <a href="#contact" className="r-btn r-btn--lg text-[#000080]">
                  <span aria-hidden="true">▷</span> [MESSAGE / PING]
                </a>
              </div>

              <dl className="r-spec mt-6 grid gap-3 px-3 py-3 text-[11.5px] sm:grid-cols-3">
                <div>
                  <dt className="text-[#3e4949]">CURRENT ROLE</dt>
                  <dd className="mt-1 r-label text-[#2e7d78]">
                    {current?.organization.toUpperCase()} [{current?.dates.split("–")[0]?.trim().toUpperCase()} – NOW]
                  </dd>
                </div>
                <div>
                  <dt className="text-[#3e4949]">EVAL STACK</dt>
                  <dd className="mt-1 r-label text-[#000080]">RLHF · LLM + VLM</dd>
                </div>
                <div>
                  <dt className="text-[#3e4949]">SHIP LEVEL</dt>
                  <dd className="mt-1 r-label text-[#8a1c1c]">{projects.length} GAMES ON PLAY</dd>
                </div>
              </dl>
            </div>

            <ArcadeCabinet />
          </div>
        </Win>

        <Win wid="readme" title="C:\SYS\README.TXT - Notepad" variant="teal">
          <div className="r-paper grid gap-3 p-4 text-[13px] leading-6 sm:p-6 md:grid-cols-3">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Win>

        {/* 3. Telemetry gauges */}
        <Win wid="perfmon" title="PERFMON.EXE - Live Telemetry & System Gauges" right="BUS: PLAY-STORE // EVAL-LAB">
          <div className="grid gap-3 bg-[#c0c0c0] p-3 sm:grid-cols-2 lg:grid-cols-4">
            {GAUGES.map((gauge, index) => (
              <div key={gauge.label} className="r-sunken r-paper p-3">
                <div className="flex justify-between r-label text-[10px]">
                  <span className="text-[#3e4949]">[GAUGE 0{index + 1}]</span>
                  <span className="text-[#006565]">{gauge.label}</span>
                </div>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="r-ui text-[2rem] leading-none font-bold">{gauge.value}</span>
                  <span className="r-label text-[11px] text-[#3e4949]">{gauge.unit}</span>
                </p>
                <p className="mt-2 r-label text-[10px] text-[#00860a]">▲ {gauge.note}</p>
                <div className="mt-3">
                  <Bar filled={gauge.filled} tone={gauge.tone} />
                </div>
              </div>
            ))}
          </div>
        </Win>

        {/* 4. Experience */}
        <Win
          wid="experience"
          id="experience"
          title="C:\LOGS\EXPERIENCE.LOG - Evaluation Assignments"
          variant="teal"
          right={`${experience.length} RECORD(S)`}
        >
          <div className="grid gap-4 bg-[#c0c0c0] p-3 lg:grid-cols-2">
            {experience.map((item) => (
              <SubWin
                key={item.id}
                title={`${fileName(item.organization)}.LOG // ${item.dates.toUpperCase()}`}
              >
                <div className="r-paper p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="r-ui text-[1.35rem] leading-tight font-bold">{item.role}</h3>
                      <p className="r-label text-[12px] text-[#006565]">{item.organization.toUpperCase()}</p>
                    </div>
                    {item.current ? <span className="r-chip">● ACTIVE</span> : <span className="r-chip r-chip--amber">ARCHIVED</span>}
                  </div>
                  <p className="r-sunken mt-3 bg-white p-3 text-[13px] leading-6">{item.summary}</p>
                  <ul className="mt-3 grid gap-1.5 text-[12.5px] leading-6">
                    {item.points.map((point, i) => (
                      <li key={point} className="grid grid-cols-[3.2em_1fr]">
                        <span className="whitespace-nowrap font-mono text-[#808080]" aria-hidden="true">
                          {i === item.points.length - 1 ? "└──" : "├──"}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.areas.map((area) => (
                      <span key={area} className="r-chip">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </SubWin>
            ))}
          </div>
        </Win>

        {/* 5. Projects */}
        <Win
          wid="projects"
          id="projects"
          title="A:\ARTIFACTS\SHIPPED_GAMES.DIR"
          right={`${projects.length} OBJECT(S) FOUND`}
        >
          <div className="flex items-center gap-2 border-b border-[#808080] bg-[#c0c0c0] px-2 py-1.5">
            <span className="r-label text-[11px]">LOCATION:</span>
            <span className="r-sunken min-w-0 flex-1 truncate bg-white px-2 py-0.5 text-[12px]">
              A:\PROJECTS\GOOGLE_PLAY\SOLO_DEVELOPER
            </span>
            <span className="r-btn hidden px-2 py-0.5 text-[11px] sm:inline-flex">UP DIR</span>
          </div>
          <div className="grid gap-4 bg-[#c0c0c0] p-3 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.id} className="r-box flex min-w-0 flex-col p-[3px]">
                <div className="r-title r-title--olive">
                  <span>{fileName(project.name)}.EXE</span>
                  <span className="shrink-0 text-[10px] tracking-[0.08em]">{project.kind.toUpperCase()}</span>
                </div>
                <div className="r-paper flex flex-1 flex-col p-3">
                  <div className="r-sunken r-bezel mx-auto w-full max-w-[420px] bg-black p-1">
                    <ProjectVisual project={project} />
                  </div>
                  <h3 className="r-ui mt-4 text-[1.25rem] leading-tight font-bold uppercase">
                    {project.name} <span className="text-[#006565]">{"// "}{project.role}</span>
                  </h3>
                  <p className="mt-2 text-[13px] leading-6">{project.summary}</p>
                  <ul className="mt-3 grid gap-1 text-[12px] leading-5 text-[#3e4949]">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="grid grid-cols-[1.4em_1fr]">
                        <span aria-hidden="true">›</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 mb-4 flex flex-wrap gap-1.5">
                    {project.stack.map((item) => (
                      <span key={item} className="r-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-[#808080] pt-3">
                    {project.links
                      .filter((link) => isHttpUrl(link.href))
                      .map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="r-btn"
                        >
                          {link.label === "GitHub" ? "‹› [SOURCE]" : "▶ [PLAY STORE]"}
                        </a>
                      ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Win>

        {/* 6. Tech inventory */}
        <Win
          wid="skills"
          id="skills"
          title="DATABASE_VIEWER.EXE - TECH_INVENTORY.DBF"
          right={`${skillGroups.reduce((total, group) => total + group.items.length, 0)} RECORDS LOADED`}
        >
          <div className="grid gap-4 bg-[#c0c0c0] p-3 md:grid-cols-2">
            {skillGroups.map((group, tableIndex) => (
              <div key={group.id} className="r-box min-w-0 p-[3px]">
                <div className="r-title r-title--teal">
                  <span>
                    [TABLE {tableIndex + 1}]: {group.label.toUpperCase()}
                  </span>
                  <span className="shrink-0 text-[10px]">INDEX: {group.id.toUpperCase()}</span>
                </div>
                <div className="r-sunken overflow-x-auto">
                  <table className="r-table">
                    <thead>
                      <tr>
                        <th className="w-14">FIELD</th>
                        <th>TOOL / METHOD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item, itemIndex) => {
                        const row = rowOffsets[tableIndex] + itemIndex + 1;
                        return (
                          <tr key={item}>
                            <td className="text-[#808080] tabular-nums">{String(row).padStart(2, "0")}</td>
                            <td>
                              <span className="r-link no-underline">{item}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </Win>

        {/* 7. Education */}
        <Win wid="education" title="C:\SYS\ENROLL.SYS - Education" variant="teal">
          <div className="r-paper flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="r-ui text-[1.2rem] font-bold">{education.degree}</p>
              <p className="r-label text-[12px] text-[#006565]">{education.school.toUpperCase()}</p>
            </div>
            <span className="r-chip">{education.dates} {"//"} ENROLLED</span>
          </div>
        </Win>

        {/* 8. MS-DOS contact terminal */}
        <Win wid="contact" id="contact" title="MS-DOS Prompt - [COMMAND.COM - 80x25]">
          <div className="r-crt r-sunken p-4 text-[13px] leading-6 sm:p-6">
            <div className="relative z-[3]">
              <p className="text-[#9cff9c]/80">
                Starting MS-DOS...
                <br />
                HIMEM is testing extended memory... done.
                <br />
                MA/OS kernel loaded. 640K base memory OK.
              </p>
              <DosPrompt />

              <p className="mt-6 text-[#ffb000]">
                &gt;&gt; [STATUS: OPEN] {contact.heading} {contact.headingAccent}
              </p>
              <p className="mt-1 text-[#9cff9c]/80">{contact.body}</p>
              <p className="mt-6 r-label text-[13px] text-white">--- NEW MESSAGE TO {profile.name.toUpperCase()} ---</p>
              <RetroContact />
            </div>
          </div>
        </Win>

        <p className="pb-4 text-center r-label text-[11px] text-white/80">
          © {new Date().getFullYear()} {profile.name}. MA/OS v4.0.
        </p>
      </main>

      {/* 9. Taskbar */}
      <Taskbar tasks={TASKS} />
    </>
  );
}
