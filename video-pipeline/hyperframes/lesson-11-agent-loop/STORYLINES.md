# Lesson 11 — Building an agent loop from scratch: storylines

Source: `src/lib/modules/m4.ts` lesson `agent-loop`. Every claim below comes from that lesson. The three resumes
(karthik.pdf, meera.pdf, imran.pdf) and their scores are the lesson's made-up sample data, shown as illustrative.

**The one idea:** an agent is the tool-call handshake in a loop (think, act, observe) that must always have a way to stop.
**Remembered as:** "A model, some tools and a loop with a step limit."

Assumptions for all three: 1920×1080, 85–100 s, ElevenLabs narration (same voice as lesson 1), no music.

---

## A. Three resumes round the loop (picked — the module project itself is the worked example)

- **Device / form:** the worked example + one diagram that grows; one frame that rebuilds.
- **What you see and feel:** three resume files and the goal "shortlist the top 2". A ring with three stations
  (Think, Act, Observe) draws itself, and the task travels round it: list the files, read a resume, save a score,
  while a message list beside the ring grows by one row per lap. Then the same ring shows how it ends: a final
  answer, or a step counter hitting MAX_STEPS.
- **First 2 seconds:** three resume sheets fanned on the left and the goal card "Shortlist the best 2" beside them.
- **Beats:** the task → you would do it step by step → the ring: think, act, observe → three laps, the list grows →
  final answer exits the ring → a stuck call repeats, the counter climbs, MAX_STEPS stops it → a token budget bar →
  a failed tool becomes an observation and the next call is corrected → the list is the only memory, resent every
  turn → "An agent = model + tools + a loop that stops."
- **Look:** the BeyondPlaced site: mist ground, ink text, teal structure, coral only on the one key item per scene;
  Inter for words, JetBrains Mono for code.
- **Sound:** warm narration only.

## B. The step log as the film

- **Device / form:** the result first; one continuous take.
- **What you see and feel:** a terminal prints the agent's step log line by line. The camera rides down the log,
  and each line pushes out a small diagram of what just happened (a call, a result, an error, a recovery).
- **First 2 seconds:** `[step 1] list_resumes() -> ["imran.pdf", "karthik.pdf", "meera.pdf"]` typing itself.
- **Beats:** step 1 → step 2 → an error line → the corrected call → `[done in 6 steps]` → the loop behind it.
- **Look:** white terminal card on mist, mono type, coral on the error line.
- **Sound:** narration with a soft key tick per log line.

## C. The intern and the supervisor (the bold one)

- **Device / form:** a character does the work; split screen to one.
- **What you see and feel:** on the left an intern asks for one thing at a time; on the right a supervisor with a
  step counter does each thing and hands back a note. When the intern starts asking the same thing again and again,
  the supervisor's counter hits the limit and the split collapses into the loop diagram.
- **First 2 seconds:** two desks, a note sliding from one to the other: "list the resumes".
- **Beats:** note → action → note back → repeat → the repeated note → the counter stops it → the diagram.
- **Look:** flat office illustration in teal and mist, coral on the counter.
- **Sound:** narration and paper slides.
