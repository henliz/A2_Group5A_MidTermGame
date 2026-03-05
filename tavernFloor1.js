// tavernFloor1.js
// Uses ONLY assets/walls/* (your sliced PNGs).
// Auto back walls for every room, auto side walls, and better corner alignment.

let floorImg;
let wallImgs = [];
let wallEndL, wallEndR;
let wallCorner;
let wallDoor;
let insideSideWall;

const TF1_S = 32;
const TF1_SCALE = 4;
const TF1_T = TF1_S * TF1_SCALE; // 128px per tile

const BACK_WALL_OVERLAP = Math.floor(TF1_T * 0.20);
const SIDE_WALL_START_DROP = Math.floor(TF1_T * 0.55);

// How high "wall art" sits above the floor tile.
// Most SDV-style wall pieces extend upward, so we draw them starting above floor.
const WALL_LIFT_TILES = 1;               // wall starts 1 tile above floor
const WALL_LIFT = TF1_T * WALL_LIFT_TILES;

// Corner alignment tweak: push corners DOWN so their top merges with the back wall row.
const CORNER_Y_NUDGE = Math.floor(TF1_T * 0.35); // tweak 0.25..0.55

const BACK_WALL_OVERLAP = Math.floor(TF1_T * 0.20);  // 0.10..0.30 tweak

const SIDE_WALL_START_DROP = Math.floor(TF1_T * 0.55); // start lower (tweak 0.45..0.70)

// 15 wide × 13 tall, connected, rooms + hallways.
const TF1_FLOOR_MASK = [
  "000011111110000", // 0  top room
  "000011111110000", // 1
  "000011111110000", // 2
  "000000011000000", // 3  hallway down
  "001111111111100", // 4  main hall
  "001111111111100", // 5
  "001111111111100", // 6
  "000000011000000", // 7  central spine
  "000111011011100", // 8  left room + spine + right room
  "000111011011100", // 9
  "000111011011100", // 10
  "000000011110000", // 11 connected to right
  "000001111110000", // 12 bottom nook
];

let TF1_W = 0;
let TF1_H = 0;

// SOLID: 1 = solid, 0 = walkable
let TF1_SOLID = [];

function tf1Preload() {
  floorImg = loadImage("assets/walls/floor_full.png");

  // wall variants
  wallImgs = [
    loadImage("assets/walls/wall1.png"),
    loadImage("assets/walls/wall2.png"),
    loadImage("assets/walls/wall3.png"),
    loadImage("assets/walls/wall4.png"),
  ];

  wallEndL = loadImage("assets/walls/wall_end_left.png");
  wallEndR = loadImage("assets/walls/wall_end_right.png");

  wallCorner = loadImage("assets/walls/wall_corner.png");
  wallDoor   = loadImage("assets/walls/wall_door.png");

  insideSideWall = loadImage("assets/walls/inside_side_wall.png");
}

function tf1Setup() {
  TF1_H = TF1_FLOOR_MASK.length;
  TF1_W = TF1_FLOOR_MASK[0].length;

  TF1_SOLID = Array.from({ length: TF1_H }, (_, r) =>
    new Array(TF1_W).fill(1)
  );

  for (let r = 0; r < TF1_H; r++) {
    for (let c = 0; c < TF1_W; c++) {
      TF1_SOLID[r][c] = isFloor(c, r) ? 0 : 1;
    }
  }
}

function isFloor(col, row) {
  if (row < 0 || row >= TF1_H || col < 0 || col >= TF1_W) return false;
  return TF1_FLOOR_MASK[row][col] === "1";
}

function tf1IsSolidAtPixel(px, py, worldX = 0, worldY = 0) {
  const tx = Math.floor((px - worldX) / TF1_T);
  const ty = Math.floor((py - worldY) / TF1_T);
  if (tx < 0 || ty < 0 || tx >= TF1_W || ty >= TF1_H) return true;
  return TF1_SOLID[ty][tx] === 1;
}

// Choose a wall variant (stable but varied)
function wallVariantFor(col, row) {
  const idx = (col * 7 + row * 13) % wallImgs.length;
  return wallImgs[idx];
}

const BACK_WALL_OVERLAP = Math.floor(TF1_T * 0.20); // tweak 0.10..0.30

function drawWallTile(img, x, yFloorTop) {
  const dw = TF1_T;
  const dh = img.height * TF1_SCALE;
  const y = yFloorTop - dh + BACK_WALL_OVERLAP;
  image(img, x, y, dw, dh);
}

const SIDE_EDGE_PAD = 2; // "2 pixels" to the edge (screen pixels)

// Draw a continuous vertical side wall strip by tiling the sprite downwards.
// Keeps the sprite skinny (no TF1_T scaling).
function drawSideWallSegmentStrip(img, x, yTop, height, flipX) {
  const sw = img.width * TF1_SCALE;   // skinny width
  const sh = img.height * TF1_SCALE;  // sprite height

  push();
  translate(x, yTop);

  if (flipX) {
    // mirror around the strip's own width
    translate(sw, 0);
    scale(-1, 1);
  }

  // Tile down: draw repeated slices of the image so it looks continuous
  let y = 0;
  while (y < height) {
    const remaining = height - y;
    const dh = Math.min(sh, remaining);

    // Crop source height proportionally when we're at the bottom partial tile
    const srcH = (dh / sh) * img.height;

    image(
      img,
      0, y, sw, dh,        // dest
      0, 0, img.width, srcH // src
    );

    y += dh;
  }

  pop();
}

function tf1Draw(worldX = 0, worldY = 0) {
  for (let r = 0; r < TF1_H; r++) {
    for (let c = 0; c < TF1_W; c++) {
      if (!isFloor(c, r)) continue;
      const x = worldX + c * TF1_T;
      const y = worldY + r * TF1_T;
      image(floorImg, x, y, TF1_T, TF1_T);
    }
  }

  // A "back wall" tile exists wherever floor has void above.
  for (let r = 0; r < TF1_H; r++) {
    for (let c = 0; c < TF1_W; c++) {
      if (!isFloor(c, r)) continue;
      if (isFloor(c, r - 1)) continue; // only when above is void

      const x = worldX + c * TF1_T;
      const y = worldY + r * TF1_T;

      // End caps if this is the start/end of a run
      const leftVoid  = !isFloor(c - 1, r);
      const rightVoid = !isFloor(c + 1, r);

      if (leftVoid) {
        drawWallTile(wallEndL, x, y);
      } else if (rightVoid) {
        drawWallTile(wallEndR, x, y);
      } else {
        drawWallTile(wallVariantFor(c, r), x, y);
      }
    }
  }

  // A corner is where floor has void above AND void to left/right.
  // Draw slightly nudged down so it visually merges with the back wall row.
  for (let r = 0; r < TF1_H; r++) {
    for (let c = 0; c < TF1_W; c++) {
      if (!isFloor(c, r)) continue;
      if (isFloor(c, r - 1)) continue; // only on back-wall rows

      const x = worldX + c * TF1_T;
      const y = worldY + r * TF1_T + CORNER_Y_NUDGE;

      const leftVoid  = !isFloor(c - 1, r);
      const rightVoid = !isFloor(c + 1, r);

      // left top-corner
      if (leftVoid) {
        // wall_corner.png assumed to be a "right-ish" corner? We'll mirror for left.
        push();
        translate(x, y - WALL_LIFT);
        translate(TF1_T, 0);
        scale(-1, 1);
        image(wallCorner, 0, 0, TF1_T, TF1_T + WALL_LIFT);
        pop();
      }

      // right top-corner
      if (rightVoid) {
        image(wallCorner, x, y - WALL_LIFT, TF1_T, TF1_T + WALL_LIFT);
      }
    }
  }

  // Left and right edges wherever floor touches void horizontally.
  // ── SIDE WALLS: continuous skinny strips ────────────────
for (let c = 0; c < TF1_W; c++) {
  // LEFT side segments
  let segStart = null;
  for (let r = 0; r <= TF1_H; r++) {
    const edgeHere = (r < TF1_H) && isFloor(c, r) && !isFloor(c - 1, r);
    if (edgeHere && segStart === null) segStart = r;

    if ((!edgeHere || r === TF1_H) && segStart !== null) {
      const segRows = r - segStart;

      // Position: hug the exact left edge of this floor tile, minus 2px
      const x = worldX + c * TF1_T - SIDE_EDGE_PAD;

      const yTop = worldY + segStart * TF1_T + SIDE_WALL_START_DROP;
      const h = segRows * TF1_T - SIDE_WALL_START_DROP;
      if (h <= 0) { segStart = null; continue; }

      drawSideWallSegmentStrip(insideSideWall, x, yTop, h, true);
      segStart = null;
    }
  }

  // RIGHT side segments
  segStart = null;
  for (let r = 0; r <= TF1_H; r++) {
    const edgeHere = (r < TF1_H) && isFloor(c, r) && !isFloor(c + 1, r);
    if (edgeHere && segStart === null) segStart = r;

    if ((!edgeHere || r === TF1_H) && segStart !== null) {
      const segRows = r - segStart;

      // Skinny strip width in screen px
      const sw = insideSideWall.width * TF1_SCALE;

      // Position: hug the right edge, plus 2px (so it sits on the boundary cleanly)
      const x = worldX + (c + 1) * TF1_T - sw + SIDE_EDGE_PAD;

      const yTop = worldY + segStart * TF1_T + SIDE_WALL_START_DROP;
      const h = segRows * TF1_T - SIDE_WALL_START_DROP;
      if (h <= 0) continue;

      drawSideWallSegmentStrip(insideSideWall, x, yTop, h, false);
      segStart = null;
    }
  }
}
}

window.tf1Preload = tf1Preload;
window.tf1Setup   = tf1Setup;
window.tf1Draw    = tf1Draw;
window.tf1IsSolidAtPixel = tf1IsSolidAtPixel;

// expose for spawn helpers if needed
window.TF1_T = TF1_T;
window.TF1_W = () => TF1_W;
window.TF1_H = () => TF1_H;