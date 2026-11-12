import { profile, projects } from "@/lib/content";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `MA/OS - ${profile.name}, ${profile.role}`;

/** Social preview for the MA/OS (retro desktop) version of the portfolio. */
export default function OpenGraphImage() {
  const bevel = {
    borderTop: "4px solid #ffffff",
    borderLeft: "4px solid #ffffff",
    borderRight: "4px solid #404040",
    borderBottom: "4px solid #404040",
  };
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#008080",
          padding: 48,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "#c0c0c0", padding: 6, ...bevel }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 16px",
              background: "linear-gradient(90deg, #000080, #1084d0)",
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            <span>C:\SYS\PROFILE.EXE - MA/OS</span>
            <span style={{ display: "flex", gap: 6 }}>
              {["min", "max", "close"].map((c) => (
                <span
                  key={c}
                  style={{ display: "flex", width: 32, height: 28, alignItems: "center", justifyContent: "center", background: "#c0c0c0", color: "#000", fontSize: 18, ...bevel, borderWidth: 2 }}
                >
                  {c === "min" ? "_" : c === "close" ? "×" : <span style={{ display: "flex", width: 12, height: 10, border: "2px solid #000", borderTopWidth: 3 }} />}
                </span>
              ))}
            </span>
          </div>
          <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", background: "#f4eddd", padding: "40px 56px" }}>
            <div style={{ display: "flex", fontSize: 24, color: "#2e7d78", fontWeight: 700 }}>
              {"// OPERATOR DOSSIER: "}
              {profile.name.toUpperCase()}
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 18, fontSize: 76, fontWeight: 700, color: "#1e1c12", letterSpacing: 1 }}>
              <span>LLM&nbsp;</span>
              <span style={{ background: "#2e7d78", color: "#ffffff", padding: "0 14px" }}>ENGINEER</span>
            </div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#1e1c12" }}>&amp; SOFTWARE DEVELOPER</div>
            <div style={{ display: "flex", marginTop: 26, fontSize: 26, color: "#3e4949" }}>
              RLHF · LLM + VLM evaluation · {projects.length} games on Google Play
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, color: "#ffffff", fontSize: 22 }}>
          <span>hitrocker.dev</span>
          <span>C:\USERS\AHMED&gt; type HELP_</span>
        </div>
      </div>
    ),
    size,
  );
}
