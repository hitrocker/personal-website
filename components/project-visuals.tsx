"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
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

/* ------------------------------------------------------------------ */
/* Arrow Puzzle: tap an arrow whose path is clear and it slides off.   */
/* ------------------------------------------------------------------ */

type ArrowDir = "up" | "down" | "left" | "right";
type ArrowPiece = { id: string; cells: Array<[number, number]> };

const ARROW_GRID = 6;
// Head is the last cell; the piece leaves the board in the direction of its last segment.
const ARROW_PIECES: ArrowPiece[] = [
  { id: "a", cells: [[1, 0], [4, 0]] },
  { id: "b", cells: [[5, 1], [5, 4]] },
  { id: "c", cells: [[0, 5], [3, 5]] },
  { id: "d", cells: [[0, 4], [0, 1]] },
  { id: "e", cells: [[2, 2], [2, 4], [4, 4]] },
  { id: "f", cells: [[1, 1], [3, 1], [3, 3]] },
  { id: "g", cells: [[4, 3], [4, 1]] },
  { id: "h", cells: [[1, 3], [1, 2]] },
];
const ARROW_STEP: Record<ArrowDir, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

function arrowDir(piece: ArrowPiece): ArrowDir {
  const [ax, ay] = piece.cells[piece.cells.length - 2] ?? [0, 0];
  const [bx, by] = piece.cells[piece.cells.length - 1] ?? [0, 0];
  if (bx > ax) return "right";
  if (bx < ax) return "left";
  return by > ay ? "down" : "up";
}

function occupiedCells(piece: ArrowPiece) {
  const out: string[] = [];
  for (let i = 1; i < piece.cells.length; i += 1) {
    const [ax, ay] = piece.cells[i - 1] ?? [0, 0];
    const [bx, by] = piece.cells[i] ?? [0, 0];
    const sx = Math.sign(bx - ax);
    const sy = Math.sign(by - ay);
    let x = ax;
    let y = ay;
    out.push(`${x}:${y}`);
    while (x !== bx || y !== by) {
      x += sx;
      y += sy;
      out.push(`${x}:${y}`);
    }
  }
  return out;
}

// Order in which the demo taps arrows: always one whose exit path is clear.
const ARROW_ORDER: string[] = (() => {
  const remaining = [...ARROW_PIECES];
  const order: string[] = [];
  while (remaining.length) {
    const blocked = new Set(remaining.flatMap(occupiedCells));
    const index = remaining.findIndex((piece) => {
      const [dx, dy] = ARROW_STEP[arrowDir(piece)];
      let [x, y] = piece.cells[piece.cells.length - 1] ?? [0, 0];
      for (;;) {
        x += dx;
        y += dy;
        if (x < 0 || y < 0 || x >= ARROW_GRID || y >= ARROW_GRID) return true;
        if (blocked.has(`${x}:${y}`)) return false;
      }
    });
    if (index < 0) break;
    const [piece] = remaining.splice(index, 1);
    if (piece) order.push(piece.id);
  }
  return order;
})();

const ARROW_EMPTY = (() => {
  const used = new Set(ARROW_PIECES.flatMap(occupiedCells));
  const cells: Array<[number, number]> = [];
  for (let y = 0; y < ARROW_GRID; y += 1) {
    for (let x = 0; x < ARROW_GRID; x += 1) if (!used.has(`${x}:${y}`)) cells.push([x, y]);
  }
  return cells;
})();

function ArrowShape({ piece }: { piece: ArrowPiece }) {
  const points = piece.cells.map(([x, y]) => `${x + 0.5},${y + 0.5}`).join(" ");
  const [hx, hy] = piece.cells[piece.cells.length - 1] ?? [0, 0];
  const [dx, dy] = ARROW_STEP[arrowDir(piece)];
  const cx = hx + 0.5;
  const cy = hy + 0.5;
  // Triangle head pointing in (dx, dy).
  const tip = [cx + dx * 0.34, cy + dy * 0.34];
  const left = [cx - dy * 0.22 - dx * 0.02, cy + dx * 0.22 - dy * 0.02];
  const right = [cx + dy * 0.22 - dx * 0.02, cy - dx * 0.22 - dy * 0.02];
  return (
    <>
      <polyline
        points={points}
        fill="none"
        stroke="#E2609A"
        strokeWidth={0.19}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points={`${tip.join(",")} ${left.join(",")} ${right.join(",")}`} fill="#E2609A" />
    </>
  );
}

export function ArrowPuzzleVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "80px" });
  const reduce = useReducedMotion();
  const [cleared, setCleared] = useState<string[]>([]);
  const [tapped, setTapped] = useState<string | null>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    let cancelled = false;
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
        for (const id of ARROW_ORDER) {
          if (cancelled) return;
          setTapped(id);
          await wait(260);
          if (cancelled) return;
          setCleared((current) => [...current, id]);
          setTapped(null);
          await wait(420);
        }
        await wait(900);
        if (cancelled) return;
        setCleared([]);
        setCycle((value) => value + 1);
        await wait(700);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [inView, reduce]);

  const tappedPiece = ARROW_PIECES.find((piece) => piece.id === tapped);
  const tappedHead = tappedPiece?.cells[tappedPiece.cells.length - 1];

  return (
    <div
      ref={rootRef}
      className={`flex ${PREVIEW_FRAME} items-center justify-center overflow-hidden`}
      style={{ background: "#F3EEDB" }}
      aria-hidden="true"
    >
      <svg viewBox="-0.6 -0.6 7.2 7.2" className="h-[86%] w-[86%] overflow-visible">
        {ARROW_EMPTY.map(([x, y]) => (
          <circle key={`${x}:${y}`} cx={x + 0.5} cy={y + 0.5} r={0.05} fill="#C9C1AC" />
        ))}
        <g key={cycle}>
          {ARROW_PIECES.map((piece) => {
            const gone = cleared.includes(piece.id);
            const [dx, dy] = ARROW_STEP[arrowDir(piece)];
            return (
              <motion.g
                key={piece.id}
                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                animate={
                  gone
                    ? { x: dx * 8, y: dy * 8, opacity: 0 }
                    : { x: 0, y: 0, opacity: 1, scale: 1 }
                }
                transition={
                  gone
                    ? { duration: 0.5, ease: [0.55, 0, 0.9, 0.4] }
                    : { duration: 0.35, ease: "easeOut" }
                }
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <ArrowShape piece={piece} />
              </motion.g>
            );
          })}
        </g>
        {tappedHead ? (
          <motion.circle
            key={`tap-${tapped}-${cycle}`}
            cx={tappedHead[0] + 0.5}
            cy={tappedHead[1] + 0.5}
            r={0.42}
            fill="none"
            stroke="#E2609A"
            strokeWidth={0.06}
            initial={{ opacity: 0.9, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.25 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ) : null}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sky Hopper: one-tap bird hopping through scrolling pipe gaps.       */
/* ------------------------------------------------------------------ */

const HOP = {
  size: 160,
  groundY: 132,
  birdX: 48,
  pipeW: 18,
  capW: 22,
  capH: 7,
  gap: 46,
  spacing: 64,
  firstPipe: 118,
  speed: 30, // units per second
  hopPeriod: 0.52, // seconds per tap
  hopHeight: 6,
  gaps: [64, 82, 54, 76, 60, 86, 58],
  loop: 24, // seconds before the run restarts
};

const HOP_CLOUDS: Array<[number, number, number]> = [
  [14, 22, 22],
  [78, 14, 16],
  [124, 34, 20],
];
const HOP_CITY: Array<[number, number]> = [
  [0, 12],
  [18, 20],
  [40, 9],
  [58, 16],
  [82, 24],
  [104, 11],
  [124, 18],
  [146, 13],
];

function hopScene(time: number, followY: number) {
  const scroll = time * HOP.speed;
  const pipes: Array<{ x: number; gapY: number }> = [];
  for (let i = 0; i < 40; i += 1) {
    const x = HOP.firstPipe + i * HOP.spacing - scroll;
    if (x < -HOP.capW) continue;
    if (x > HOP.size + 4) break;
    pipes.push({ x, gapY: HOP.gaps[i % HOP.gaps.length] ?? 70 });
  }
  const passed = Math.max(
    0,
    Math.floor((scroll + HOP.birdX - HOP.firstPipe - HOP.pipeW) / HOP.spacing) + 1,
  );
  // Aim for the gap the bird is in until it is fully past that pipe, then the next one.
  const next = Math.max(
    0,
    Math.ceil((scroll + HOP.birdX - HOP.firstPipe - HOP.pipeW - 14) / HOP.spacing),
  );
  const target = HOP.gaps[next % HOP.gaps.length] ?? 70;
  const phase = (time % HOP.hopPeriod) / HOP.hopPeriod;
  const arc = -HOP.hopHeight * 4 * phase * (1 - phase);
  const rising = phase < 0.5;
  return { pipes, passed, target, birdY: followY + arc, rising, scroll };
}

export function SkyHopperVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "80px" });
  const reduce = useReducedMotion();
  const [state, setState] = useState({ time: 1.1, followY: HOP.gaps[0] ?? 64 });

  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let followY = HOP.gaps[0] ?? 64;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden) {
        time += dt;
        if (time > HOP.loop) {
          time = 0;
          followY = HOP.gaps[0] ?? 64;
        }
        const { target } = hopScene(time, followY);
        followY += (target + 4 - followY) * Math.min(1, dt * 4);
        setState({ time, followY });
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [inView, reduce]);

  const scene = hopScene(state.time, state.followY);
  const wingUp = Math.floor(state.time / 0.12) % 2 === 0;
  const cloudShift = (scene.scroll * 0.25) % (HOP.size + 30);
  const cityShift = (scene.scroll * 0.5) % HOP.size;
  const groundShift = scene.scroll % 8;

  return (
    <div
      ref={rootRef}
      className={`${PREVIEW_FRAME} overflow-hidden`}
      style={{ background: "#4FA6DA" }}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${HOP.size} ${HOP.size}`} className="h-full w-full" shapeRendering="crispEdges">
        <rect x={0} y={52} width={HOP.size} height={40} fill="#5CB2E0" />
        <rect x={0} y={92} width={HOP.size} height={40} fill="#7BC4E8" />
        <rect x={16} y={12} width={12} height={12} fill="#FFD866" />
        <rect x={19} y={15} width={6} height={6} fill="#FFF1B8" />

        {HOP_CLOUDS.map(([x, y, w]) => {
          const cx = ((x - cloudShift + HOP.size + 30) % (HOP.size + 30)) - 24;
          return (
            <g key={`${x}:${y}`} fill="#FFFFFF">
              <rect x={cx} y={y + 3} width={w} height={4} />
              <rect x={cx + 4} y={y} width={w - 8} height={3} />
            </g>
          );
        })}

        {[0, HOP.size].map((offset) =>
          HOP_CITY.map(([x, h]) => (
            <rect
              key={`${offset}:${x}`}
              x={x + offset - cityShift}
              y={HOP.groundY - h}
              width={16}
              height={h}
              fill="#6F9CC6"
            />
          )),
        )}

        {scene.pipes.map((pipe) => {
          const top = pipe.gapY - HOP.gap / 2;
          const bottom = pipe.gapY + HOP.gap / 2;
          const capX = pipe.x - (HOP.capW - HOP.pipeW) / 2;
          return (
            <g key={pipe.x.toFixed(0)}>
              <rect x={pipe.x} y={0} width={HOP.pipeW} height={top} fill="#56BE24" stroke="#125C16" strokeWidth={1.2} />
              <rect x={pipe.x + 3} y={0} width={3} height={top - HOP.capH} fill="#9BE04A" />
              <rect x={capX} y={top - HOP.capH} width={HOP.capW} height={HOP.capH} fill="#56BE24" stroke="#125C16" strokeWidth={1.2} />
              <rect
                x={pipe.x}
                y={bottom}
                width={HOP.pipeW}
                height={HOP.groundY - bottom}
                fill="#56BE24"
                stroke="#125C16"
                strokeWidth={1.2}
              />
              <rect x={pipe.x + 3} y={bottom + HOP.capH} width={3} height={HOP.groundY - bottom - HOP.capH} fill="#9BE04A" />
              <rect x={capX} y={bottom} width={HOP.capW} height={HOP.capH} fill="#56BE24" stroke="#125C16" strokeWidth={1.2} />
            </g>
          );
        })}

        <rect x={0} y={HOP.groundY} width={HOP.size} height={5} fill="#60BC3E" />
        <rect x={0} y={HOP.groundY + 5} width={HOP.size} height={2} fill="#308C2A" />
        <rect x={0} y={HOP.groundY + 7} width={HOP.size} height={HOP.size - HOP.groundY - 7} fill="#C48E48" />
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={i * 8 - groundShift} y={HOP.groundY + 12 + (i % 3) * 5} width={2} height={2} fill="#96602F" />
        ))}

        <g
          transform={`translate(${HOP.birdX} ${scene.birdY.toFixed(2)}) rotate(${scene.rising ? -16 : 14})`}
        >
          <rect x={-8} y={-6} width={16} height={12} fill="#30C6B0" stroke="#202830" strokeWidth={1.2} />
          <rect x={-6} y={0} width={9} height={5} fill="#FFECD6" />
          <rect x={2} y={-4} width={5} height={5} fill="#FFFFFF" />
          <rect x={4} y={-3} width={2} height={3} fill="#1C242C" />
          <rect x={8} y={-1} width={5} height={3} fill="#F29234" stroke="#202830" strokeWidth={0.8} />
          <rect x={-11} y={wingUp ? -7 : -1} width={7} height={5} fill="#167A76" stroke="#202830" strokeWidth={0.8} />
          <rect x={2} y={2} width={3} height={2} fill="#FF9A8C" />
        </g>

        <text
          x={HOP.size / 2}
          y={24}
          textAnchor="middle"
          fontFamily="var(--font-display), sans-serif"
          fontWeight={800}
          fontSize={16}
          fill="#FFFFFF"
          stroke="#202830"
          strokeWidth={2.4}
          paintOrder="stroke"
        >
          {reduce ? 3 : scene.passed}
        </text>
      </svg>
    </div>
  );
}
