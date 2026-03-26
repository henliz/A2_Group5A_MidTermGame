const SCENE = {
  HOME: "HOME",
  GAME: "GAME",
  END: "END",
};

let homeBgImg;
let logoImg;
let homeMouseX = 0;
let homeMouseY = 0;
let instructions;

function loadHomeAssets() {
  homeBgImg = loadImage("assets/homepic.png");
  logoImg = loadImage("through_the_woods_logo.png");
  instructions = loadImage("assets/instructions.png");
}

function drawHomePage() {
  // smooth mouse tracking for parallax
  homeMouseX = lerp(homeMouseX, mouseX, 0.06);
  homeMouseY = lerp(homeMouseY, mouseY, 0.06);

  // parallax offsets — bg moves opposite to mouse, logo moves less
  const offsetX = (homeMouseX - width / 2) / width;
  const offsetY = (homeMouseY - height / 2) / height;
  const bgShiftX = offsetX * -28;
  const bgShiftY = offsetY * -18;
  const logoShiftX = offsetX * 10;
  const logoShiftY = offsetY * 8;

  // logo — large, with subtle parallax float
  if (logoImg) {
    const logoW = min(width * 0.72, 880);
    const logoH = logoW * (logoImg.height / logoImg.width);
    imageMode(CENTER);
    image(
      logoImg,
      width / 2 + logoShiftX,
      height * 0.28 + logoShiftY,
      logoW,
      logoH,
    );
    imageMode(CORNER);
  }

  const boxWidth = min(650, width * 0.85);
  const boxHeight = 320;
  const boxX = (width - boxWidth) / 2;
  const boxY = height * 0.45;

  textAlign(CENTER, CENTER);
  textSize(25);
  fill(220);
  text("Press ENTER to start", width / 2, boxY + 345);

  noStroke();
  fill(255, 255, 255, 30);
  rect(boxX, boxY, boxWidth, boxHeight, 30);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);

  image(instructions, boxX, boxY, boxWidth, boxHeight);

  const padding = 20;
  text(
    msg,
    boxX + padding,
    boxY + padding,
    boxWidth - padding * 2,
    boxHeight - padding * 2,
  );

  fill("rgba(0, 0, 0, 0.25)");
  rect(0, 0, width, height);

  // bg drawn slightly oversized so parallax doesn't show edges
  const oversize = 60;
  image(
    homeBgImg,
    -oversize / 2 + bgShiftX,
    -oversize / 2 + bgShiftY,
    width + oversize,
    height + oversize,
  );

  // black gradient — full black at top, transparent at 50% down
  const grad = drawingContext.createLinearGradient(0, 0, 0, height * 0.5);
  grad.addColorStop(0, "rgba(0,0,0,0.88)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(0, 0, width, height * 0.5);
}

function drawEndPage() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Day 2\n 1 day until the sheriff arrives", width / 2, height / 2 - 20);
}
