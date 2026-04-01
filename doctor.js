//doctor.js

const doctorDialogue = {
  name: "Doctor Krisia",
  exitMonologue: "She looks like she needs space… I shouldn't push it.",
  opening:
    "I keep thinking I should be doing something useful. That's the instinct, isn't it? Something happens and you want to fix it. There's nothing to fix around here.",
  repeatLine: "Hello Again.",
  hesitationLine: "I'm too drained to approach her right now…",
  options: [
    {
      id: "A",
      cost: 2,
      playerLine:
        "You spoke up first this morning, when you said how could this happen. Did you know her at all?",
      npcResponse:
        "Not really. She brought me extra blankets the first night. Kept asking questions about my work. She seemed … curious. About everyone, I think, not just me.",
      monologue:
        "Curious about everyone. That could mean nothing. Or it could mean she knew things about all of them.",
      notebookEntry:
        "Helen was curious about Dr. Krisia…Seems like she makes an effort to get to know the guest",
    },
    {
      id: "B",
      cost: 1,
      playerLine: "Did you sleep at all?",
      npcResponse:
        "Barely. I tried to, but you can't really shake the feeling after the scream. You're the one who just arrived, aren't you? That must feel awful. Being new to all of this.",
      monologue:
        "She turned it back to me. I don't know if that's kindness or deflection. I said yes and didn't follow up and now I'm not sure which one it was.",
      notebookEntry: null,
    },
    {
      id: "C",
      cost: 0,
      playerLine: "..Hi",
      npcResponse: "Hi",
      monologue:
        "That was so awkward. I got lost in thought trying to say something to her and now I'm at the other side of the room. Maybe I should try talking with someone else…",
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
