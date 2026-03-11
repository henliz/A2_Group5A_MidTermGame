// clutter.js
// Simple props layer for tavern. Draws in WORLD SPACE.
// Uses multi-asset loading framework to manage many furniture/prop images.

// ============================================================
// ASSET STORAGE & ASSET LIST
// ============================================================

/**
 * clutterImages: Object to store all loaded PNG images
 * Each key corresponds to a named asset (e.g., "table", "chair", "lamp")
 */
const clutterImages = {};

const CLUTTER = []; // will hold placed props

/**
 * clutterAssetList: Array defining all assets to load
 * Structure: { key: "name", path: "relative/path/to/image.png" }
 */
const clutterAssetList = [
  {
    key: "table",
    path: "assets/table-1.png",
  },
  {
    key: "chair",
    path: "assets/chair-1.png",
  },
  {
    key: "lamp",
    path: "assets/lamp-1.png",
  },
  {
    key: "crate",
    path: "Epic RPG World - Village(interiors) V1.3/assets/furniture_and_props_sprites/crates_0.png",
  },
];

const roomLayout = [
  { asset: "table", tileX: 6, tileY: 5, scale: 4, anchor: "bottom" },
  { asset: "chair", tileX: 8, tileY: 5, scale: 4, anchor: "bottom" },
  { asset: "lamp", tileX: 10, tileY: 4, scale: 4, anchor: "bottom" },
  { asset: "crate", tileX: 12, tileY: 6, scale: 4, anchor: "bottom" },
];

// ============================================================
// PRELOAD: Load all assets from the list
// ============================================================

function clutterPreload() {
  // Loop through asset list and load each image
  for (const asset of clutterAssetList) {
    clutterImages[asset.key] = loadImage(
      asset.path,
      () => console.log(`[clutter] loaded: ${asset.key}`),
      () => console.error(`[clutter] FAILED to load: ${asset.key}`),
    );
  }
}

// ============================================================
// SETUP: Place props in the scene
// ============================================================

function clutterSetup() {
  // Clear previous clutter
  CLUTTER.length = 0;

  // Place multiple props in the tavern scene
  CLUTTER.push(
    {
      img: clutterImages.table,
      tileX: 6,
      tileY: 5,
      scale: window.TF1_SCALE ?? 4,
      anchor: "bottom",
    },
    {
      img: clutterImages.chair,
      tileX: 8,
      tileY: 5,
      scale: window.TF1_SCALE ?? 4,
      anchor: "bottom",
    },
    {
      img: clutterImages.lamp,
      tileX: 10,
      tileY: 4,
      scale: window.TF1_SCALE ?? 4,
      anchor: "bottom",
    },
    {
      img: clutterImages.crate,
      tileX: 12,
      tileY: 6,
      scale: window.TF1_SCALE ?? 4,
      anchor: "bottom",
    },
  );
}

// ============================================================
// DRAW: Render all props in the CLUTTER array
// ============================================================

function clutterDraw(worldX = 0, worldY = 0) {
  // We rely on your tavernFloor1 globals
  const T = window.TF1_T ?? 128;

  // Loop through all placed props and draw each one
  for (const p of CLUTTER) {
    if (!p.img) continue;

    const dw = p.img.width * (p.scale ?? 4);
    const dh = p.img.height * (p.scale ?? 4);

    const x = worldX + p.tileX * T;
    const y = worldY + p.tileY * T;

    // bottom-anchor so it sits on the floor nicely
    if (p.anchor === "bottom") {
      image(p.img, x, y + T - dh, dw, dh);
    } else {
      image(p.img, x, y, dw, dh);
    }
  }
}

// ============================================================
// EXPOSE TO P5 GLOBAL MODE
// ============================================================

// expose to p5 global mode
window.clutterPreload = clutterPreload;
window.clutterSetup = clutterSetup;
window.clutterDraw = clutterDraw;
