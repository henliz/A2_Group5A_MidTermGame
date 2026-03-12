//runawayMan.js — Jerome

const runawayManDialogue = {
  name: "Mysterious Man",
  opening: "Everyone's on edge… what do you want?",
  repeatLine: "…I already said what I had to say.",
  hesitationLine: "I can't deal with his attitude right now, not like this…",
  options: [
    {
      id: "A",
      cost: 3,
      playerLine:
        "I didn't do anything. I want to understand what happened. Where were you?",
      npcResponse:
        "I was in my room the whole time! I already talked with the innkeeper, and I do not want to repeat myself to every stranger who comes up to me.",
      monologue: "Did I say something wrong? Why did he get worked up?…",
      notebookEntry: "RM claims he was in his room — got defensive quickly.",
    },
    {
      id: "B",
      cost: 2,
      playerLine: "Rough night?",
      npcResponse:
        "You don't say. I wanted to check out and leave, but now I'm stuck here.",
      monologue: "Maybe he is just as anxious as I am…",
      notebookEntry:
        "RM was planning to leave — seemed eager to get out before the lockdown.",
    },
    {
      id: "C",
      cost: 0,
      playerLine: "Sorry… I was just passing by",
      npcResponse: "…Don't drag me into anything.",
      monologue: "Maybe I should talk with other guests here.",
      notebookEntry: null,
    },
  ],
};

const runawayMan = new NPC(700, 500, runawayManDialogue);
runawayMan.journalPageIndex = 2;
runawayMan.portraitKey = "runawayMan";
runawayMan.currentEmotion = "idle";

// Jerome stays in the upper area — near his room and the connecting corridors.
// He claims he was in his room all night, so keep him pacing the top half.
// Fast, nervous pacing with short pauses — anxious and evasive.
runawayMan.wanderBounds = { c0: 2, r0: 0, c1: 12, r1: 7 };
runawayMan.patrolSpeed  = 2.0;  // fast, nervous
runawayMan.idleDuration = 50;   // short pauses — can't stay still

// Jerome's spritesheet row order is RIGHT / DOWN / LEFT / UP,
// which differs from the standard RPG Maker order (DOWN / LEFT / RIGHT / UP).
//   DIR.down  (0) → row 1  (frontal / toward viewer)
//   DIR.left  (1) → row 2  (left-facing profile)
//   DIR.right (2) → row 0  (right-facing profile — top row of sheet)
//   DIR.up    (3) → row 3  (back of character)
// If sprites look wrong in-game, swap row 0 and row 1 in the map below.
runawayMan.spriteRowMap = { 0: 1, 1: 2, 2: 0, 3: 3 };

window.runawayMan = runawayMan;
