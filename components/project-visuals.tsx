"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";

type Dir = "left" | "right" | "up" | "down";

type Tile = {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
};

const TILE_COLORS: Record<number, { bg: string; fg: string }> = {
  2: { bg: "#EEE4DA", fg: "#776E65" },
  4: { bg: "#EDE0C8", fg: "#776E65" },
  8: { bg: "#F2B179", fg: "#F9F6F2" },
  16: { bg: "#F59563", fg: "#F9F6F2" },
  32: { bg: "#F67C5F", fg: "#F9F6F2" },
  64: { bg: "#F65E3B", fg: "#F9F6F2" },
  128: { bg: "#EDCF72", fg: "#F9F6F2" },
  256: { bg: "#EDCC61", fg: "#776E65" },
  512: { bg: "#EDC850", fg: "#776E65" },
};

const DEMO_DIRS: Dir[] = ["left", "down", "left", "up", "right", "down", "left", "right"];

function colorFor(value: number) {
  return TILE_COLORS[value] ?? { bg: "#3C3A32", fg: "#F9F6F2" };
}

function mergeLine(line: (Tile | null)[]) {
  const packed = line.filter((tile): tile is Tile => tile !== null);
  const merged: Tile[] = [];
  const absorbed: (Tile | null)[] = [];
  let i = 0;
  while (i < packed.length) {
    const current = packed[i];
    const next = packed[i + 1];
    if (!current) break;
    if (next && next.value === current.value) {
      merged.push({ ...current, value: current.value * 2, isMerged: true, isNew: false });
      absorbed.push({ ...next, isNew: false, isMerged: false });
      i += 2;
    } else {
      merged.push({ ...current, isMerged: false, isNew: false });
      absorbed.push(null);
      i += 1;
    }
  }
  const pad = line.length - merged.length;
  return {
    tiles: [...merged, ...Array.from({ length: pad }, () => null)],
    absorbed: [...absorbed, ...Array.from({ length: pad }, () => null)],
  };
}

function extractLines(grid: (Tile | null)[][], dir: Dir) {
  if (dir === "left") return grid.map((row) => [...row]);
  if (dir === "right") return grid.map((row) => [...row].reverse());
  if (dir === "up") {
    return [0, 1, 2, 3].map((col) => [0, 1, 2, 3].map((row) => grid[row]?.[col] ?? null));
  }
  return [0, 1, 2, 3].map((col) => [0, 1, 2, 3].map((row) => grid[row]?.[col] ?? null).reverse());
}

function writeLines(lines: (Tile | null)[][], dir: Dir) {
  const grid: (Tile | null)[][] = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  if (dir === "left") {
    lines.forEach((line, row) => {
      line.forEach((tile, col) => {
        grid[row][col] = tile ? { ...tile, row, col } : null;
      });
    });
  } else if (dir === "right") {
    lines.forEach((line, row) => {
      line.forEach((tile, pos) => {
        const col = 3 - pos;
        grid[row][col] = tile ? { ...tile, row, col } : null;
      });
    });
  } else if (dir === "up") {
    lines.forEach((line, col) => {
      line.forEach((tile, row) => {
        grid[row][col] = tile ? { ...tile, row, col } : null;
      });
    });
  } else {
    lines.forEach((line, col) => {
      line.forEach((tile, pos) => {
        const row = 3 - pos;
        grid[row][col] = tile ? { ...tile, row, col } : null;
      });
    });
  }
  return grid;
}

function toGrid(tiles: Tile[]) {
  const grid: (Tile | null)[][] = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  for (const tile of tiles) grid[tile.row][tile.col] = tile;
  return grid;
}

function fromGrid(grid: (Tile | null)[][]) {
  return grid.flat().filter((tile): tile is Tile => tile !== null);
}

function moveBoard(tiles: Tile[], dir: Dir) {
  const original = extractLines(toGrid(tiles), dir);
  const results = original.map((line) => mergeLine(line));
  const moved = original.some(
    (line, index) =>
      line.map((tile) => tile?.value ?? 0).join(",") !==
      results[index].tiles.map((tile) => tile?.value ?? 0).join(","),
  );
  const grid = writeLines(
    results.map((result) => result.tiles),
    dir,
  );
  const absorbed = fromGrid(
    writeLines(
      results.map((result) => result.absorbed),
      dir,
    ),
  );
  return { tiles: fromGrid(grid), absorbed, moved };
}

function spawnTile(tiles: Tile[], nextId: number, slot: number) {
  const taken = new Set(tiles.map((tile) => `${tile.row}:${tile.col}`));
  const empty: Array<[number, number]> = [];
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      if (!taken.has(`${row}:${col}`)) empty.push([row, col]);
    }
  }
  if (empty.length === 0) return { tiles, nextId };
  const [row, col] = empty[slot % empty.length] ?? empty[0];
  return {
    tiles: [
      ...tiles.map((tile) => ({ ...tile, isNew: false, isMerged: false })),
      { id: nextId, value: 2, row, col, isNew: true },
    ],
    nextId: nextId + 1,
  };
}

function startBoard(): { tiles: Tile[]; nextId: number } {
  return {
    tiles: [
      { id: 1, value: 2, row: 1, col: 0 },
      { id: 2, value: 2, row: 3, col: 2 },
    ],
    nextId: 3,
  };
}

const SPRING = { type: "spring" as const, stiffness: 280, damping: 22, mass: 0.8 };
const PREVIEW_FRAME = "aspect-square w-full rounded-[1.4rem]";

function useFrameSize(ref: RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(448);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width;
      if (next) setWidth(next);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

export function Grid2048Visual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "80px" });
  const reduce = useReducedMotion();
  const [{ tiles, ghosts, cycle }, setScene] = useState(() => {
    const start = startBoard();
    return { tiles: start.tiles, ghosts: [] as Tile[], cycle: 0 };
  });

  useEffect(() => {
    if (reduce || !inView) return;
    let cancelled = false;
    let dirIndex = 0;
    let spawnSlot = 0;
    let cycle = 0;
    let state = startBoard();
    setScene({ tiles: state.tiles, ghosts: [], cycle });

    const wait = (ms: number) =>
      new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const run = async () => {
      await wait(500);
      while (!cancelled) {
        if (document.hidden) {
          await wait(200);
          continue;
        }
        const dir = DEMO_DIRS[dirIndex % DEMO_DIRS.length] ?? "left";
        dirIndex += 1;
        const result = moveBoard(state.tiles, dir);
        if (!result.moved) {
          await wait(120);
          continue;
        }
        state = { ...state, tiles: result.tiles };
        setScene({ tiles: result.tiles, ghosts: result.absorbed, cycle });
        await wait(320);
        if (cancelled) return;
        const spawned = spawnTile(result.tiles, state.nextId, spawnSlot);
        spawnSlot += 1;
        state = spawned;
        setScene({ tiles: spawned.tiles, ghosts: [], cycle });
        const peaked = spawned.tiles.some((tile) => tile.value >= 64) || spawned.tiles.length >= 9;
        if (peaked) {
          await wait(900);
          if (cancelled) return;
          state = startBoard();
          spawnSlot = 0;
          dirIndex = 0;
          cycle += 1;
          setScene({ tiles: state.tiles, ghosts: [], cycle });
          await wait(420);
        } else {
          await wait(520);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [inView, reduce]);

  const rendered = [...ghosts, ...tiles];

  return (
    <div
      ref={rootRef}
      className={`relative ${PREVIEW_FRAME} p-3.5 sm:p-4`}
      style={{ background: "#BBADA0", containerType: "inline-size" }}
      aria-hidden="true"
    >
      <div className="grid h-full grid-cols-4 grid-rows-4 gap-2.5">
        {Array.from({ length: 16 }, (_, index) => (
          <div key={index} className="rounded-lg" style={{ background: "#CDC1B4" }} />
        ))}
      </div>
      <div key={cycle} className="absolute inset-3.5 grid grid-cols-4 grid-rows-4 gap-2.5 sm:inset-4">
        {rendered.map((tile) => {
          const colors = colorFor(tile.value);
          return (
            <motion.div
              key={tile.id}
              className="tile"
              layout={!reduce}
              style={{
                gridColumn: tile.col + 1,
                gridRow: tile.row + 1,
                background: colors.bg,
                color: colors.fg,
                zIndex: tile.isMerged ? 3 : 2,
              }}
              initial={reduce ? false : tile.isNew ? { scale: 0 } : false}
              animate={
                reduce
                  ? { scale: 1 }
                  : tile.isMerged
                    ? { scale: [1, 1.18, 1] }
                    : { scale: 1 }
              }
              transition={
                tile.isMerged
                  ? { duration: 0.28, times: [0, 0.4, 1], ease: "easeOut" }
                  : tile.isNew
                    ? { type: "spring", stiffness: 380, damping: 16 }
                    : SPRING
              }
            >
              {tile.value}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const MAZE_COLS = 6;
const MAZE_ROWS = 4;
const MAZE_FLOOR = [
  [true, true, true, false, false, false],
  [false, false, true, false, true, true],
  [true, true, true, true, true, false],
  [true, false, false, false, true, true],
];
const MAZE_ROUTE: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
  [2, 2],
  [1, 2],
  [0, 2],
  [0, 3],
];

export function MazeVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frame = useFrameSize(rootRef);
  const inView = useInView(rootRef, { margin: "80px" });
  const reduce = useReducedMotion();
  const [painted, setPainted] = useState(() => new Set(["0:0"]));
  const [ball, setBall] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce || !inView) return;
    let cancelled = false;
    let frame = 0;

    const wait = (ms: number) =>
      new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const stepTo = (from: [number, number], to: [number, number]) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const duration = 160;
        const tick = (now: number) => {
          if (cancelled) {
            resolve();
            return;
          }
          const k = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - k) * (1 - k);
          setBall({
            x: from[0] + (to[0] - from[0]) * eased,
            y: from[1] + (to[1] - from[1]) * eased,
          });
          if (k < 1) {
            frame = window.requestAnimationFrame(tick);
          } else {
            resolve();
          }
        };
        frame = window.requestAnimationFrame(tick);
      });

    const run = async () => {
      await wait(450);
      while (!cancelled) {
        if (document.hidden) {
          await wait(200);
          continue;
        }
        setPainted(new Set(["0:0"]));
        setBall({ x: 0, y: 0 });
        await wait(220);
        for (let i = 1; i < MAZE_ROUTE.length; i += 1) {
          const from = MAZE_ROUTE[i - 1] ?? [0, 0];
          const to = MAZE_ROUTE[i] ?? [0, 0];
          await stepTo(from, to);
          if (cancelled) return;
          setPainted((current) => new Set(current).add(`${to[0]}:${to[1]}`));
          await wait(70);
        }
        await wait(850);
      }
    };

    void run();
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [inView, reduce]);

  const inset = Math.max(22, Math.round(frame * 0.08));
  const gap = Math.max(7, Math.round(frame * 0.02));
  const inner = frame - inset * 2;
  const tile = Math.max(
    28,
    Math.floor(
      Math.min(
        (inner - (MAZE_COLS - 1) * gap) / MAZE_COLS,
        (inner - (MAZE_ROWS - 1) * gap) / MAZE_ROWS,
      ),
    ),
  );
  const width = MAZE_COLS * tile + (MAZE_COLS - 1) * gap;
  const ballSize = Math.round(tile * 0.68);
  const shadowW = Math.round(ballSize * 1.18);
  const shadowH = Math.round(ballSize * 0.82);
  const height = MAZE_ROWS * tile + (MAZE_ROWS - 1) * gap;
  const cellCenter = (col: number, row: number) => ({
    left: col * (tile + gap),
    top: row * (tile + gap),
  });

  const ballPos = cellCenter(ball.x, ball.y);
  const end = reduce ? MAZE_ROUTE[MAZE_ROUTE.length - 1] : null;
  const shownPainted = reduce
    ? new Set(MAZE_ROUTE.map(([col, row]) => `${col}:${row}`))
    : painted;
  const shownBall = reduce && end ? cellCenter(end[0], end[1]) : ballPos;

  return (
    <div
      ref={rootRef}
      className={`flex ${PREVIEW_FRAME} items-center justify-center`}
      style={{ background: "#252B32" }}
      aria-hidden="true"
    >
      <div className="relative" style={{ width, height }}>
        {MAZE_FLOOR.map((row, rowIndex) =>
          row.map((open, colIndex) => {
            if (!open) return null;
            const paintedCell = shownPainted.has(`${colIndex}:${rowIndex}`);
            const pos = cellCenter(colIndex, rowIndex);
            return (
              <div
                key={`${colIndex}:${rowIndex}`}
                className="absolute rounded-[10px]"
                style={{
                  width: tile,
                  height: tile,
                  left: pos.left,
                  top: pos.top,
                  background: paintedCell ? "#DDA448" : "#8C98B2",
                  boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.22)",
                }}
              />
            );
          }),
        )}
        <div
          className="absolute rounded-full"
          style={{
            width: shadowW,
            height: shadowH,
            left: shownBall.left + (tile - shadowW) / 2,
            top: shownBall.top + tile - shadowH * 0.45,
            background: "rgba(0,0,0,0.28)",
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: ballSize,
            height: ballSize,
            left: shownBall.left + (tile - ballSize) / 2,
            top: shownBall.top + (tile - ballSize) / 2,
            background: "#F2F2EE",
            boxShadow: "0 3px 0 rgba(0,0,0,0.18)",
          }}
        />
      </div>
    </div>
  );
}

export function ScreenshotVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className={`${PREVIEW_FRAME} relative grid place-items-center overflow-hidden border border-[var(--line)] bg-[color-mix(in_srgb,var(--elev)_70%,transparent)] p-6`}
    >
      <div className="relative h-full aspect-[9/16] overflow-hidden rounded-[1.6rem] border-[6px] border-[#111214] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 280px, 60vw" className="object-cover" />
      </div>
    </div>
  );
}
