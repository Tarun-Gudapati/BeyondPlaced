# SPEC — Lesson 7: Chunking documents the right way (storyline A)

GOAL:    the viewer can say "the model only sees retrieved chunks; start at 500 tokens with 50 overlap, then measure".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    84.81 s x 30 = ~2544 frames. Narration is the clock (timing.json from ElevenLabs word timestamps).
LOOK:    the BeyondPlaced site, same as lesson 1. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220; structure
         Deep Teal #0F766E, tints #CCFBF1 / #99F6E4 / #5EEAD4; accent Coral #EA580C (tint #FFEDD5) only on Riya's answer
         sentence, the cut that threatens it, "it?" and the kept strategy. Display Inter 900 at 64–120 px (-2% tracking),
         labels Inter 700 at 30–44 px; document text JetBrains Mono 700 at 34–52 px. Medium: the product's own UI
         (a phone chat, a policy page, chunk cards). Card shadow 0 24 48 rgba(11,18,32,0.12–0.16); no grain, no vignette.
OBJECTS: a phone with a chat (16 px ink bezel, 68 px radius); a policy page (white card, grey text bars, one mono
         sentence on a coral tint); a dark "LLM" block; chunk cards (3 px outline, 18–20 px radius); a coral cut line;
         a dashed teal overlap band; a teal "ID card" tag; rows of result dots.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.9 s; exits power3.in 0.2–0.25 s;
         words blur 6 px → 0 in 0.12–0.2 s; list stagger 40–150 ms.
SHOTS:   ask 0–18.3 (question typed on "how many…", page 4 slides in on "The answer", coral sentence on "one sentence";
         phone leaves, LLM on "model", page dims on "never", three chunks fly out on "only sees", headline on "cut") →
         size 18.3–32.2 (one wide chunk fills with six topics on "mixes many topics", greys on "filler"; twelve tiny
         chunks on "small", the fragment typed on "It must be cleared…", coral question on "What is it?") →
         cut 32.2–40.7 (two ~500-token brackets on "five hundred", coral line on "fixed cut", halves part on "slice",
         "half an answer" twice on "neither") → overlap 40.7–55.7 (chunk 2's start slides back on "Repeat", label on
         "fifty", band on "end of one chunk", coral ring on "survives whole"; sentence cuts on "split on … sentences",
         mid-word cut removed on "not character counts") → meta 55.7–70.8 (ID card docks on "ID card", source on
         "file name", page on "page number", cited answer on "citation"; three strategies, dots on "same questions",
         coral keep on "keep the one") → claim 70.8–84.8 ("Bad chunking ruins good models.", the starting numbers,
         next-lesson card with the BeyondPlaced mark).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the quoted chunk text and the final claim).
QA:      frames at 4, 8, 14, 17, 21, 24, 31, 34, 39, 44, 49, 54, 60, 67, 74, 83.
NUMBERS: "~500 tokens", "~50 tokens" and "page 4 of 40" come from the lesson text and narration; the policy
         sentences, the six topics and the 2/5, 4/5, 3/5 comparison are illustrative and labelled so.
