const SCENE = {
  HOME: "HOME",
  GAME: "GAME",
};

let homeBgImg;

function loadHomeAssets() {
  homeBgImg = loadImage("assets/homepic.png");
}

function drawHomePage() {
  image(homeBgImg, 0, 0, width, height);

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  text("Through the Woods", width / 2, height * 0.25);

  textSize(16);
  fill(220);
  text("Press ENTER to start", width / 2, height * 0.35);

  const boxWidth = min(650, width * 0.85);
  const boxHeight = 320;
  const boxX = (width - boxWidth) / 2;
  const boxY = height * 0.45;

  noStroke();
  fill(255, 255, 255, 30);
  rect(boxX, boxY, boxWidth, boxHeight, 14);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);

  const msg =
    "Introduction:\n" +
    "You (Little Red) are on a journey to see your grandma and are passing through a little town " +
    "when someone at the inn you're staying at is mysteriously murdered. " +
    "Everyone at the inn suspects you because you're the most recent guest. " +
    "You have to find the real killer to clear your name and continue on your journey.\n\n" +
    "How to play:\n" +
    "- Use WASD to move around.\n" +
    "- Make choices carefully - each choice costs a different number of spoons and may have consequences.\n" +
    "- A day ends when your spoons run out.";

  const padding = 20;
  text(
    msg,
    boxX + padding,
    boxY + padding,
    boxWidth - padding * 2,
    boxHeight - padding * 2,
  );
}
