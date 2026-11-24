# Lesson 15 — LoRA fine-tuning on a free Colab GPU: storylines

Source: `src/lib/modules/m5.ts` lesson `lora-finetuning`. Every claim below comes from that lesson. The before /
after replies and the loss curve are illustrative and must be labelled so on screen.

**The one idea:** you do not retrain the model; you freeze it and train a small adapter beside it.
**Remembered as:** "Freeze the model, train a small adapter."

Assumptions for all three: 1920×1080, ~85 s, ElevenLabs narration, no music, BeyondPlaced look from lesson 1.

---

## A. The locked matrix and the two thin strips (picked — the object is the idea, and it carries every later beat)

- **Device / form:** the object is the explanation; one diagram that grows.
- **What you see and feel:** Meera (from lesson 14) has 500 approved Hinglish replies and a free Colab T4. A big
  grid of weights fills the frame and overflows the GPU's memory bar. It gets a lock; two thin strips, A and B,
  appear beside it and are the only things that light up during training. The same picture then shrinks into the
  memory bar (4-bit base + adapter fits), trains (loss falls), is tested (before / after reply) and ships as a
  small file.
- **First 2 seconds:** a stack of 500 reply tiles on the left, a T4 memory bar on the right, and a large weight
  grid that does not fit inside it.
- **Beats:** the question → full fine-tuning overflows the bar → lock the grid, add strips A and B → only the
  strips are trained (well under 1%), B starts at zero so nothing changes yet → 4-bit base + adapter fits the T4
  (QLoRA) → training: loss falls, validation loss watched → before / after on an unseen question → the adapter
  file, megabytes not gigabytes, placed on top of the public base model → the one line.
- **Look:** the site's brand — mist ground, white cards, deep teal structure, coral only on the trainable strips
  (and on "doesn't fit" in the first scene), Inter + JetBrains Mono.
- **Sound:** warm narration only.

## B. The textbook and the sticky notes

- **Device / form:** something everyone already uses; life before and after.
- **What you see and feel:** a thick printed textbook (the base model) cannot be rewritten, so a student adds a few
  sticky notes in the margins (the adapter). The book stays the same for everyone; the notes make it hers. Swap
  the notes and the same book serves another subject.
- **First 2 seconds:** a hand trying to rewrite a page of a 1,000-page textbook with a pen, and giving up.
- **Beats:** rewriting every page (full fine-tuning) → sticky notes instead (LoRA) → photocopying the book smaller
  to fit the bag (4-bit) → revising with the notes (training) → answering an exam question before and after →
  handing only the notes to a friend who owns the same book → the one line.
- **Look:** warm white desk from above, teal book, coral notes.
- **Sound:** narration; paper sounds.

## C. One notebook, start to finish (the bold one)

- **Device / form:** the result first; the real UI as the stage.
- **What you see and feel:** the finished Hugging Face model page appears first, then the film rewinds through the
  Colab notebook that made it: the cell that loads in 4-bit, the LoraConfig cell, the training log scrolling,
  the before/after cell, the push cell.
- **First 2 seconds:** a model page titled "qwen-hinglish-support-lora" with a small file size next to it.
- **Beats:** the published adapter → rewind → 4-bit load → LoraConfig (r, alpha, target modules) → trainable
  parameters line → loss log → before / after → push → the one line.
- **Look:** white notebook cells on mist, teal run buttons, coral on the trainable-parameters line.
- **Sound:** narration; a soft click per cell run.
