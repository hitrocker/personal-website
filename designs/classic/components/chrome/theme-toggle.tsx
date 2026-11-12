"use client";

import { Moon, Sun } from "lucide-react";

function applyTheme(theme: "dark" | "light") {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      className="icon-link"
      aria-label="Toggle theme"
      onClick={() => {
        const next =
          document.documentElement.dataset.theme === "light" ? "dark" : "light";
        applyTheme(next);
      }}
    >
      <Sun size={16} className="theme-sun" />
      <Moon size={16} className="theme-moon" />
    </button>
  );
}
