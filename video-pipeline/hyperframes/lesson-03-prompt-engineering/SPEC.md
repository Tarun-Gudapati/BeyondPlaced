# SPEC — Lesson 3: Prompt engineering that survives production (storyline A)

GOAL:    the viewer can say "a prompt is a specification (role, task, constraints, output format, examples), and I
         validate the reply before my code trusts it".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    88.96 s x 30 = ~2669 frames: 85.36 s of narration (timing.json from ElevenLabs word timestamps) plus a
         3.6 s silent hold on the next-lesson card. No music.
         The spoken "Next lesson" line (l14) was not generated: the ElevenLabs quota ran out. The card is shown
         without voice. To add it later, append the line to narration.json, rerun scene-tts.js and retime claim.html.
LOOK:    the BeyondPlaced site, same as lessons 1 and 2. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220;
         structure Deep Teal #0F766E, tints #CCFBF1 / #99F6E4 / #5EEAD4; secondary text #475569. Accent Coral
         #EA580C on one item per scene: the crash (vague), "Never guess." (spec), the injected line (data), the
         copied answer (fewshot), "twelve" and its rejection (validate), the failing test (tests), "validate" (claim).
         Display Inter 900 at 104–120 px (-3% tracking), titles Inter 700 at 44–88 px, labels Inter 700 at 28–36 px;
         code JetBrains Mono 700 at 28–40 px. Medium: the developer's own screen (prompt cards, a specification
         sheet, message cards, JSON, a schema, a test list). Card shadow 0 24 48 rgba(11,18,32,0.16); no grain.
OBJECTS: a prompt card holding a pasted job description and a one-line ask; a reply card of prose; a dark code
         strip and an error strip; a specification sheet (4 px teal outline, mono tags in a left column) that grows
         row by row; system and user message cards with <jd> tags; example rows of input -> JSON; a reply card and
         a dark schema card joined by an arrow; a rejection strip and a retry arrow; a prompts file and a test list.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.4–0.6 s; exits power3.in 0.2–0.25 s;
         words blur 6 px -> 0 in 0.15 s; typed code reveals with a stepped clip; cards that "open" wipe.
SHOTS:   vague 0–12.0 (prompt card at frame 0, JD drops in on "pastes", ask typed on "tell me about this job",
         prose reply wipes in on "paragraph", json.loads strip on "program", coral error on "so prose is a bug") ->
         spec 12.0–37.2 (three reworded asks struck through on "wording", sheet opens on "specification", role +
         task row on "role"/"task", constraints row on "constraints" with "use null" and coral "Never guess.",
         output row on "output" with the JSON shape line by line) -> data 37.2–49.5 (system card with three rule
         tiles on "system prompt", user card with the JD on "user message", <jd> tags on "wrapped in tags",
         injected line on "ignore your instructions" in coral, "treated as data" on "less likely") -> fewshot
         49.5–56.9 (example 1 and 2 as input -> JSON rows on "one or two examples", "few-shot prompting" tag, new
         JD row whose answer types in on "copies the pattern") -> validate 56.9–72.5 (JSON-mode strip on "JSON
         mode", reply on "reply parses", "right values?" on "wrong", coral on "twelve" on "as a word", schema card
         on "schema", rejection on "fails", retry arrow on "send the error back", reply 2 passes on "once more") ->
         tests 72.5–79.6 (prompts.py with V1 on "prompts", V2 on "versions", test list on "rerun", FAIL flips to
         PASS on "after every change") -> claim 79.6–89.0 (two lines, next-lesson card with the BeyondPlaced mark,
         silent hold).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final claim).
QA:      frames at 2, 7, 11, 13.5, 21, 29, 35, 40, 47, 52, 56, 60, 65, 71, 76, 78.5, 83, 88.
NUMBERS: the job descriptions, CTC values and test results are made-up examples from the lesson's own code
         (extract_job and its test cases). Nothing on screen is a statistic.
