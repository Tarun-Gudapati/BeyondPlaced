# Lesson 3 — Prompt engineering that survives production: storylines

Source: `src/lib/modules/m1.ts`, lesson `prompt-engineering`. Every claim below comes from that lesson's text. The
job descriptions and the JSON values on screen are made-up examples (the lesson's own `extract_job` example).

**The one idea:** a good prompt is a specification (role, task, constraints, output format, examples), and its
output is checked before code trusts it.
**Remembered as:** "Write the prompt like a spec, then validate what comes back."

Assumptions for all three: 1920×1080, about 90 s, ElevenLabs narration (same voice as lessons 1 and 2), no music,
the BeyondPlaced look. Picked without waiting for the user, as the brief for this run asks: **A**.

---

## A. The vague prompt, rebuilt into a spec (picked — the viewer watches one failing prompt get fixed, part by part)

- **Device / form:** the worked example + life before and after; one diagram that grows.
- **What you see and feel:** Ananya (from lessons 1 and 2) pastes a job description into her script and asks
  "Tell me about this job." A friendly paragraph comes back and her code crashes on it. Then the same prompt is
  rebuilt on screen as a specification sheet, one row at a time: role, task, constraints, output format. The job
  description moves into tags as data, an example pair shows the pattern, and the reply turns into JSON. One bad
  reply ("twelve") is caught by the schema check and fixed on a retry. It feels like debugging with a senior.
- **First 2 seconds:** a job description card with her one-line ask under it, already on screen, and the reply
  bubble starting to fill with prose.
- **Beats:** vague ask → prose reply → crash ("prose is a bug") → the spec sheet grows: role + task →
  constraints (null, never guess) → output format (JSON shape) → rules in the system prompt, data in tags (an
  injected "ignore your instructions" line is treated as data) → few-shot: one example pair, the next answer
  copies it → JSON arrives, but ctc_lpa is "twelve" → schema check rejects, error goes back, the retry passes →
  prompts are code: versions and test cases → the one line, then the next-lesson card.
- **Look:** the site's brand: mist ground, white cards, deep teal structure, coral on one item per scene (the
  crash, "Never guess", the injected line, the copied pattern, "twelve", the failing test, "validate").
- **Sound:** warm, unhurried narration; no music.

## B. The intern's first day

- **Device / form:** a moment in someone's day; split screen to one.
- **What you see and feel:** two desks. On the left a manager says "summarise this resume" and the new intern
  hands back something useless. On the right the same intern gets a one-page brief (who it is for, how long,
  what to leave out, what the output must look like) and hands back exactly what was needed. The split collapses
  and the intern's badge flips to read "LLM".
- **First 2 seconds:** a sticky note reading "summarise this resume" slapped on a desk beside a tall pile of paper.
- **Beats:** vague brief → useless result → the one-page brief, written line by line → the good result → the
  badge flips → "you brief a model the same way" → validate the result → the one line.
- **Look:** white desks on mist, teal ink on the brief, coral on the sticky note only.
- **Sound:** narration with paper sounds; no music.

## C. The form that cannot be filled in wrong (the bold one)

- **Device / form:** the object is the explanation; an endless zoom.
- **What you see and feel:** the prompt is drawn as a printed form with boxes: ROLE, TASK, RULES, OUTPUT. The
  camera dives into the OUTPUT box, which is itself a smaller form with three fields (role, skills, ctc_lpa),
  then into ctc_lpa, where a stamp machine accepts numbers and bounces the word "twelve" back up the page.
  Zoom out, and the whole form is a single file in a repo with a version number.
- **First 2 seconds:** a blank form sliding under a rubber stamp that reads "VAGUE", stamped in coral.
- **Beats:** the blank form → boxes filled → dive: the output box → dive: one field and its type → the stamp
  rejects, then accepts → zoom out: SYSTEM_V1, SYSTEM_V2 and a test list → the one line.
- **Look:** white form on mist with teal rules and mono labels, coral for the stamp.
- **Sound:** a stamp thud on each check under the narration; no music.
