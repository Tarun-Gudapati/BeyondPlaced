# SPEC (DRAFT, not built) — Lesson 9: Evaluating RAG so you can prove it works (storyline A)

STATUS:  BLOCKED on narration audio. ElevenLabs returned 401 `quota_exceeded` while generating lesson 8, so no
         TTS was attempted for this lesson. No audio, no timing.json, no compositions, no READY.json.
         `narration.json` is final; run `node src/scene-tts.js hyperframes/lesson-09-evaluating-rag` once when
         credits are back, then time every reveal below to its word (scene start = first line's start in
         timing.json) and set every duration in index.html from timing.json. Copy the scene structure, helpers
         (blurIn / blurOut) and look from `../lesson-07-chunking/compositions/`.

GOAL:    the viewer can say "hit rate tells me if the evidence arrived, faithfulness tells me if the answer stuck to
         it, and a golden set gives me both numbers".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    about 80 s (see narration.json: 10 lines, 6 scenes). Narration is the clock.
LOOK:    the BeyondPlaced site, same as lessons 1 and 7. Ground Mist #F0FDFA (white cards); ink #0B1220; structure
         Deep Teal #0F766E, tints #CCFBF1 / #99F6E4 / #5EEAD4; accent Coral #EA580C (text #C2410C, tint #FFEDD5) only
         on the struck-out demo, the unanswerable golden row and the failing number in the diagnosis. Display Inter
         900 at 64–128 px, labels Inter 700 at 30–44 px, JSON and metrics JetBrains Mono 700 at 32–56 px (nothing
         under 28 px).
OBJECTS: the phone chat from lesson 7; a large interviewer speech bubble; a dark `golden.json` card with rows
         (question, reference, page); four retrieved slots [1]–[4] with page tags; a 4 x 5 grid of result dots; a
         dark "judge" block; a verdict card `{"faithful": true}`; two horizontal meters (hit rate@4, faithfulness);
         a README log table.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.9 s; exits power3.in 0.2–0.25 s;
         words blur 6 px → 0 in 0.12–0.2 s; list stagger 40–150 ms. Counters via onUpdate, never tl.call.
SHOTS:   ask (l01–l02): phone demo at left on "demos"; speech bubble "How do you know it works?" on its words;
         three ticked demo questions appear and are struck through in coral on "not an answer"; "test set +
         numbers" on "a small test set and a few numbers" →
         golden (l03–l04): `golden.json` card; rows land on "Twenty to thirty questions"; columns "reference" and
         "page" light up on their words; a coral row "What is the hostel wifi password?" → "NOT_IN_DOCUMENT" on
         "cannot answer", expected reply "I don't know" on its words →
         hit (l05): one golden question with expected page 4; slots [1]–[4] fill with pages 7, 4, 2, 9 on "top four
         chunks", the page-4 slot matches (teal ring) on "right page"; then a 20-dot grid fills 17 and the readout
         "hit rate@4 = 17 / 20 = 0.85 (illustrative)" lands on "hit rate at four" →
         judge (l06): context card and answer card slide into the dark judge block on "second model acts as
         judge"; each claim in the answer links to a line in the context on "every claim supported"; verdict card
         and "faithfulness = 0.90 (illustrative)" on "faithfulness" →
         diagnose (l07–l08): two meters. Case 1 on "Low hit rate": hit-rate meter short and coral, arrow "fix
         retrieval: chunking, k, query". Case 2 on "High hit rate but low faithfulness": hit-rate meter long and
         teal, faithfulness short and coral, arrow "fix the prompt". Then a README log with three runs
         (illustrative) growing one row per change on "Change one thing at a time … README" →
         claim (l09–l10): "It seems fine" struck through, "Show the numbers." large; then the next card
         "Next module · Agents & Tool Calling" with the BeyondPlaced mark.
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row; KPI
         grids; everything centred; every element fading and sliding up; titles moving after they land; docked
         logo; on-screen text repeating the narration word for word (except quoted JSON and the final claim).
QA:      one frame per reveal group in every scene; check the dot grid count (17 of 20) matches the readout.
NUMBERS: "20–30 questions", "top four", hit rate@4 and faithfulness come from the lesson text and narration; every
         score, page number and log row is illustrative and must be labelled so. One data object should drive the
         grid and the readout so they agree.
AFTER:   locked `check` to 0 errors, one or two locked snapshot runs, then READY.json
         `{ "slug": "evaluating-rag", "free": false, "posterAt": <s> }` and a first `video` block in
         `src/lib/modules/m3.ts`: `supabase:evaluating-rag/evaluating-rag.mp4|.jpg|.vtt`, title
         "Evaluating RAG, in N seconds".
