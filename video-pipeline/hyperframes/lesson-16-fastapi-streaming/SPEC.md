# SPEC — Lesson 16: FastAPI backend with streaming responses (storyline A)

GOAL:    the viewer can say "streaming doesn't cut total time or cost; it cuts the wait before the first word".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    ~84.7 s x 30 = ~2542 frames. Narration is the clock (timing.json from ElevenLabs word timestamps).
LOOK:    the BeyondPlaced site, same as lesson 1. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220; structure
         Deep Teal #0F766E, tints #CCFBF1 / #99F6E4 / #5EEAD4; accent Coral #EA580C on one item per scene only:
         the first-token segment and "0.4 s" (race), the yield gate (pipe), the "\n" and the half event (wire),
         the proxy (deploy), "the wait" (claim). Display Inter 900 at 128 px (-2% tracking), titles Inter 700/900 at
         56-96 px, labels Inter 700 at 28-36 px; code and tokens JetBrains Mono 700 at 28-44 px. Medium: the
         product's own UI (chat windows, a time chart, a request diagram, a wire log). Card shadow
         0 24 48 rgba(11,18,32,0.12-0.16); no grain, no vignette.
OBJECTS: two chat windows (white, 28 px radius, header with a "PB" avatar and a mode tag); a two-row time chart on a
         shared 0-6 s axis; a browser card (three header dots, address in mono); the FastAPI card (4 px teal outline,
         two lines of code); the dark "LLM" block from lesson 1; token tiles (6 px radius, teal tint, mono); a dark
         wire log with data: lines and dashed blank-line rows; a buffer box; a proxy card.
MOTION:  arrivals expo.out / power4.out 0.15-0.6 s; moves power2.inOut 0.5-0.6 s; progress bars linear; exits
         power3.in, 40-50% shorter; words blur 6 px -> 0 in 0.15 s; list stagger 50-80 ms.
SHOTS:   race 0-27.1 (window A at 0 with the question sent; waiting dots and the grey bar grow on "watches a
         spinner", whole answer lands at once at 7.3; window B slides in on "Same bot", coral first-word segment on
         "first", words arrive one by one until "last"; dashed finish line on "last word"; "Time to first token
         6 s -> 0.4 s" on its words; blur swap) -> pipe 27.1-41.2 (browser card, POST arrow on "one request",
         FastAPI card on its word, stream=True arrow and LLM block on "calls the model"; return track draws on
         "Every chunk", tiles travel through the coral yield gate on "yielded", land in the browser as words;
         "Each yield is sent immediately" on "leaves") -> wire 41.2-66.4 (dark wire log centred: data: lines on
         "line", blank rows on "blank line", JSON recolours on "JSON", the "\n" token in coral on "newline"; log
         slides left on "In the browser"; read 1 with three events, read 2 with half an event on "half"; the half
         drops into the buffer on "buffer" and is completed; page builds "Check the middle" on "page") -> deploy
         66.4-73.4 (tiles leave FastAPI one by one and pile up inside the coral proxy on "buffers", move to the
         browser together on "one lump"; X-Accel-Buffering: no) -> claim 73.4-84.7 ("Not total time. Not cost." /
         "Streaming cuts the wait" / "before the first word", next-lesson card with the BeyondPlaced mark).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three identical cards in a
         row; everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final claim).
QA:      frames at 3, 6.5, 12.5, 20, 25.5, 30, 33, 37.5, 40, 45, 53, 60, 65, 70, 72, 78, 83.
NUMBERS: "6 s" and "0.4 s" are the lesson's illustrative example and are labelled so on screen. No prices.
