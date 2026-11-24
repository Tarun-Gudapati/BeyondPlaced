# Lesson 5 — Cosine similarity from scratch with NumPy: storylines

Source: `src/lib/modules/m2.ts` lesson `cosine-similarity`. Every claim below comes from that lesson. The worked
example ([3, 4] and [6, 8] score 1; 45 degrees scores about 0.71) is the lesson's own. The scores in the ranking
table are illustrative and labelled so.

**The one idea:** similarity is the angle between two vectors; normalise once and it is a dot product.
**Remembered as:** "Vector search is a dot product and a sort."

Assumptions for all three: 1920×1080, about 90 s, ElevenLabs narration, no music (voice only, as in lesson 1),
BeyondPlaced look. Picked without a stop, as the brief asks: **A**.

---

## A. One question, fifty answers (recommended — the bot has a real job, and the maths arrives as the way to do it)

- **Device / form:** the worked example + one diagram that grows; one frame that rebuilds.
- **What you see and feel:** Arjun's placement FAQ bot holds one question and fifty answers as vectors. Two of them
  become arrows, the angle between them becomes a score, the score becomes a formula, and the formula becomes a
  matrix multiplication that ranks all fifty answers at once. By the end the question has found its answer.
- **First 2 seconds:** a question tile and a stack of answer cards, each with a strip of numbers under it.
- **Beats:** which answer is closest? → two arrows and the angle between them (length changes, the angle does not)
  → the arrow sweeps: 1, 0, −1, and 0.71 at 45° → the formula builds, then [3, 4] and [6, 8] score exactly 1 →
  every arrow scaled to length 1, the denominator disappears → matrix × question = fifty scores → sort, top three →
  embedded once, only the question is new → 0.82 is not 82% → the one line.
- **Look:** the site's own brand — mist ground, white cards, deep teal structure, coral only on the key item of each
  scene, Inter for words and JetBrains Mono for vectors, formulas and code.
- **Sound:** warm, unhurried narration; no music.

## B. The compass

- **Device / form:** the object is the explanation; a single instrument on screen throughout.
- **What you see and feel:** a compass with two needles. One needle is the question, the other swings through every
  answer, and a dial reads the score. Direction matters, needle length does not.
- **First 2 seconds:** a needle swings and the dial snaps to 1.00.
- **Beats:** needle sweep 1 → 0 → −1 → needle length changes, dial holds → all needles the same length → the dial
  reads fifty answers in a row → top three → the one line.
- **Look:** a white dial on mist, teal needles, coral on the reading.
- **Sound:** narration with a soft tick as the dial lands.

## C. Five lines of NumPy, typed live (the bold one)

- **Device / form:** the result first; a code editor that explains itself.
- **What you see and feel:** five lines of NumPy run and return the right FAQ. Then each line lifts off the editor
  and turns into the picture it stands for: `a @ b` becomes two arrows, `norm` becomes a ruler, `argsort` a shuffle.
- **First 2 seconds:** a terminal prints the top answer with a score beside it.
- **Beats:** the result → line 1 becomes arrows → line 2 becomes the unit circle → line 3 becomes the matrix →
  line 4 becomes the sort → the warning about scores → the one line.
- **Look:** a dark editor card on mist, teal highlights, coral cursor.
- **Sound:** narration; key taps on each line.
