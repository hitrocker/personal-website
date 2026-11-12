"use client";

/**
 * Tiny retro sound effects, synthesised with Web Audio (no audio files).
 * Browsers only allow audio after the visitor has interacted with the page, so the
 * first sound may be silent; everything after the first click or key press plays.
 */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  duration: number,
  { type = "square", volume = 0.04, slideTo, delay = 0 }: { type?: OscillatorType; volume?: number; slideTo?: number; delay?: number } = {},
) {
  const ac = audio();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.01);
}

export const sfx = {
  /** Button / window control click. */
  tick: () => tone(1800, 0.035),
  /** One key press in the DOS prompt. */
  key: () => tone(700 + Math.random() * 350, 0.018, { volume: 0.018 }),
  /** "Bad command or file name". */
  error: () => {
    tone(150, 0.18, { type: "sawtooth", volume: 0.045 });
    tone(110, 0.2, { type: "sawtooth", volume: 0.04, delay: 0.12 });
  },
  /** Arcade cabinet switching games. */
  blip: () => tone(520, 0.07, { volume: 0.035, slideTo: 1250 }),
  /** Startup chime when the boot screen finishes. */
  chime: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
      tone(freq, i === 3 ? 0.45 : 0.16, { type: "triangle", volume: 0.06, delay: i * 0.11 }),
    );
  },
};
