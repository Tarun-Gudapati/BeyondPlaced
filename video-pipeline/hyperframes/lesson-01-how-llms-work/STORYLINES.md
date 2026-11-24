# Lesson 1 — How LLMs actually work: storylines

Source: `src/lib/course.ts` lesson `how-llms-work` and `video-pipeline/lessons.json`. Every claim below comes from
that lesson. "Bengaluru ≈ 3 tokens" is the lesson's own example and is shown as illustrative.

**The one idea:** an LLM predicts the next token, one at a time, and remembers nothing between calls.
**Remembered as:** "It's autocomplete on repeat, and the app resends the whole chat every time."

Assumptions for all three: 1920×1080, 2–3 min, ElevenLabs narration (paid; free fallback is the local Kokoro voice),
music from the bundled free set kept under the voice, a 30 s vertical cut for Reels made afterwards.

---

## A. The question that writes its own answer (recommended — one real student question carries every idea)

- **Device / form:** a moment in a student's day + the worked example; one frame that rebuilds.
- **What you see and feel:** a final-year student asks a chatbot "Is Bengaluru good for freshers?". The chat screen
  rebuilds itself into the machine underneath, and that one question travels through every step until the answer
  appears, so the viewer feels they've watched the trick happen rather than been told about it.
- **First 2 seconds:** a phone chat with the question already sent, the reply's first word just appearing, and the
  word "Bengaluru" visibly splitting into three coloured token chips.
- **Beats:** the question → split into tokens (cost per token) → one prediction: bars of next-token probabilities,
  the top one picked and appended → the loop runs fast and the reply builds word by word → temperature knob: 0 picks
  the same bar every time, 0.7 lets a lower bar win (same question, two answers, the lesson task) → the student's
  follow-up message: pull back to show the app resending the whole conversation inside the context window →
  plausible ≠ true: a confident wrong fact gets struck through → the one line: "An LLM is stateless. Memory is the
  app's job."
- **Look:** the site's own brand — white and mist ground, deep teal ink, coral rationed to the picked token, Inter
  for words and JetBrains Mono for tokens and code.
- **Sound:** warm, unhurried narration; a soft key tick on each token appended; quiet piano bed.

## B. The next-token machine

- **Device / form:** the object is the explanation; a flight through one machine.
- **What you see and feel:** a big, tactile machine — a token hopper, a wheel of probabilities, a temperature lever
  and a paper tape that grows into the reply — toured with cutaways. Feels like a science-museum exhibit.
- **First 2 seconds:** a token tile reading "Beng" drops into a hopper and the wheel spins.
- **Beats:** tiles in → the wheel lands on the next token → the tape grows → the lever moves and the wheel gets
  looser → the tape loops back into the hopper (context window) → the tray empties after each call (stateless) →
  the one line.
- **Look:** warm off-white workshop, teal-painted metal, coral only on the selected tile.
- **Sound:** mechanical clicks and a ratchet per token under the narration; no music.

## C. Your phone keyboard, scaled up (the bold one)

- **Device / form:** something everyone already uses; an endless zoom.
- **What you see and feel:** the three suggestion chips above a phone keyboard. The camera dives into one chip and
  it opens into the full probability list an LLM picks from; it dives again into the context window, and again into
  the server that has already forgotten you. Familiar at the start, surprising by the end.
- **First 2 seconds:** someone typing "placement drive is" and the keyboard suggesting "tomorrow · today · cancelled".
- **Beats:** keyboard suggestions → zoom: thousands of candidates with probabilities → zoom: tokens, not words →
  zoom: the temperature dial → zoom out: the whole chat resent every call → the one line.
- **Look:** deep teal ground at the zoom edges, white cards, coral on the chosen suggestion.
- **Sound:** keyboard taps that become the rhythm; light electronic bed.
