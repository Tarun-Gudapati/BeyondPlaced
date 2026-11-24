# SPEC — Lesson 4: Embeddings: meaning as numbers (storyline A)

GOAL:    the viewer can say "an embedding turns text into a point; close points mean similar meaning".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    ~85.1 s x 30 = ~2553 frames. Narration is the clock (timing.json from ElevenLabs word timestamps);
         `node timing-tool.mjs build` writes index.html and each scene's word-time table (T) from it.
LOOK:    the BeyondPlaced site, same as lesson 1. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220; structure
         Deep Teal #0F766E, tints #CCFBF1 / #99F6E4 / #5EEAD4; accent Coral #EA580C only on "0 results", the lone
         number, Riya's query point and "≠". Display Inter 900 at 88–120 px (-2% tracking), titles Inter 700 at
         44–64 px, labels Inter 700 at 28–36 px; text-as-data and numbers JetBrains Mono 700 at 30–60 px.
         Medium: the product's own UI (a notice-board window, text tiles, number tiles, a dotted map).
         Card shadow 0 24 48 rgba(11,18,32,0.16); no grain, no vignette.
OBJECTS: a notice-board window (teal title bar, search box with a 4 px teal outline, notice rows); phrase tiles
         (6 px radius, teal tint, mono); a dark "Embedding model" block; a row of number tiles under a bracket;
         a white map card with a dotted grid; 36 px round points with mono labels; dashed cluster outlines.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.6 s; exits power3.in, 40–50% shorter;
         words blur 6 px → 0 in 0.15 s, 60–120 ms apart; list stagger 50–80 ms.
SHOTS:   search 0–15.8 (query typed on "placement drive", coral "0 results" on "Zero", the notice lights up on
         "campus"; the two phrases as tiles, "0 shared words" on "no", "Match meaning, not letters") →
         vector 15.8–32.8 (tile → model on "Give it", number row on "fixed-length", bracket and 1536 on "fifteen",
         one coral number on "single", all teal on "Together", row collapses into a point on "one point", the map
         grows around it on "space") → space 32.8–57.9 (same point, "campus recruitment" lands beside it, biryani
         far away, training pairs on "trained", cluster outlines on "close points", query ring on "nearest", the
         found notice, then RAG and resume ↔ job description) → rules 57.9–71.9 (two maps, same text in two
         places, "≠"; then love / hate DSA land together) → claim 71.9–85.1 ("Meaning becomes a position." /
         "Close together = similar meaning.", next-lesson card with the BeyondPlaced mark).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final one-line claim).
QA:      frames at 3, 7, 12, 15, 21, 25, 29, 32, 38, 43, 46, 52, 56, 62, 70, 76, 83.
NUMBERS: the number tiles, the 2D positions and the map are illustrative and labelled so; "1536" and "384" are
         the lesson's own figures for text-embedding-3-small and all-MiniLM-L6-v2.
