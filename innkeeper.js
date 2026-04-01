//innkeeper.js

const innkeeperDialogue = {
  name: "Innkeeper",
  exitMonologue:
    "He seems too stressed to talk further… maybe I should try someone else.",
  opening:
    "Tsk, this is terrible. My inn's reputation will be ruined… What do you want girl?",
  repeatLine: "What is the issue? I am busy right now.",
  hesitationLine: "I don't have the energy to deal with them right now…",
  options: [
    {
      id: "A",
      cost: 2,
      playerLine: "I just wanted to know what happened, when you found her",
      npcResponse:
        "What I saw? I heard a scream and found Front Desk Lady…dead. Don't ask me more question troublemaker, I have guests to manage!",
      monologue:
        "She cut herself off. She was going to say something and decided not to. I don't know if pushing further would help or just make her angrier at me.",
      notebookEntry:
        "Heard the scream before finding her. Knows more than she's saying. Doesn't want guests involved.",
    },
    {
      id: "B",
      cost: 1,
      playerLine: "'Are you okay?'",
      npcResponse: "'Of course not… Someone is dead'",
      monologue:
        "That was the wrong question. Or maybe there wasn't a right one. I should have asked something real while I had the chance.",
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
