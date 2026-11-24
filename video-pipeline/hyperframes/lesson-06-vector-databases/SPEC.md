# SPEC — Lesson 6: Vector databases: Chroma and pgvector (storyline A)

STATUS:  scenes built and checked against PROVISIONAL timing (estimated word times). The narration audio does not
         exist yet: ElevenLabs returned quota_exceeded before the first line. See NEEDS_AUDIO.md for the three
         commands that finish this project. There is no READY.json on purpose.

GOAL:    the viewer can say "a vector database stores vectors with metadata, and its index finds near neighbours
         without checking everything".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    ~87 s x 30 = ~2610 frames (estimate; the real length comes from the narration). Narration is the clock:
         every reveal is written as "line, word index" (T.l05.w[6]) and `node timing-tool.mjs build` fills in the
         times from timing.json, so the scenes re-time themselves when the real audio arrives.
LOOK:    the BeyondPlaced site, same as lessons 1, 4 and 5. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220;
         structure Deep Teal #0F766E, tints #CCFBF1 / #99F6E4 / #5EEAD4; accent Coral #EA580C only on the query
         point, "≈", the matching row and the vector column. Display Inter 900 at 84–128 px (-3% tracking), titles
         Inter 700 at 36–48 px, labels Inter 700 at 28–36 px; ids, vectors, code and SQL JetBrains Mono 700 at
         28–200 px. Medium: the product's own UI (a plot of points, a graph, a record card, result rows, a code
         card, a database table). Card shadow 0 24 48 rgba(11,18,32,0.16); no grain, no vignette.
OBJECTS: a white plot card; 40 px document points and a coral query point; a wall of small points; a scan bar;
         a graph of 16 hollow nodes and grey links with a thick teal route; a record card with key/value rows and
         metadata tiles; result rows with subject and year; a dark filter strip; a dark code card; a folder;
         a table with a ringed vector column.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.35–1.6 s; exits power3.in, 40–50% shorter;
         words blur 6 px → 0 in 0.15 s; list stagger 40–160 ms; route links draw in 0.35 s each.
SHOTS:   scale (l01–l03: five comparison lines on "compares", "5"; the wall of points wipes in on "add",
         "millions", a scan bar on "every single search"; points fade on "gone") → graph (l04–l06: "an index",
         links on "linked"; query on "search", start on "one point", four hops on "hops … query", "4 hops",
         unvisited points dim on "Most"; then "≈ approximate" with two bars) → meta (l07–l09: record card fills row
         by row, metadata tiles on "subject, year, page"; result rows, filter strip on "filter", rows dim on "DSA"
         and "twenty-two", query and coral match on "search … meaning"; source line on "source") → tools
         (l10–l11: Chroma code lines and the folder; then the Postgres table, the vector column on "vectors", SQL)
         → claim (l12–l13: "Embed once. Store with metadata." / "Let the index find the neighbours.", next card).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final one-line claim).
QA:      frames at 3, 7, 12, 15, 19, 24, 30, 34, 37, 42, 47, 51, 56, 61, 66, 68, 72, 74, 80, 86 (provisional
         timing); re-take after the real narration is in.
NUMBERS: the 16-point graph, its 4 hops, the two bars, the vector values and the example questions are
         illustrative and labelled so; the greedy route was verified by script when the scene was generated.
         "1536" is the lesson's figure for text-embedding-3-small. No speeds, sizes or prices are stated.
