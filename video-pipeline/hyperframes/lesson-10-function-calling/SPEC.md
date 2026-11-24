# SPEC — Lesson 10: Function calling (storyline A)

GOAL:    the viewer can say "the model only asks for a function; my code runs it and sends the result back".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    80.07 s x 30 = ~2402 frames. Narration is the clock (timing.json from ElevenLabs word timestamps).
LOOK:    the BeyondPlaced site, same as lesson 1. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220; structure
         Deep Teal #0F766E, tints #CCFBF1 / #99F6E4; accent Coral #EA580C on one item per scene: the struck guess
         (ask), the menu outline (tools), "request" (call), the error result (run), the description (answer),
         "executes." (claim). Display Inter 900 at 120–136 px (-2% tracking), titles Inter 700 at 56–88 px, labels
         Inter 700 at 28–36 px; code and JSON JetBrains Mono 700 at 30–44 px. Medium: the product's own UI (a phone
         chat, request and reply cards, a code panel). Card shadow 0 24 48 rgba(11,18,32,0.16); no grain, no vignette.
OBJECTS: a phone with a chat (16 px ink bezel, 68 px radius); a dark "LLM" block; a database cylinder (teal outline,
         three bands); a request card holding the question and the tool menu; a reply card with the tool call as
         JSON; a "Your code" panel with three mono steps; a messages stack with user / assistant / tool rows.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.6 s; exits power3.in, 40–50% shorter;
         words blur 6 px → 0 in 0.15 s; list stagger 50–80 ms.
SHOTS:   ask 0–12.8 (question typed on "what is my CGPA", LLM on "language model", database and blocked link on
         "can't open", guessed reply struck on "guess") → tools 12.8–25.2 (request card on "sends", menu on "menu",
         rows lit on "name", "description", "arguments"; Python card marked not sent on "never sees", coral menu
         outline on "only this menu") → call 25.2–38.1 (content: None on "doesn't answer", tool call rows on "tool
         call", "get student", "arguments"; not-run chips on "nothing has run", "A request, not an action" on "only
         asked") → run 38.1–56.7 (steps lit on "parses", "checks", "runs", row returns on "database"; coral error
         result on "clear error", traceback struck on "not a crash"; messages stack with tool row on "tool message",
         second call on "second time") → answer 56.7–69.6 (result chip into LLM on "facts", answer typed on "your
         CGPA is eight point four", 1 question / 2 API calls, coral description on "description") → claim 69.6–80.1
         ("The model proposes." / "Your code executes.", next-lesson card with the BeyondPlaced mark).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final one-line claim).
QA:      frames at 4.5, 11.5, 20, 24, 31, 37, 43, 49, 55, 61, 68, 78.
NUMBERS: the student record (Ananya Rao, 21CS045, CGPA 8.4) and the guessed 8.9 are the lesson's made-up sample data.
