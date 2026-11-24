# SPEC — Lesson 5: Cosine similarity from scratch with NumPy (storyline A)

GOAL:    the viewer can say "cosine similarity is the angle between two vectors; normalise once and vector search
         is a dot product and a sort".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    ~89.4 s x 30 = ~2682 frames. Narration is the clock (timing.json from ElevenLabs word timestamps);
         `node timing-tool.mjs build` writes index.html and each scene's word-time table (T) from it.
LOOK:    the BeyondPlaced site, same as lessons 1 and 4. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220;
         structure Deep Teal #0F766E, tints #CCFBF1 / #99F6E4 / #5EEAD4; accent Coral #EA580C only on the angle arc,
         the worked answer "1", "a · b" and "≠". Display Inter 900 at 72–104 px (-2% tracking), titles Inter 700 at
         40–64 px, labels Inter 700 at 28–36 px; vectors, formulas, scores and code JetBrains Mono 700 at 30–176 px.
         Medium: the product's own UI (text tiles, answer cards, a dotted plot, a matrix of cells, a code strip).
         Card shadow 0 24 48 rgba(11,18,32,0.16); no grain, no vignette.
OBJECTS: a question tile and a stack of answer cards with number strips; a white plot card with a dotted grid;
         arrows drawn from one origin (8–10 px stroke, solid heads); a coral angle arc; a large score readout;
         a fraction; a dashed unit circle; a matrix of tinted cells with a query column and a score column;
         a dark code strip.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.9 s; exits power3.in, 40–50% shorter;
         words blur 6 px → 0 in 0.15 s; list stagger 50–80 ms. The sweeping arrow and its readout are computed
         from scene time, so any frame can be rendered on its own.
SHOTS:   arrows 0–17.6 (question tile, answer stack on "fifty", number strips on "a vector"; then two arrows from
         one origin, the coral arc on "angle", the answer arrow changes length on "how long" while the arc holds) →
         angle 17.6–30.5 (arrow b sweeps to 0°, 90°, 180°, then 45°; the readout shows 1.00, 0.00, −1.00, 0.71) →
         formula 30.5–44.3 (fraction builds on "dot product" / "divided" / "lengths"; [3, 4] and [6, 8] worked to
         50 / (5 × 10) = 1, two arrows on one line) → unit 44.3–52.3 (arrows land on the unit circle on "length
         one"; the denominator becomes 1 × 1; "cos = a · b") → rank 52.3–77.2 (rows × query = scores on "multiply",
         rows reorder on "Sort", top 3, "embedded once" / "new each time", "0.82 ≠ 82% correct") →
         claim 77.2–89.4 ("A dot product and a sort." / "Everything after that is speed.", next-lesson card).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final one-line claim).
QA:      frames at 3, 9, 14, 17, 19, 21, 24, 28, 34, 39, 43, 48, 51, 56, 59, 63, 68, 76, 82, 88.
NUMBERS: [3, 4] · [6, 8] = 50, lengths 5 and 10, score 1, and 0.71 at 45° are exact and from the lesson. The number
         strips, the matrix shading and the six scores in the ranking are illustrative and labelled so; "384" is
         the lesson's figure for all-MiniLM-L6-v2.
