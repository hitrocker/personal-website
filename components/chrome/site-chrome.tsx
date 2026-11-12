"use client";

import { AmbientField } from "@/components/chrome/ambient-field";
import { useEffect, useRef, useState } from "react";

export function SiteChrome() {
  const [hot, setHot] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) {
      document.body.classList.add("has-cursor");
    }

    const onMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty("--sx", `${event.clientX}px`);
      document.documentElement.style.setProperty("--sy", `${event.clientY}px`);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      }
      const target = event.target as HTMLElement | null;
      setHot(Boolean(target?.closest("a, button, [role='button'], input, textarea")));
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) {
        progressRef.current.style.width = `${value * 100}%`;
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <AmbientField />
      <div className="spotlight" aria-hidden="true" />
      <div ref={progressRef} className="progress" aria-hidden="true" />
      <div
        ref={cursorRef}
        className={`cursor ${hot ? "is-hot" : ""}`}
        aria-hidden="true"
      >
        <div className="cursor-dot" />
        <div className="cursor-ring" />
      </div>
    </>
  );
}
