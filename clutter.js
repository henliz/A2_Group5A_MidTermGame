// clutter.js
// Simple props layer for tavern. Draws in WORLD SPACE.

let tableImg;

const CLUTTER = []; // will hold placed props

function clutterPreload() {
  // ✅ Use the real path as it exists in YOUR project.
  // If you copied the PNG into your project, prefer something like:
  // "assets/clutter/tabless_6.png"
  tableImg = loadImage(
    "Epic RPG World - Village(interiors) V1.3/assets/furniture_and_props_sprites/tabless_6.png",
    () => console.log("[clutter] table loaded:", tableImg.width, tableImg.height),
    () => console.error("[clutter] FAILED to load table image (path wrong)")
  );
}

function clutterSetup() {
  // Place it in the big main room:
  // Pick a tile coordinate that you know is floor.
  // These are in TILE units of your floor mask.
  CLUTTER.length = 0;
  CLUTTER.push({
    img: tableImg,
    tileX: 6,
    tileY: 5,
    scale: (window.TF1_SCALE ?? 4), // fall back to 4
    anchor: "bottom" // looks nicer for furniture
  });
}

function clutterDraw(worldX = 0, worldY = 0) {
  if (!tableImg) return;

  // We rely on your tavernFloor1 globals
  const T = window.TF1_T ?? 128;

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

// expose to p5 global mode
window.clutterPreload = clutterPreload;
window.clutterSetup = clutterSetup;
window.clutterDraw = clutterDraw;