# SPEC — Lesson 12: Guardrails, safety and human-in-the-loop (storyline A) — DRAFT, NOT BUILT

STATUS:  narration.json is written but NO AUDIO exists yet: ElevenLabs returned `quota_exceeded` (24 credits left,
         the first line alone needs 78; the whole script is about 1,150 characters). Nothing below is built, because
         every reveal has to be timed to timing.json. To finish: top up credits, run
         `node src/scene-tts.js hyperframes/lesson-12-guardrails` from `video-pipeline/` (no --force), then build
         the scenes below against timing.json, replace the scaffold index.html, run the locked check and write
         READY.json `{ "slug": "guardrails", "free": false, "posterAt": <s> }`. Then add the video block as the first
         block of the `guardrails` lesson in `src/lib/modules/m4.ts`.

GOAL:    the viewer can say "I assume the model can be tricked, so I limit what a tricked model can do".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    about 80 s (12 lines, ~1,150 characters). Narration is the clock.
LOOK:    the BeyondPlaced site, same as lessons 1, 10 and 11. Ground Mist #F0FDFA (white #FFFFFF cards); ink
         #0B1220; structure Deep Teal #0F766E, tints #CCFBF1 / #99F6E4; accent Coral #EA580C on one item per scene:
         the hidden line (hidden), the injected tokens (inject), the struck send_email (tools), the rejected value
         (validate), the waiting email action (approve), the failing attack row (audit), "tricked" (claim).
         Display Inter 900 at 96–124 px, titles Inter 700 at 44–84 px, labels Inter 700 at 30–36 px; code JetBrains
         Mono 700 at 28–44 px. Card shadow 0 24 48 rgba(11,18,32,0.16); no grain, no vignette.
OBJECTS: a resume sheet (white paper, name, grey text lines, a gap that holds the white-on-white line); a dark
         "LLM" block; a token stream (mono tiles, instructions teal, resume slate, injected coral); two tool cards;
         a validation form with two rejected rows; an approval card with the exact arguments and Approve / Reject
         buttons; a step log and an attacks file.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.6 s; exits power3.in, 40–50% shorter;
         words blur 6 px → 0 in 0.15 s.
SHOTS:   hidden (l01–l02): resume sheet on screen at 0; the hidden line turns from white to coral on "hidden in
         white text"; tiles from the system prompt and the resume merge into one row on "same stream of tokens"
         → inject (l03–l04): the model's output "rank: #1" on "obey"; title "Prompt injection" with "indirect" on its
         word; a prompt sentence with a dashed outline on "not a wall"; "Limit what a fooled model can do" on its
         words → tools (l05): `send_email(to, subject, body)` struck on "not send any email"; `send_shortlist_email(
         filenames)` with `RECRUITER_EMAIL` pinned in a code chip on "fixed in your code" → validate (l06): three
         argument rows; `score: 100` and `filename: "../../secrets.txt"` turn to REJECTED on "one hundred" and
         "unknown file" → approve (l07–l09): two buckets (reads and drafts run; send_shortlist_email waits); an
         approval card with tool + arguments on "exact tool and arguments"; the gate drawn inside the loop ring on
         "lives in your loop" → audit (l10): step-log lines on "log every tool call"; attack rows with ok / FAIL on
         "file of attacks" → claim (l11–l12): the one line, then the next-lesson card ("Running Llama & Qwen
         locally with Ollama") with the BeyondPlaced mark.
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final one-line claim).
QA:      one frame per narration line once timing.json exists.
NUMBERS: the resume, scores and recruiter address are the lesson's made-up sample data.
