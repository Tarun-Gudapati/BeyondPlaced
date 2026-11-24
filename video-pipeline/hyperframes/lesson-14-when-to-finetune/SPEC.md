# SPEC — Lesson 14: Prompting vs RAG vs fine-tuning (storyline A)

STATUS:  NOT BUILT. ElevenLabs returned 401 quota_exceeded on the first line, so there is no audio, no timing.json
         and no compositions yet, and index.html is still the blank scaffold. There is no READY.json on purpose.
         To resume: `node src/scene-tts.js hyperframes/lesson-14-when-to-finetune` (about 1,140 characters), then
         build one composition per scene below, timed to timing.json, as in lesson-13-local-models.

GOAL:    the viewer can say "prompting changes instructions, RAG changes knowledge, fine-tuning changes behaviour;
         start with the cheapest".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    ~85–90 s. Narration is the clock.
LOOK:    the BeyondPlaced site, as in lessons 1 and 13. Ground #F0FDFA, white cards, ink #0B1220, teal #0F766E
         (tints #CCFBF1 / #99F6E4), coral #EA580C only on the failing thing in each scene. Inter 900 for display
         (84–128 px), Inter 700 labels (28–36 px), JetBrains Mono 700 for prompt text and file names (30–34 px).
OBJECTS: one phone chat (lesson 1's phone: 16 px ink bezel, 68 px radius) that stays in the same place through
         scenes 1–4; a prompt card; a document card "refund-policy.md"; a stack of approved-reply tiles; the dark
         "LLM" block; a three-step staircase.
MOTION:  as lesson 13: arrivals expo.out 0.15–0.6 s, moves power2.inOut 0.5–0.75 s, exits power3.in 0.2–0.25 s,
         word reveals blur 6 px → 0.
SHOTS:   bot (l01–l02): three bot replies in the phone, a coral cross lands on each on "wrong"; "Fine-tune it?"
         appears large on the right and is struck through on "But"; "Three reasons. Three different fixes."
         → prompt (l03–l04): the reply is a long block of text lines tagged "an essay"; right: "Failure 1 ·
         Not told."; a prompt card gains "+ Reply in at most 2 lines." on "rule" and "+ Example: …" on "example";
         the reply collapses to two lines on "run it again"; tag "edit → rerun: seconds".
         → rag (l05–l06): reply "Refund 7 din mein milega." tagged "last year's policy"; right: "Failure 2 ·
         Doesn't know."; a document card slides from a shelf into the prompt on "retrieve"; the reply changes to
         "24 ghante" with "source: refund-policy.md"; on l06 the document line and the reply change together,
         tag "no training". Policy wording labelled illustrative.
         → tune (l07–l08): five short replies, the third is stiff formal English with a coral outline and
         "1 in 5"; right: "facts ✓", prompt card ticked "rules + examples already there"; then "Failure 3 ·
         Behaviour."; a stack of tiles "approved replies × a few hundred" flows into the LLM block, which gains
         a teal ring; the stiff reply turns into Hinglish and its outline turns teal.
         → ladder (l09–l10): a staircase Prompt / RAG / Fine-tune labelled instructions / knowledge / behaviour,
         "cheapest → costliest" along the base; a marker climbs on each name; "measure" tags land on both risers;
         on l10 a fact tile heading for the top step gets a coral cross and drops onto the RAG step.
         → claim (l11–l12): three lines, one per lever, each landing on its word; next-lesson card "LoRA
         fine-tuning on a free Colab GPU" with the BeyondPlaced mark.
BANNED:  as lesson 13, plus: three cards in a row for the three levers (use the staircase and stacked lines).
QA:      one frame per narration line.
NUMBERS: "one reply in five" and "a few hundred" come from the lesson; the refund wording is made up and must be
         labelled illustrative on screen.
