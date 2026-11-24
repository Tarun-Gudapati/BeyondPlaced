# Lesson 16 — FastAPI backend with streaming responses: storylines

Source: lesson `fastapi-streaming` in `src/lib/modules/m6.ts`. Every claim below comes from that lesson. The
"6 seconds" and "0.4 s" figures are the lesson's own example and are shown as illustrative.

**The one idea:** streaming does not make the model faster or cheaper; it cuts the wait before the first word.
**Remembered as:** "Same total time, same cost. The first word just shows up straight away."

Assumptions for all three: 1920×1080, 90–120 s, ElevenLabs narration (same voice as lesson 1), no music,
BeyondPlaced look. Picked without waiting for the user, as the run brief asks: **A**.

---

## A. Same bot, two waits (recommended — the viewer feels the difference before it is explained)

- **Device / form:** life before and after + the worked example; split screen that resolves into one shared timeline.
- **What you see and feel:** Rahul asks his placement bot to explain binary search and stares at a spinner. The same
  question runs again with streaming on and the answer starts at once. A shared time axis under both windows shows
  the two answers finishing at the same moment, so "faster" is replaced by "time to first token". Then the one
  question travels the real path: browser → FastAPI → model → back as Server-Sent Events → the page.
- **First 2 seconds:** a chat window with "Explain binary search" already sent and three waiting dots; "Rahul, built
  a placement bot" beside it.
- **Beats:** the wait (no streaming) → the same bot streaming → both bars end together: time to first token →
  the path: POST to FastAPI, `stream=True`, each chunk yielded into a StreamingResponse → on the wire:
  `data: {...}` + blank line, JSON because tokens contain newlines → in the browser: reads don't match events, so
  buffer and split → after deploy a buffering proxy delivers one lump → the one line.
- **Look:** the site's brand: mist ground, white cards, deep teal structure, coral only on the key item of each
  scene (the first-token segment, the `yield` line, the `\n`, the half event, the proxy), Inter + JetBrains Mono.
- **Sound:** narration only; warm and unhurried.

## B. Follow one token

- **Device / form:** the worked example; one continuous take.
- **What you see and feel:** the camera rides with a single token, " middle", from the moment the model produces it:
  into the SDK chunk, through the `yield`, wrapped as `data: {"token": " middle"}`, down the wire, split out of a
  network read, and finally onto the page. Feels like a parcel-tracking screen for one word.
- **First 2 seconds:** a dark model block emits a tile reading " middle" and the camera starts to follow it.
- **Beats:** token leaves the model → chunk.delta.content → yield → SSE framing → the network read that cuts an
  event in half → buffer → page → pull back: hundreds of tokens doing the same → the one line.
- **Look:** mist ground, a single teal track across the frame, coral only on the token being followed.
- **Sound:** narration plus a soft tick at each hop.

## C. The canteen counter (the bold one)

- **Device / form:** something everyone already knows; before and after as a scene.
- **What you see and feel:** a college canteen. Counter one hands over the whole thali only when every item is
  cooked; the queue stares at an empty tray. Counter two passes each dosa across the moment it leaves the tawa.
  Both kitchens cook at the same speed. The counters then turn into the two endpoints: JSON response and
  StreamingResponse.
- **First 2 seconds:** two counters, one with a long silent queue, one where plates are already moving.
- **Beats:** the queue waits → the second counter serves as it cooks → same kitchen speed, same bill → the counter
  becomes FastAPI, each dosa a token, the plate a `data:` line → a middleman who collects plates (the buffering
  proxy) spoils it → the one line.
- **Look:** warm illustrated canteen in the brand palette, coral on the first plate served.
- **Sound:** narration with light kitchen sounds underneath.
