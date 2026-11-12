"use client";

import { profile } from "@/lib/content";
import { FormEvent, useState } from "react";

// Same Web3Forms setup as the main site's contact form.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type SendState = "idle" | "sending" | "sent" | "error";

export function RetroContact() {
  const [state, setState] = useState<SendState>("idle");
  const [log, setLog] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("company") ?? "")) return;
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`Portfolio note from ${name}`);
      const body = encodeURIComponent(`${message}\n\n- ${name}\n${email}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setLog(">> No mail relay configured. Opening your mail app...");
      return;
    }

    setState("sending");
    setLog(">> Transmitting...");
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
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (!response.ok || !result?.success) throw new Error("send failed");
      form.reset();
      setState("sent");
      setLog(">> [STATUS: SUCCESS] Message delivered. I'll reply by email.");
    } catch {
      setState("error");
      setLog(`>> [ERROR] Transmission failed. Email me directly: ${profile.email}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative z-[3] mt-5 grid gap-4">
      <label aria-hidden="true" style={{ position: "absolute", left: -9999, top: 0 }}>
        Leave empty
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 r-label text-[12px] text-[#9cff9c]">
          CALLSIGN / NAME:
          <input name="name" required placeholder="e.g. Ada Lovelace" autoComplete="name" />
        </label>
        <label className="grid gap-1.5 r-label text-[12px] text-[#9cff9c]">
          RETURN CONDUIT (EMAIL):
          <input name="email" type="email" required placeholder="name@company.com" autoComplete="email" />
        </label>
      </div>
      <label className="grid gap-1.5 r-label text-[12px] text-[#9cff9c]">
        MISSION DIRECTIVE / PAYLOAD:
        <textarea
          name="message"
          required
          rows={4}
          placeholder="What should we build or evaluate? For eval work, include the model family."
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="r-term text-[20px] leading-6">
          C:\USERS\AHMED&gt; SEND /TO=INBOX<span className="r-cursor">█</span>
        </p>
        <button type="submit" className="r-btn" disabled={state === "sending"}>
          {state === "sending" ? "SENDING..." : "[ DISPATCH MESSAGE ]"}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`min-h-5 text-[13px] ${state === "error" ? "text-[#ffb000]" : "text-[#33ff33]"}`}
      >
        {log}
      </p>
    </form>
  );
}
