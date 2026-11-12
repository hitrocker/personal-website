import type { ReactNode } from "react";
import { RetroClock } from "./clock";

const BARS = { navy: "r-title", teal: "r-title r-title--teal", olive: "r-title r-title--olive" } as const;

/** A classic window frame: title bar with (decorative) controls, optional menu strip, then the body. */
export function WinFrame({
  id,
  title,
  variant = "navy",
  right,
  menu = false,
  className = "",
  children,
}: {
  wid?: string;
  id?: string;
  title: string;
  variant?: keyof typeof BARS;
  right?: ReactNode;
  menu?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`r-box scroll-mt-14 p-[3px] ${className}`}>
      <div className={BARS[variant]}>
        <span>{title}</span>
        <span className="flex shrink-0 items-center gap-2">
          {right ? <span className="hidden text-[11px] font-bold opacity-90 sm:inline">{right}</span> : null}
          <span className="flex gap-[2px]" aria-hidden="true">
            <span className="r-ctl">_</span>
            <span className="r-ctl">□</span>
            <span className="r-ctl">×</span>
          </span>
        </span>
      </div>
      {menu ? (
        <div className="r-menu r-label font-normal tracking-normal" aria-hidden="true">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Options</span>
          <span>Help</span>
        </div>
      ) : null}
      {children}
    </section>
  );
}

export type Task = { wid: string; href: string; label: string };

export function Taskbar({ tasks }: { tasks: Task[] }) {
  return (
    <footer className="r-taskbar r-box flex items-center gap-2 px-1.5 py-1 shadow-none">
      <a href="#about" className="r-btn px-2 py-0.5 text-[11px]">
        <span className="text-[#008080]">▚</span> Start
      </a>
      <nav className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto" aria-label="Windows">
        {tasks.map((task) => (
          <a key={task.wid} href={task.href} className="r-btn shrink-0 px-2 py-0.5 text-[11px] normal-case">
            {task.label}
          </a>
        ))}
      </nav>
      <span className="r-sunken shrink-0 bg-[#c0c0c0] px-2 py-0.5 r-label text-[11px]">
        <RetroClock />
      </span>
    </footer>
  );
}
