//runawayMan.js — Jerome

const runawayManDialogue = {
  name: "Mysterious Man",
  exitMonologue: "He's too on edge… I don't want to make things worse.",
  opening: "Everyone's on edge… what do you want?",
  repeatLine: "…I already said what I had to say.",
  hesitationLine: "I can't deal with his attitude right now, not like this…",
  options: [
    {
      id: "A",
      cost: 2,
      playerLine:
        "I'm not accusing you of anything. I just… I need to understand what happened. I'm the one everyone's looking at",
      npcResponse:
        "Fair enough. I was in my room. Heard the scream around two in the morning, maybe after. Came out and the innkeeper was already there. I'd seen her earlier that evening. Helen. She seemed fine. Normal.",
      monologue:
        "He saw her that evening. He said it almost like a footnote, like he wanted it to sound small. I don't know if it is… Should I bring it up to him later on…",
      notebookEntry:
        "Was in his room, heard scream and saw Helen earlier that evening, described her as normal",
    },
    {
      id: "B",
      cost: 1,
      playerLine: "This must be a rough situation for everyone.",
      npcResponse: "You don't say. Don't drag me into whatever you're doing.",
      monologue:
        "Whatever I'm doing. Like he already knows I'm trying to figure something out. I didn't give him anything and he still saw through it. Or maybe he says that to everyone.",
      notebookEntry: null,
    },
  ],
};

const runawayMan = new NPC(700, 500, runawayManDialogue);
runawayMan.journalPageIndex = 3;
runawayMan.portraitKey = "runawayMan";
runawayMan.currentEmotion = "idle";

// Jerome stays in the upper area — near his room and the connecting corridors.
// He claims he was in his room all night, so keep him pacing the top half.
// Fast, nervous pacing with short pauses — anxious and evasive.
runawayMan.wanderBounds = { c0: 2, r0: 0, c1: 12, r1: 7 };
runawayMan.patrolSpeed = 2.0; // fast, nervous
runawayMan.idleDuration = 50; // short pauses — can't stay still

// Jerome's spritesheet row order is UP / DOWN / LEFT / RIGHT
// (confirmed by pixel analysis — skin-pixel centroid positions per row).
// Standard RPG Maker order would be DOWN / LEFT / RIGHT / UP.
//
//   Sheet row 0  → UP    (back of head: only 11 skin px, centroid low in frame)
//   Sheet row 1  → DOWN  (frontal: 204 skin px, x-centroid centred at 22.4)
//   Sheet row 2  → LEFT  (profile: 204 skin px, x-centroid 18.3 — face points left)
//   Sheet row 3  → RIGHT (profile: 204 skin px, x-centroid 25.2 — face points right)
//
//   DIR.down  (0) → row 1
//   DIR.left  (1) → row 2
//   DIR.right (2) → row 3
//   DIR.up    (3) → row 0
runawayMan.spriteRowMap = { 0: 1, 1: 2, 2: 3, 3: 0 };

window.runawayMan = runawayMan;
