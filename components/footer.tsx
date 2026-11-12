import { profile } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-[var(--line)] px-[6vw] py-10 text-sm text-muted">
      <p>© {new Date().getFullYear()} {profile.name}. Built as a living CV.</p>
    </footer>
  );
}
