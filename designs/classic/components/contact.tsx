"use client";

import { OutLink } from "@/designs/classic/components/ui/out-link";
import { Reveal } from "@/designs/classic/components/ui/reveal";
import { SectionHeading } from "@/designs/classic/components/ui/section-heading";
import { contact, profile } from "@/lib/content";
import { Check, Copy } from "lucide-react";
import { FormEvent, useState } from "react";

// Web3Forms access keys are designed to be public: they only allow sending to the inbox they were issued for.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type SendState = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");
  const [state, setState] = useState<SendState>("idle");
  const [status, setStatus] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    // Honeypot: real visitors never see or fill this field.
    if (String(data.get("company") ?? "")) return;
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!WEB3FORMS_KEY) {
      // No key configured (e.g. local dev): fall back to the visitor's mail app.
      const subject = encodeURIComponent(`Portfolio note from ${name}`);
      const body = encodeURIComponent(`${message}\n\n- ${name}\n${email}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("Opening your mail app…");
      return;
    }

    setState("sending");
    setStatus("Sending…");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio note from ${name}`,
          from_name: "hitrocker.dev contact form",
          name,
          email,
          message,
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || `Request failed (${response.status})`);
      }
      form.reset();
      setState("sent");
      setStatus("Thanks - your message is in my inbox. I’ll reply by email.");
    } catch {
      setState("error");
      setStatus(`Couldn’t send that. Please email me directly at ${profile.email}.`);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
    window.setTimeout(() => setCopied("idle"), 1800);
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
            <button
              type="submit"
              className="btn btn-lime justify-self-start disabled:cursor-wait disabled:opacity-60"
              disabled={state === "sending"}
            >
              {state === "sending" ? "Sending…" : "Send message"}
            </button>
            <p
              role="status"
              aria-live="polite"
              className={`min-h-6 text-sm ${
                state === "sent" ? "text-lime" : state === "error" ? "text-[#ff8a7a]" : "text-muted"
              }`}
            >
              {status}
            </p>
          </form>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="card grid gap-3 p-7">
            <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
              Direct
            </p>
            <div className="flex items-center gap-2">
              <a href={`mailto:${profile.email}`} className="text-xl break-all">
                {profile.email}
              </a>
              <button
                type="button"
                className="icon-link shrink-0"
                aria-label={
                  copied === "copied" ? "Email copied" : copied === "failed" ? "Copy failed" : "Copy email"
                }
                onClick={copyEmail}
              >
                {copied === "copied" ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
            {copied === "failed" ? (
              <p className="text-sm text-muted" role="status">
                Couldn’t copy automatically - select the address above instead.
              </p>
            ) : null}
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
