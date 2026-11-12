"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_strength;
uniform float u_light;
uniform vec2 u_trail[12];

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p * 2.03;
    a *= 0.52;
  }
  return v;
}

float distSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.055;

  float md = length(p - m);
  vec2 dir = md > 0.0008 ? (p - m) / md : vec2(0.0);
  float pulse = sin(md * 16.0 - u_time * 2.0);
  p += dir * pulse * exp(-md * 4.6) * 0.055 * u_strength;
  p += (p - m) * (-0.08) * exp(-md * md * 6.5) * u_strength;

  vec2 q = p * 0.92;
  vec2 warp = vec2(
    fbm(q + vec2(t * 0.37, 0.21)),
    fbm(q + vec2(3.9, -t * 0.29))
  );
  q += (warp - 0.5) * 0.82;

  float field = fbm(q * 1.12 + vec2(-t * 0.17, t * 0.13));
  float swell = fbm(q * 0.52 - t * 0.08 + field);
  float liquid = smoothstep(0.16, 0.88, mix(field, swell, 0.5));

  vec3 lime = vec3(0.776, 1.0, 0.29);
  vec3 violet = vec3(0.545, 0.486, 1.0);
  vec3 warm = vec3(0.91, 0.788, 0.627);
  if (u_light > 0.5) {
    lime = vec3(0.28, 0.44, 0.02);
    violet = vec3(0.36, 0.26, 0.78);
    warm = vec3(0.52, 0.34, 0.14);
  }

  vec3 glow = vec3(0.0);
  glow += lime * pow(liquid, 1.15) * 0.62;
  glow += violet * pow(1.0 - liquid, 1.25) * 0.5;
  glow += warm * smoothstep(0.38, 0.92, swell) * 0.28;

  vec2 wellA = vec2(sin(t * 0.31) * 0.42, cos(t * 0.23) * 0.28);
  vec2 wellB = vec2(cos(t * 0.19 + 1.7) * 0.38, sin(t * 0.27 + 0.6) * 0.32);
  glow += lime * exp(-length(p - wellA) * 1.8) * 0.32;
  glow += violet * exp(-length(p - wellB) * 1.6) * 0.28;

  float bloom = exp(-md * 2.4) * u_strength;
  glow += mix(lime, violet, 0.42) * bloom * 0.48;
  glow += mix(warm, lime, 0.55) * max(pulse, 0.0) * exp(-md * 4.8) * 0.22 * u_strength;

  vec2 prev = (u_trail[0] - 0.5) * vec2(aspect, 1.0);
  for (int i = 1; i < 12; i++) {
    vec2 cur = (u_trail[i] - 0.5) * vec2(aspect, 1.0);
    float td = distSeg(p, prev, cur);
    float fade = 1.0 - float(i) / 12.0;
    glow += mix(lime, warm, float(i) * 0.05) * exp(-td * 42.0) * fade * 0.42 * u_strength;
    prev = cur;
  }

  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    vec2 seed = vec2(fi * 1.37, fi * 2.11);
    vec2 drift = vec2(
      fbm(seed + vec2(t * 0.33, 2.2)),
      fbm(seed + vec2(8.1, -t * 0.27))
    );
    vec2 mote = (drift - 0.5) * vec2(aspect * 1.55, 1.28);
    float d = length(p - mote);
    float size = 0.02 + hash(seed) * 0.016;
    glow += mix(warm, lime, hash(seed + 2.4)) * exp(-d * d / (size * size)) * 0.14;
  }

  float vignette = smoothstep(1.18, 0.16, length(p * vec2(0.7, 1.0)));
  glow *= 0.38 + 0.62 * vignette;
  glow *= 0.78 + 0.22 * u_strength;

  if (u_light > 0.5) {
    glow *= 1.7;
    float alpha = clamp(length(glow) * 1.2, 0.22, 0.88);
    gl_FragColor = vec4(glow * alpha, alpha);
  } else {
    vec3 bg = vec3(0.02745, 0.02745, 0.04314);
    gl_FragColor = vec4(bg + glow * 0.7, 1.0);
  }
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uStrength = gl.getUniformLocation(program, "u_strength");
    const uLight = gl.getUniformLocation(program, "u_light");
    const uTrail =
      gl.getUniformLocation(program, "u_trail[0]") ??
      gl.getUniformLocation(program, "u_trail");

    const mouse = { x: 0.74, y: 0.32, tx: 0.74, ty: 0.32 };
    const trail = Array.from({ length: 12 }, () => [0.74, 0.32]);
    let strength = 0.34;
    let targetStrength = 0.34;
    let frame = 0;
    const start = performance.now();
    let frozen = 8;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr * 0.7));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr * 0.7));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const onMove = (event: PointerEvent) => {
      mouse.tx = event.clientX / Math.max(window.innerWidth, 1);
      mouse.ty = 1 - event.clientY / Math.max(window.innerHeight, 1);
      targetStrength = 1;
    };

    const onLeave = () => {
      targetStrength = 0.3;
    };

    const paint = (now: number) => {
      resize();
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      strength += (targetStrength - strength) * 0.045;
      targetStrength += (0.34 - targetStrength) * 0.01;

      trail.pop();
      trail.unshift([mouse.x, mouse.y]);

      const reduce = motion.matches;
      const time = reduce ? frozen : (now - start) / 1000;
      if (reduce) frozen = time;
      const light = document.documentElement.dataset.theme === "light" ? 1 : 0;
      const flat = new Float32Array(24);
      for (let i = 0; i < 12; i += 1) {
        flat[i * 2] = trail[i]?.[0] ?? 0.5;
        flat[i * 2 + 1] = trail[i]?.[1] ?? 0.5;
      }

      gl.disable(gl.DEPTH_TEST);
      if (light > 0.5) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      } else {
        gl.disable(gl.BLEND);
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uStrength, strength);
      gl.uniform1f(uLight, light);
      if (uTrail) gl.uniform2fv(uTrail, flat);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = (now: number) => {
      if (!document.hidden) paint(now);
      if (!motion.matches) frame = window.requestAnimationFrame(tick);
    };

    resize();
    paint(performance.now());
    if (!motion.matches) frame = window.requestAnimationFrame(tick);

    const onMotion = () => {
      window.cancelAnimationFrame(frame);
      paint(performance.now());
      if (!motion.matches) frame = window.requestAnimationFrame(tick);
    };
    const onResize = () => paint(performance.now());
    const onVisible = () => {
      if (!document.hidden && !motion.matches) {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisible);
    motion.addEventListener("change", onMotion);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisible);
      motion.removeEventListener("change", onMotion);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-field" aria-hidden="true" />;
}
