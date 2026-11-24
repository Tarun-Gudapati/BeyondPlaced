# SPEC (DRAFT, not built) — Lesson 8: The full RAG pipeline with citations (storyline A)

STATUS:  BLOCKED on narration audio. `node src/scene-tts.js hyperframes/lesson-08-rag-pipeline` returned
         ElevenLabs 401 `quota_exceeded` on line l01 (24 credits left, 1,146 characters needed). No audio, no
         timing.json, no compositions, no READY.json. `narration.json` is final; run scene-tts once when credits
         are back, then time every reveal below to its word (scene start = first line's start in timing.json) and
         set every duration in index.html from timing.json. Copy the scene structure, helpers (blurIn / blurOut)
         and look from `../lesson-07-chunking/compositions/`.

GOAL:    the viewer can draw the pipeline: index once; per question retrieve, build a numbered prompt, answer with
         citations, or say "I don't know".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    about 80 s (1,146 narration characters, 10 lines, 7 scenes). Narration is the clock.
LOOK:    the BeyondPlaced site, same as lessons 1 and 7. Ground Mist #F0FDFA (white cards); ink #0B1220; structure
         Deep Teal #0F766E, tints #CCFBF1 / #99F6E4 / #5EEAD4; accent Coral #EA580C (text #C2410C, tint #FFEDD5) only
         on the cited chunk [2] and the "say you don't know" rule. Display Inter 900 at 64–128 px, labels Inter 700
         at 30–44 px, prompt and document text JetBrains Mono 700 at 32–50 px (nothing under 28 px).
OBJECTS: the phone chat and policy page from lesson 7; a dark "LLM" block; a dashed "never read" wall; chunk cards
         numbered [1]–[4] with page tags; mono vector rows; a vector store (stacked rounded slabs); a dark prompt
         card with Rules and Context columns; a terminal card listing retrieved chunks.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.9 s; exits power3.in 0.2–0.25 s;
         words blur 6 px → 0 in 0.12–0.2 s; list stagger 40–150 ms. Use fromTo, gsap.set for hidden starts.
SHOTS:   puzzle (l01–l02): phone with Riya's backlog question at left, LLM block and the policy page split by a
         dashed wall labelled "never read" on "never read"; answer bubble with "page 4" on "name the page". Then
         "RAG" large, its three words on "retrieval-augmented generation", "1 retrieve" / "2 generate" on "First
         retrieve … then … generate", tag "open-book exam" on its words →
         index (l03): "Phase 1 · once, offline" on "Phase one"; a diagram that grows left to right: PDF page on
         "Read the PDF", four chunk cards on "chunks", mono vector rows on "embed", store with page tags on
         "store … page numbers" →
         retrieve (l04): "Phase 2 · every question"; question bubble → "same embedding model" arrow on "same model"
         → store; four cards [1]–[4] fly out on "four nearest chunks", [2] carries the coral sentence →
         prompt (l05): dark prompt card; Context column fills with [1]–[4] on "each with a number"; Rules column:
         "Answer ONLY from the context" / "Cite the number" / "Not there? Say you don't know" (coral) on their words →
         answer (l06–l07): answer card "Students with active backlogs are not eligible. [2]", a line from [2] to
         "[2] placement_policy.pdf, page 4" on "page four"; then question "What is the hostel wifi password?" on
         "hostel wifi password" and reply "I don't know based on this document." on "refuses" →
         debug (l08): terminal card with four retrieved rows (page, distance, text; illustrative) on "print the
         retrieved chunks"; the coral sentence card sits outside it labelled "never retrieved" on "never arrived";
         "fix retrieval first" on "no prompt can fix it" →
         claim (l09–l10): "RAG doesn't train the model." / "It hands it the right page." then the next-lesson card
         "Evaluating RAG so you can prove it works" with the BeyondPlaced mark.
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except quoted prompt text and the final claim).
QA:      one frame per reveal group in every scene; check the prompt card text sizes and the [2] → page 4 link.
NUMBERS: k = 4, "[2]", "page 4" and the three rules come from the lesson text and narration; vector values,
         distances and other page numbers are illustrative and must be labelled so.
AFTER:   locked `check` to 0 errors, one or two locked snapshot runs, then READY.json
         `{ "slug": "rag-pipeline", "free": false, "posterAt": <s> }` and a first `video` block in
         `src/lib/modules/m3.ts`: `supabase:rag-pipeline/rag-pipeline.mp4|.jpg|.vtt`, title
         "The RAG pipeline, in N seconds".
