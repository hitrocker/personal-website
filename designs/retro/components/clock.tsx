"use client";

import { useEffect, useState } from "react";

/** Taskbar-style clock. Renders nothing until mounted so server and client markup match. */
export function RetroClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 15_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  if (!now) return <span className="inline-block w-[58px]" aria-hidden="true" />;
  return (
    <time dateTime={now.toISOString()} className="tabular-nums">
      {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
    </time>
  );
}
