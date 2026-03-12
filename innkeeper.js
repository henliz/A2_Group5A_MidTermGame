//innkeeper.js

const innkeeperDialogue = {
  name: "Innkeeper",
  opening:
    "Tsk, this is terrible. My inn's reputation will be ruined… What do you want, girl?",
  repeatLine:
    "I'm busy. Don't bother me unless you have something useful to say.",
  hesitationLine: "I don't have the energy to deal with them right now…",
  options: [
    {
      id: "A",
      cost: 3,
      playerLine:
        "I just wanted to know what happened last night. Can you tell me what you saw?",
      npcResponse:
        "What I saw? I heard a scream and found Front Desk Lady…dead. Don't ask me more question troublemaker, I have guests to manage!",
      monologue:
        "Should I have phrased that differently? He probably thinks I'm nosy…",
      notebookEntry:
        "Innkeeper heard the scream but claims to know nothing more.",
    },
    {
      id: "B",
      cost: 2,
      playerLine: "…Are you okay?",
      npcResponse: "Of course not. Someone is dead in my Inn.",
      monologue:
        "At least he didn't yell at me this time. Maybe it wasn't too awkward.",
      notebookEntry:
        "Innkeeper seems more distressed about the Inn's reputation than the death itself.",
    },
    {
      id: "C",
      cost: 0,
      playerLine: "Sorry…nevermind",
      npcResponse: "If you're not helping, don't get in the way.",
      monologue: "Maybe I should talk to the other guests.",
      notebookEntry: null,
    },
  ],
};

const innkeeper = new NPC(300, 400, innkeeperDialogue);
innkeeper.journalPageIndex = 1;
innkeeper.portraitKey = "innkeeper";
innkeeper.currentEmotion = "idle";

// Innkeeper patrols the tavern bar area (rows 8–9) and the main hall (rows 4–5).
// He routes through the centre corridor (rows 6–7) automatically via A*.
// Brisk pace — he's busy managing the inn.
innkeeper.wanderBounds = { c0: 2, r0: 4, c1: 12, r1: 9 };
innkeeper.patrolSpeed = 1.5; // brisk
innkeeper.idleDuration = 80; // short pauses — always on the move

window.innkeeper = innkeeper;
