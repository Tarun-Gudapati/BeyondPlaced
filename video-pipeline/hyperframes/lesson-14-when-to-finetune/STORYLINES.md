# Lesson 14 — Prompting vs RAG vs fine-tuning: storylines

Source: `src/lib/modules/m5.ts` lesson `when-to-finetune`. Every claim below comes from that lesson. "One reply in
five" is the lesson's own illustrative figure; the policy wording on screen ("7 din", "24 ghante") is made up and
labelled illustrative.

**The one idea:** a model fails for three different reasons, and each has its own fix; start with the cheapest.
**Remembered as:** "Prompting changes instructions, RAG changes knowledge, fine-tuning changes behaviour."

Assumptions for all three: 1920×1080, ~90 s, ElevenLabs narration, no music, BeyondPlaced look from lesson 1.

---

## A. One bot, three failures (picked — the viewer diagnoses each failure before the fix is named)

- **Device / form:** the worked example; one frame that rebuilds around a phone that never leaves.
- **What you see and feel:** Meera's support bot for a Bengaluru food app fails three times in the same chat
  window. Each failure is diagnosed in two words on the right ("Not told." / "Doesn't know." / "Behaviour.") and
  fixed by a different object: a prompt card that gains two lines, a document that slides into the prompt, a
  stack of approved replies that trains the model. Then the three fixes line up as a staircase.
- **First 2 seconds:** a phone chat with three bot replies, each stamped with a coral cross.
- **Beats:** three wrong replies, "Fine-tune it?" struck through → failure 1: an essay → add a rule and an example
  → failure 2: last year's policy → retrieve the document, update it, answer updates → failure 3: one stiff reply
  in five → train on approved replies → the staircase, cheapest first, measure at each step; a fact bounced from
  "fine-tune" down to "RAG" → the one line.
- **Look:** the site's brand — mist ground, white cards, deep teal structure, coral only on the failing thing in
  each scene, Inter + JetBrains Mono.
- **Sound:** warm narration only.

## B. The intern test

- **Device / form:** a character does the work; life before and after.
- **What you see and feel:** a new intern sits at the support desk with the same prompt the model gets. First they
  have no instructions, then no policy binder, then the wrong tone. Each time the fix is what you would give a
  person: a clearer brief, the binder, weeks of feedback.
- **First 2 seconds:** an empty desk, a sticky note reading "Reply to customers", a confused intern.
- **Beats:** vague note → clear brief (prompt) → the binder arrives (RAG) → coaching with marked-up replies
  (fine-tune) → the same three, for a model → the one line.
- **Look:** warm white desk from above, teal stationery, coral pen marks.
- **Sound:** narration; paper and pen sounds.

## C. The ₹ staircase (the bold one)

- **Device / form:** a number lands; a flight through one world.
- **What you see and feel:** a staircase where each step is taller and more expensive than the last. A ball (the
  project) tries to jump straight to the top step, falls, and then climbs one step at a time, stopping at the
  first step where a gauge turns green.
- **First 2 seconds:** a ball launching at the top step marked "Fine-tune" and missing.
- **Beats:** the failed jump → step 1 prompt, gauge → step 2 RAG, gauge → step 3 fine-tune, gauge → most projects
  stop at RAG → the one line.
- **Look:** mist ground, teal steps, a coral ball.
- **Sound:** narration; a soft bounce per step.
