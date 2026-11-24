# SPEC — Lesson 15: LoRA fine-tuning on a free Colab GPU (storyline A)

STATUS:  NOT BUILT. ElevenLabs quota ran out before this lesson (401 quota_exceeded while starting lesson 14), so
         no audio was requested: there is no timing.json and no compositions, and index.html is still the blank
         scaffold. There is no READY.json on purpose.
         To resume: `node src/scene-tts.js hyperframes/lesson-15-lora-finetuning` (about 1,150 characters), then
         build one composition per scene below, timed to timing.json, as in lesson-13-local-models.

GOAL:    the viewer can say "LoRA freezes the model and trains a small adapter; with a 4-bit base it fits a free T4".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    ~85 s. Narration is the clock.
LOOK:    the BeyondPlaced site, as in lessons 1 and 13. Ground #F0FDFA, white cards, ink #0B1220, teal #0F766E
         (tints #CCFBF1 / #99F6E4), coral #EA580C only on the trainable strips A and B (and on "doesn't fit" in
         the first scene). Inter 900 display (84–128 px), Inter 700 labels (28–36 px), JetBrains Mono 700 for
         matrix names, file names and numbers (30–40 px).
OBJECTS: a stack of reply tiles "500 approved replies"; a GPU memory bar "free Colab T4"; a large square grid of
         cells (the weight matrix W) with a padlock; two thin strips A (wide, short) and B (tall, narrow); a loss
         chart with two lines; a phone reply before/after; a small file tile beside a large one.
MOTION:  as lesson 13.
SHOTS:   gap (l01–l02): reply stack and T4 bar on screen at 0; the full grid tries to enter the bar and overflows,
         coral "doesn't fit" on "far more memory".
         → lora (l03–l05): the grid moves to centre and a padlock closes on "Freeze"; strips A and B draw in beside
         it on "two thin ones", labelled "adapter"; on l04 only the strips pulse and a counter-free label reads
         "trained: well under 1%"; on l05 strip B is shown empty ("B starts at zero") and an "=" joins "base
         output" and "output with adapter".
         → qlora (l06): each grid cell shrinks from 16 bits to 4 (reuse lesson 13's bit row), the grid plus
         strips slide into the T4 bar and fit; tag "QLoRA = 4-bit base + LoRA".
         → train (l07–l08): reply tiles flow into the strips; a training-loss line draws downward; on l08 a second
         validation line draws, turns upward at the end while training keeps falling, and that fork is marked
         "memorising". Chart labelled illustrative, no axis numbers.
         → test (l09): one unseen question in the phone; reply "before" in stiff English, then "after" in
         friendly Hinglish; both labelled illustrative.
         → ship (l10): a small tile "adapter · MB" beside a large "base model · GB"; the small tile lifts onto
         the large one on "put her adapter on top".
         → claim (l11–l12): "Freeze the model," / "train a small adapter." with "adapter" in coral; next-lesson
         card "FastAPI backend with streaming responses" with the BeyondPlaced mark.
BANNED:  as lesson 13, plus: invented loss values, training times or accuracy figures.
QA:      one frame per narration line.
NUMBERS: 500 replies, "well under 1%", 4-bit, "megabytes, not gigabytes" come from the lesson text. The loss
         curves and the before/after replies are illustrative and must be labelled so on screen.
