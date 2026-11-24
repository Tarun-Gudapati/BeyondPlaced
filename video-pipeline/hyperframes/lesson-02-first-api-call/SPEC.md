# SPEC — Lesson 2: Your first LLM API call in Python (storyline A)

GOAL:    the viewer can say "an API call is one HTTPS request: messages go out with my key, text and a token count
         come back, and the key lives in .env, never in the code".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    90.21 s x 30 = ~2706 frames. Narration is the clock (timing.json from ElevenLabs word timestamps). No music.
LOOK:    the BeyondPlaced site, same as lesson 1. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220; structure
         Deep Teal #0F766E, tints #CCFBF1 / #99F6E4 / #5EEAD4; secondary text #475569. Accent Coral #EA580C on one
         item per scene: the API call (editor), the key value (setup), the Authorization header (request), the billed
         total (response), "none" (resend), the leaked key and its strike (key), "never" (claim).
         Display Inter 900 at 104–120 px (-2% to -3% tracking), titles Inter 700 at 56–88 px, labels Inter 700 at
         28–36 px; code JetBrains Mono 700 at 28–64 px. Medium: the developer's own screen (an editor window, a
         terminal, file cards, a request card). Card shadow 0 24 48 rgba(11,18,32,0.16); no grain, no vignette.
OBJECTS: a dark code editor window (24 px radius, three grey dots, file name); a white terminal card with typed
         commands; a project folder with a .venv box that packages drop into; file cards with a mono tab (.env,
         .gitignore); a request card (4 px teal outline) holding a model tile and two message cards; a header strip
         that clips onto the card; an HTTPS wire with an arrowhead; the dark "LLM" block from lesson 1, labelled
         "provider's servers"; a response card with an answer bubble, finish_reason tiles and a usage sum; a
         public-repo commit card.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.6 s; exits power3.in 0.2–0.25 s;
         words blur 6 px -> 0 in 0.15 s; typed commands reveal with a stepped clip; wipes for cards that "open".
SHOTS:   editor 0–13.3 (script on screen at frame 0, lines light up on "one short Python script", the call is boxed
         in coral on "API call") -> setup 13.3–24.9 (venv command typed on "virtual", folder and .venv on
         "environment", other projects on "never break", pip typed and packages drop on "installs", .env card on
         "file", key on "API key") -> request 24.9–44.8 (empty card and LLM block, wire on "HTTPS", model tile on
         "model name", system card on "system", its text on "you are a patient DSA tutor", user card on "user",
         header strip on "key", the packed card travels into the block on "provider") -> response 44.8–58.1 (card
         comes back on "Back", answer on "answer", fields on "finish reason" / "usage", tiles on "Stop" / "Length",
         numbers on "Usage counts", coral total on "billed") -> resend 58.1–64.2 (fourth row on "follow-up", bracket
         and arrow on "sends the whole list", "memory: none" on "remembers nothing") -> key 64.2–79.0 ("The key is
         a password" word by word, .env on "dot env", .gitignore on "git ignore", public commit on "leaks",
         "commit deleted" then "still in git history" on "not enough", strike + "revoked" on "Revoke", new key on
         "create a new one") -> claim 79.0–90.2 (three lines, next-lesson card with the BeyondPlaced mark).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final claim); real-looking API keys.
QA:      frames at 3, 9, 12, 16, 20, 24, 30, 36, 42, 44, 48, 56, 61, 68, 71, 77, 84, 89.
NUMBERS: the usage numbers (31 + 142 = 173) are illustrative and labelled so. Everything else comes from the lesson
         text in src/lib/modules/m1.ts.
