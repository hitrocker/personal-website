"use client";

import { OutLink } from "@/components/ui/out-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { contact, profile } from "@/lib/content";
import { Check, Copy } from "lucide-react";
import { FormEvent, useState } from "react";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (String(data.get("company") ?? "")) return;
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio note from ${name}`);
    const body = encodeURIComponent(`${message}\n\n- ${name}\n${email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus("Opening your mail client…");
  };

  return (
    <section id="contact" className="section-pad relative z-[1]">
      <Reveal>
        <SectionHeading
          kicker="Contact"
          title={contact.heading}
          accent={contact.headingAccent}
          description={contact.body}
        />
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <label className="absolute -left-[9999px]">
              Don’t fill this
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Name
              <input
                name="name"
                required
                placeholder="Your name"
                className="rounded-[14px] border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3.5 text-[var(--ink)] outline-none focus:border-[var(--lime)]"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="rounded-[14px] border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3.5 text-[var(--ink)] outline-none focus:border-[var(--lime)]"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Message
              <textarea
                name="message"
                required
                rows={5}
                placeholder="What should we build or evaluate?"
                className="rounded-[14px] border border-[var(--line)] bg-[var(--bg-2)] px-4 py-3.5 text-[var(--ink)] outline-none focus:border-[var(--lime)]"
              />
            </label>
            <button type="submit" className="btn btn-lime justify-self-start">
              Send message
            </button>
            <p className="min-h-6 text-sm text-muted">{status}</p>
          </form>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="card grid gap-3 p-7">
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
              Direct
            </p>
            <div className="flex items-center gap-2">
              <a href={`mailto:${profile.email}`} className="text-xl break-all">
                {profile.email}
              </a>
              <button
                type="button"
                className="icon-link shrink-0"
                aria-label={copied ? "Email copied" : "Copy email"}
                onClick={async () => {
                  await navigator.clipboard.writeText(profile.email);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
            <a href={`tel:${profile.phoneE164}`} className="text-lg">
              {profile.phoneDisplay}
            </a>
            <OutLink href={profile.social.linkedin} className="text-lg">
              LinkedIn
            </OutLink>
            <OutLink href={profile.social.github} className="text-lg">
              GitHub
            </OutLink>
            <a href={profile.cvHref} className="text-lg">
              Printable résumé
            </a>
            <p className="mt-3 text-sm text-muted">
              For eval work, include the model family and what you need reviewed.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
