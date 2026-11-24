# Lesson 4 — Embeddings: meaning as numbers: storylines

Source: `src/lib/modules/m2.ts` lesson `embeddings-intuition`. Every claim below comes from that lesson. The 2D map
is a sketch of a space with hundreds of dimensions and is labelled illustrative; "1536" is the lesson's own example.

**The one idea:** an embedding turns text into a point in space, and close points mean similar meaning.
**Remembered as:** "Search by meaning, not by matching words: embed it, then find what is nearby."

Assumptions for all three: 1920×1080, about 90 s, ElevenLabs narration, no music (voice only, as in lesson 1),
BeyondPlaced look. Picked without a stop, as the brief asks: **A**.

---

## A. The search that found nothing (recommended — one failed search every student has had carries each idea)

- **Device / form:** a moment in a student's day + the worked example; one frame that rebuilds.
- **What you see and feel:** Riya searches her college notice board for "placement drive" and gets zero results while
  the notice "Campus recruitment starts Monday" sits right below. That same query is turned into numbers, then into
  a dot on a map, and lands beside the notice it could not find. The failure at the start is fixed in front of you.
- **First 2 seconds:** a notice-board window with "placement drive" in the search box and a coral "0 results".
- **Beats:** search fails → the two phrases share no words → text goes into the embedding model and comes out as a
  row of numbers (1536) → the row collapses into one point → the 2D map: placement drive beside campus recruitment,
  biryani recipe far away → Riya's query drops in and the nearest points light up → uses (RAG, resume ↔ JD) →
  two rules: same model for documents and queries; similar ≠ true → the one line.
- **Look:** the site's own brand — mist ground, white cards, deep teal structure, coral only on the key item of each
  scene, Inter for words and JetBrains Mono for text-as-data and numbers.
- **Sound:** warm, unhurried narration; no music.

## B. The map of India, for meaning

- **Device / form:** something everyone already knows; a flight through one world.
- **What you see and feel:** a map of India where latitude and longitude place Bengaluru next to Mysuru. The camera
  pulls back and the cities are replaced by sentences: the same map, but the ground is meaning.
- **First 2 seconds:** a pin drops on Bengaluru with its two coordinates beside it.
- **Beats:** two numbers place a city → near cities have near numbers → swap cities for sentences → more than two
  numbers → nearest neighbours of a query → different models are different maps → the one line.
- **Look:** flat teal map on mist, white pins, coral on the query pin.
- **Sound:** narration with a soft tick per pin.

## C. The resume that matched itself (the bold one)

- **Device / form:** the result first; object-to-object chain.
- **What you see and feel:** a resume bullet and a job-description line snap together with a score, although they
  share no words. Then the film rewinds to show where the score came from.
- **First 2 seconds:** "Built a REST API in Flask" locks onto "Backend development experience" with a score.
- **Beats:** the match → rewind → each line becomes numbers → the numbers become points → distance is the score →
  where it fails (love / hate) → the one line.
- **Look:** two white documents on mist, teal connecting lines, coral on the score.
- **Sound:** narration; a paper snap on each match.
