# SPEC — Lesson 11: Building an agent loop from scratch (storyline A)

GOAL:    the viewer can say "an agent is a model, tools and a loop: think, act, observe, with a step limit".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    80.41 s x 30 = ~2412 frames. Narration is the clock (timing.json from ElevenLabs word timestamps).
LOOK:    the BeyondPlaced site, same as lesson 1. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220; structure
         Deep Teal #0F766E, tints #CCFBF1 / #99F6E4; accent Coral #EA580C on one item per scene: the "in one go"
         strike (task), the growing message list (loop), MAX_STEPS (stop), the error observation (error), the
         trimmed tool result (memory), "stops." (claim). Display Inter 900 at 96–124 px (-2% tracking), titles
         Inter 700 at 44–84 px, labels Inter 700 at 30–36 px; code and logs JetBrains Mono 700 at 28–80 px.
         Medium: the product's own UI (resume sheets, a loop ring, a message list, a step log, a token bar).
         Card shadow 0 24 48 rgba(11,18,32,0.16); no grain, no vignette.
OBJECTS: three resume sheets (white paper, file name, grey text lines, a score badge); a loop ring (8 px teal
         stroke) with three stations THINK / ACT / OBSERVE and a carrier dot that travels round it; a messages card
         whose rows are added lap by lap; a step log of repeated calls; a token bar with a budget marker; a
         try/except code card; three growing request stacks.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.4–0.9 s; exits power3.in, 40–50% shorter;
         words blur 6 px → 0 in 0.15 s; the carrier dot laps on power2.inOut.
SHOTS:   task 0–11.6 (goal on "shortlist", "in one go?" struck on "one breath", steps on "read one", "note a
         score", "read the next", rail on "each step depends") → loop 11.6–33.1 (ring draws on "inside a loop",
         stations on "Think", "Act", "Observe", rows added on "picks a tool" and "joins the conversation", three
         laps on "list", "read", "save", coral outline on "message list grows") → stop 33.1–52.7 (reply with
         tool_calls None, "Final answer" and return on "loop ends"; repeated log lines on "repeat the same call",
         token bar on "costs tokens", MAX_STEPS on "max steps", rule on "hard stop"; budget marker on "token
         budget") → error 52.7–60.2 (failed call, try/except on "don't crash", coral error row on "error back",
         corrected call on "corrects itself") → memory 60.2–68.5 (message bars, "Short-term memory" on "only
         memory", growing turns on "resends all of it", coral trim on "keep tool results short") → claim 68.5–80.4
         ("Agent = model + tools + a loop that stops.", next-lesson card with the BeyondPlaced mark).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; everything centred; every
         element fading and sliding up; titles moving after they land; docked logo; on-screen text repeating the
         narration word for word (except the final one-line claim).
QA:      frames at 3.8, 10, 15.5, 24, 31.5, 38, 46, 51.5, 58.5, 67, 73, 79.
NUMBERS: the resumes, the 8/10 score and MAX_STEPS = 8 are sample values; text[:3000] is the lesson's own
         MAX_OBSERVATION_CHARS.
