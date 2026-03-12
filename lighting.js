// lighting.js
// Atmospheric purple/blue tint over the world — old run-down inn, not a cave.
// Every room and corridor has a light source. The overlay is a light colour wash,
// not pitch darkness. Drawn in screen-space AFTER the world, BEFORE all UI.

let lightingBuffer;

// One light per room / area of the inn, in world pixels.
// Positions derived from TF1_FLOOR_MASK layout (TF1_T = 128px per tile).
// seed: unique offset so each light flickers independently via noise().
const LIGHT_SOURCES = [
  // ── Top rooms ──────────────────────────────────────────────────────────────
  { x:  3.5 * 128, y:  0.7 * 128, r: 210, seed: 0.11 }, // left bedroom
  { x: 10.5 * 128, y:  0.7 * 128, r: 210, seed: 1.34 }, // right bedroom

  // ── Upper connecting corridor (rows 2–3) ───────────────────────────────────
  { x:  7.0 * 128, y:  2.5 * 128, r: 260, seed: 2.57 }, // upper hallway

  // ── Main hall (rows 4–5) ───────────────────────────────────────────────────
  { x:  3.0 * 128, y:  4.5 * 128, r: 340, seed: 3.21 }, // hall left
  { x:  7.0 * 128, y:  4.5 * 128, r: 380, seed: 4.45 }, // hall centre (biggest)
  { x: 11.0 * 128, y:  4.5 * 128, r: 320, seed: 5.68 }, // hall right
  { x: 12.5 * 128, y:  3.8 * 128, r: 230, seed: 6.02 }, // office corner

  // ── Centre corridor (rows 6–7) ─────────────────────────────────────────────
  { x:  7.0 * 128, y:  6.5 * 128, r: 230, seed: 7.14 }, // dim hallway lamp

  // ── Tavern / bar area (rows 8–9) ───────────────────────────────────────────
  { x: 11.5 * 128, y:  8.5 * 128, r: 370, seed: 8.37 }, // bar counter
  { x:  3.5 * 128, y:  8.5 * 128, r: 310, seed: 9.60 }, // tavern table
  { x:  7.0 * 128, y:  8.5 * 128, r: 290, seed: 0.83 }, // tavern centre

  // ── Lower corridor (rows 10–11) ────────────────────────────────────────────
  { x:  7.0 * 128, y: 10.5 * 128, r: 230, seed: 1.96 }, // dim hallway lamp

  // ── Lobby (rows 12–14) ─────────────────────────────────────────────────────
  { x:  3.5 * 128, y: 13.0 * 128, r: 330, seed: 3.09 }, // lobby left
  { x:  7.0 * 128, y: 13.0 * 128, r: 350, seed: 4.22 }, // lobby centre
  { x: 10.5 * 128, y: 13.0 * 128, r: 310, seed: 5.45 }, // piano / lobby right
];

// ── Flicker cache — recomputed every FLICKER_INTERVAL frames ─────────────────
const FLICKER_INTERVAL = 3;
let _flickerTick = 0;
const _flickerF  = new Float32Array(LIGHT_SOURCES.length).fill(1.0);
let   _flickerPlayer = 1.0;

function lightingSetup() {
  lightingBuffer = createGraphics(windowWidth, windowHeight);
  lightingBuffer.noSmooth();
}

function lightingResized() {
  if (lightingBuffer) lightingBuffer.resizeCanvas(windowWidth, windowHeight);
}

// World → screen (matches scale(CAM_ZOOM); translate(-camX, -camY))
function _w2s(wx, wy) {
  return [(wx - camX) * CAM_ZOOM, (wy - camY) * CAM_ZOOM];
}

// Punch a soft radial hole in the darkness buffer
function _lightCutout(ctx, sx, sy, r) {
  const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
  g.addColorStop(0,    'rgba(255,255,255,1.00)');
  g.addColorStop(0.20, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.50, 'rgba(255,255,255,0.70)');
  g.addColorStop(0.75, 'rgba(255,255,255,0.20)');
  g.addColorStop(1.0,  'rgba(255,255,255,0.00)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  ctx.fill();
}

// Single merged bloom (violet+teal in one gradient pass)
function _bloom(ctx, sx, sy, r) {
  const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
  g.addColorStop(0,   'rgba(90, 80, 210, 0.18)');
  g.addColorStop(0.5, 'rgba(50, 90, 190, 0.06)');
  g.addColorStop(1,   'rgba(0,  0,  0,  0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawLighting() {
  if (!lightingBuffer || currentScene !== "GAME") return;

  const ctx = lightingBuffer.drawingContext;
  const t   = frameCount * 0.016;

  // ── Refresh flicker cache every FLICKER_INTERVAL frames ───────────────────
  if (_flickerTick === 0) {
    _flickerPlayer = 0.92 + noise(t + 9.9) * 0.08;
    for (let i = 0; i < LIGHT_SOURCES.length; i++) {
      _flickerF[i] = 0.82 + noise(t + LIGHT_SOURCES[i].seed) * 0.18;
    }
  }
  _flickerTick = (_flickerTick + 1) % FLICKER_INTERVAL;

  // ── 1. Ambient overlay ─────────────────────────────────────────────────────
  lightingBuffer.clear();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(18, 8, 42, 0.55)';
  ctx.fillRect(0, 0, width, height);

  // ── 2. Punch light holes ───────────────────────────────────────────────────
  ctx.globalCompositeOperation = 'destination-out';

  // Player glow (always on-screen)
  const [ppx, ppy] = _w2s(player.px, player.py);
  _lightCutout(ctx, ppx, ppy, 240 * _flickerPlayer * CAM_ZOOM);

  // Inn lights — skip anything whose circle is fully off-screen
  for (let i = 0; i < LIGHT_SOURCES.length; i++) {
    const src = LIGHT_SOURCES[i];
    const [sx, sy] = _w2s(src.x, src.y);
    const r = src.r * _flickerF[i] * CAM_ZOOM;
    if (sx + r < 0 || sx - r > width || sy + r < 0 || sy - r > height) continue;
    _lightCutout(ctx, sx, sy, r);
  }

  // ── 3. Single bloom pass ───────────────────────────────────────────────────
  ctx.globalCompositeOperation = 'source-over';

  for (let i = 0; i < LIGHT_SOURCES.length; i++) {
    const src = LIGHT_SOURCES[i];
    const [sx, sy] = _w2s(src.x, src.y);
    const r = src.r * _flickerF[i] * CAM_ZOOM * 1.2;
    if (sx + r < 0 || sx - r > width || sy + r < 0 || sy - r > height) continue;
    _bloom(ctx, sx, sy, r);
  }

  // ── 4. Blit to main canvas ─────────────────────────────────────────────────
  ctx.globalCompositeOperation = 'source-over';
  image(lightingBuffer, 0, 0);

  // ── 5. Very gentle scene-wide purple breathe ──────────────────────────────
  noStroke();
  const pulse = 4 + noise(t * 0.25) * 8;
  fill(45, 15, 85, pulse);
  rect(0, 0, width, height);
}

window.lightingSetup   = lightingSetup;
window.lightingResized = lightingResized;
window.drawLighting    = drawLighting;
