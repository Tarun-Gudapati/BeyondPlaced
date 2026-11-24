# Lesson 17 — Cost, latency and caching: storylines

Source: lesson `cost-latency` in `src/lib/modules/m6.ts`. Every claim below comes from that lesson. Token counts
(1,400 in, 150 out), the 12-second slow request and all bar heights are the lesson's examples or drawn to match
them, and are shown as illustrative. No prices appear anywhere.

**The one idea:** measure each request, then pull three levers: cache, route, send fewer tokens.
**Remembered as:** "The cheapest request is the one that never reaches the model."

Assumptions for all three: 1920×1080, 90–120 s, ElevenLabs narration (same voice as lesson 1), no music,
BeyondPlaced look. Picked without waiting for the user, as the run brief asks: **A**.

STATUS: narration.json is written but no audio exists yet (ElevenLabs returned quota_exceeded on the first line
of this lesson). Run `node src/scene-tts.js hyperframes/lesson-17-cost-latency` from `video-pipeline/` once
credits are back, then build SPEC.md and the compositions from timing.json. Planned scenes: meter (l01–l03),
levers (l04–l06), cache (l07–l09), tail (l10–l11), claim (l12–l13).

---

## A. One request's bill, then three levers (recommended — the bill is on screen before any advice is given)

- **Device / form:** the worked example; one diagram per lever, each growing part by part.
- **What you see and feel:** Rahul's placement bot goes live and requests pile up as a grid of dots. One request is
  opened up into its bill: input tokens × input price + output tokens × output price, then the log line that
  measures it. Each lever then acts on something you can see: a prompt stack that gets shorter, two questions sent
  to two different models, and a cache that lets repeated questions skip the model. A near-identical pair of
  questions shows where a paraphrase cache goes wrong, and twenty latency bars show why the average hides the slow
  request.
- **First 2 seconds:** a chat card with "What is normalisation in DBMS?" sent, and request dots starting to fill the
  right of the frame.
- **Beats:** requests arrive → the bill formula → measure: the usage log line → lever 1: the prompt stack shrinks →
  lever 2: easy question to the small model, hard one to the large model, re-run the eval → lever 3: miss goes to
  the model once, repeats hit the cache → the TCS / Infosys trap → 20 bars: average vs p95 → the one line.
- **Look:** the site's brand: mist ground, white cards, deep teal structure, coral only on the key item of each
  scene (the cost line, the trimmed tokens, the cache hit path, the slow bar), Inter + JetBrains Mono.
- **Sound:** narration only; warm and unhurried.

## B. Placement week, hour by hour

- **Device / form:** a moment in someone's day, stretched to a week; a flight along one timeline.
- **What you see and feel:** a calendar strip from Monday to Friday. Traffic climbs as company drives approach, a
  running bill climbs with it, and Rahul adds one fix per day: Tuesday the meter, Wednesday the cache, Thursday the
  router, Friday the daily limit. The bill line bends down after each fix.
- **First 2 seconds:** "Monday, 9:00" and a bill counter already ticking.
- **Beats:** traffic rises → the bill rises → meter → cache → router → trim → limit → the one line.
- **Look:** mist ground with a calendar ruled in teal; coral on the bill line only.
- **Sound:** narration plus a soft tick each time the bill steps.

## C. The photocopy shop (the bold one)

- **Device / form:** something everyone already knows; before and after as a scene.
- **What you see and feel:** the xerox shop outside every college gate before exams. The owner does not retype the
  same notes for every student: he keeps a master copy and photocopies it. A hard, new request goes to the expert in
  the back room; an easy one is handled at the counter. The shop then turns into the cache, the small model and the
  large model.
- **First 2 seconds:** a queue of students at a shop counter, all holding the same page.
- **Beats:** the queue → master copy = cache → counter vs back room = small vs large model → shorter forms = fewer
  tokens → the wrong master copy handed over (the paraphrase trap) → the one line.
- **Look:** warm illustrated shopfront in the brand palette, coral on the master copy.
- **Sound:** narration with a photocopier hum under the cache beat.
