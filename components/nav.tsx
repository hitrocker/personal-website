"use client";

import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { navItems, profile } from "@/lib/content";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] nav-blur">
      <nav
        className="grid h-[var(--nav-h)] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-7"
        aria-label="Primary"
      >
        <a
          href="#top"
          className="display justify-self-start text-xl tracking-[-0.06em] text-lime"
          aria-label={`${profile.name} - back to top`}
        >
          {profile.initials}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-[14px] text-muted transition-colors hover:text-[var(--ink)]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <ThemeToggle />
          <a href={profile.cvHref} className="btn btn-ghost hidden h-10 px-4 text-sm sm:inline-flex">
            CV
          </a>
          <a href="#contact" className="btn btn-lime hidden h-10 px-4 text-sm md:inline-flex">
            Let’s talk
          </a>
          <button
            type="button"
            className="icon-link nav-hamburger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="border-t border-[var(--line)] bg-[var(--bg-2)] md:hidden"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
          >
            <ul className="grid px-5 py-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block py-3 text-lg"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="flex gap-3 py-3">
                <a href={profile.cvHref} className="btn btn-ghost">
                  CV
                </a>
                <a href="#contact" className="btn btn-lime" onClick={() => setOpen(false)}>
                  Let’s talk
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
