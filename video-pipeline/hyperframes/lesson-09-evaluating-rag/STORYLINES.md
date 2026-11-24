# Lesson 9 — Evaluating RAG so you can prove it works: storylines

Source: `src/lib/modules/m3.ts`, lesson `evaluating-rag`. Every claim below comes from that lesson. All scores,
page numbers and questions on screen are examples and are shown as illustrative.

**The one idea:** measure retrieval and generation separately on a golden set, so you know which half to fix.
**Remembered as:** "Don't say it seems fine. Show the numbers: hit rate for retrieval, faithfulness for the answer."

Assumptions for all three: 1920×1080, ~80 s, ElevenLabs narration, no music (voice only, as in lesson 1's build).

---

## A. The interview question (recommended — one question from an interviewer frames every metric)

- **Device / form:** a moment in someone's day + the worked example; one frame that rebuilds.
- **What you see and feel:** Riya demos her PDF bot and the interviewer asks "How do you know it works?". Her three
  hand-picked questions are struck out, and the screen rebuilds into what a real answer looks like: a golden set,
  a hit-rate grid, a judge model and a two-number diagnosis. It ends back in the interview with the numbers.
- **First 2 seconds:** the bot's phone chat on the left and a large speech bubble on the right: "How do you know
  it works?"
- **Beats:** the question → three hand-picked questions are not an answer → golden set (20–30 questions, reference
  answer, page; a few unanswerable ones) → hit rate@4 (right page in the top four?) → judge model checks
  faithfulness → low hit rate: fix retrieval; high hit rate, low faithfulness: fix the prompt → one change at a
  time, logged in the README → the one line.
- **Look:** the site's brand: mist ground, white cards, deep-teal structure, coral only on the failing number of
  the moment and the struck-out demo; Inter for words, JetBrains Mono for JSON and metrics.
- **Sound:** warm, unhurried narration only.

## B. The doctor's report

- **Device / form:** the object is the explanation; a flight across one report.
- **What you see and feel:** the RAG system gets a health check-up. A lab report with two readings, "retrieval"
  and "answer", each with a normal range; the camera moves from reading to reading and a prescription is written
  for whichever is out of range. Calm and clinical.
- **First 2 seconds:** a lab report slides in with one reading circled in coral.
- **Beats:** symptoms (wrong answers) → the test panel (golden set) → reading 1 hit rate → reading 2 faithfulness →
  diagnosis and prescription → follow-up visit (re-run after one change) → the one line.
- **Look:** white report paper on mist, teal ruled lines, coral circle.
- **Sound:** narration only.

## C. Marking the answer sheets (the bold one)

- **Device / form:** something every student knows; split screen to one.
- **What you see and feel:** the bot sits an exam. Twenty answer sheets get marked twice: once for "did you open
  the right page?" and once for "did you copy from the page or make it up?". Two marks columns fill in and the
  totals become the README numbers.
- **First 2 seconds:** a red pen ticks an answer sheet headed "PDF bot · roll no. 1".
- **Beats:** the question paper is the golden set → first marking pass (right page) → second marking pass
  (faithful) by an external examiner (judge model) → the marks sheet shows which subject failed → re-exam after one
  change → the one line.
- **Look:** answer sheets on mist, teal ticks, coral crosses.
- **Sound:** narration with pen ticks.
