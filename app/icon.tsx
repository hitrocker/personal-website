import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// 5x7 pixel glyphs.
const GLYPHS: Record<string, string[]> = {
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
};

function Glyph({ rows, px }: { rows: string[]; px: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {rows.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {row.split("").map((cell, x) => (
            <div key={x} style={{ width: px, height: px, background: cell === "#" ? "#33ff33" : "transparent" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Pixel "MA" favicon for the MA/OS page. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: "#0c140c",
          border: "2px solid #008080",
        }}
      >
        <Glyph rows={GLYPHS.M ?? []} px={2} />
        <Glyph rows={GLYPHS.A ?? []} px={2} />
      </div>
    ),
    size,
  );
}
