import { siteConfig } from "@/lib/site";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.title;

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07070b",
          color: "#f3eee4",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, color: "#c6ff4a" }}>
          LLM Engineer / Software Developer
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.06em" }}>Muhammad</div>
          <div style={{ fontSize: 88, fontStyle: "italic", color: "#e8c9a0" }}>Ahmed</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#9b9588" }}>
          RLHF, frontier evaluation, and independently shipped software.
        </div>
      </div>
    ),
    size,
  );
}
