//doctor.js

const doctorDialogue = {
  name: "Doctor Krisia",
  opening: "Oh hi. Sorry, I'm still trying to process what happened.",
  repeatLine: "I don't really have anything else to say right now.",
  hesitationLine: "I'm too drained to approach her right now…",
  options: [
    {
      id: "A",
      cost: 3,
      playerLine: "You spoke up first… um did you know her?",
      npcResponse:
        "Not really. I suggested some medicine she could use for her cold, but she kept asking personal questions.",
      monologue: "I hope I didn't sound like I'm prying on her…",
      notebookEntry:
        "WD had a brief interaction with FDL — FDL was asking her personal questions.",
    },
    {
      id: "B",
      cost: 2,
      playerLine: "Did you sleep at all?",
      npcResponse:
        "Barely. I tried to, but you can't really shake the feeling after the scream.",
      monologue: "She didn't seem bothered… I think its fine?",
      notebookEntry: "Doctor claims she was in her room but couldn't sleep.",
    },
    {
      id: "C",
      cost: 0,
      playerLine: "...Hi",
      npcResponse: "Hi.",
      monologue:
        "That was so awkward… Maybe I should try talking with someone else…",
      notebookEntry: null,
    },
  ],
};

const doctor = new NPC(600, 450, doctorDialogue);
doctor.journalPageIndex = 2;
doctor.portraitKey = "doctor";
doctor.currentEmotion = "idle";

// Doctor wanders the lower half of the inn — lobby (rows 12–14) and the
// connecting tavern area (rows 8–9). She routes through the centre corridor
// (rows 10–11) automatically via A*.
// Slow, thoughtful pace — she's still processing everything.
doctor.wanderBounds = { c0: 2, r0: 8, c1: 12, r1: 14 };
doctor.patrolSpeed = 0.9; // slow
doctor.idleDuration = 200; // long pauses — standing and thinking

window.doctor = doctor;
