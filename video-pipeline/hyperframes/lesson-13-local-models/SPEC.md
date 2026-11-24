# SPEC — Lesson 13: Running Llama & Qwen locally with Ollama (storyline A)

GOAL:    the viewer can say "an open model runs on my laptop behind the same API: same SDK, different base_url".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    ~86.2 s x 30 = ~2585 frames. Narration is the clock (timing.json from ElevenLabs word timestamps).
LOOK:    the BeyondPlaced site, as in lesson 1. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220; structure
         Deep Teal #0F766E, tints #CCFBF1 / #99F6E4; accent Coral #EA580C on one item per scene only: the empty
         credit meter, the two changed values in the code, "4 bits", "your own questions", base_url.
         Display Inter 900 at 84–136 px (-2% tracking), labels Inter 700 at 28–36 px; code, model names and
         commands JetBrains Mono 700 at 30–36 px. Medium: the student's own tools (a laptop, a terminal, a code
         file, a RAM bar). Card shadow 0 24 48 rgba(11,18,32,0.16); no grain, no vignette.
OBJECTS: a laptop (14 px ink bezel, 28 px radius, ink base bar) running a chat; the dark "LLM" block from
         lesson 1; a hosted-API card; a draining credit meter; the Ollama server box inside a laptop frame with a
         dashed "disk" bay, a solid "memory (RAM)" bay and model-weight tiles; a dark terminal; a code card with
         two swappable values; a two-position provider switch; a row of 16 bit cells; RAM bars with blocks.
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.75 s; exits power3.in 0.2–0.25 s;
         words blur 6 px → 0 in 0.15–0.2 s; list stagger 30–90 ms.
SHOTS:   credits 0–12.2 (chat answers on "works", meter drains to 0 on "run out", coral ✕ and 429 bubble; hosted
         card leaves, LLM block travels into the laptop on "runs on his own laptop") → server 12.2–29.8 (laptop
         frame, Ollama box on its name, tiles drop into disk on "Llama"/"Qwen", one tile moves to RAM on "loads",
         API badge on "API"/"localhost"; terminal: pull, progress, run, chat on l05) → swap 29.8–47.8 (code card
         from the start; Ollama card, "= same format", OpenAI card; base_url value swaps on "base URL", model on
         "model name", teal ticks on unchanged lines; provider switch flips on "flip", values swap back) → fit
         47.8–63.5 (16 bit cells on "every weight", 12 leave on "four", count 16 → 4 bits; 8 GB bar with a 3B block
         on "fits", 16 GB bar with an 8B block on "bigger") → trade 63.5–76.0 (three gains beside a laptop with
         Wi-Fi struck and a dashed boundary; then one question to a small local block answering slowly and a big
         hosted block answering fast) → claim 76.0–86.2 ("Same SDK, different base_url", next-lesson card).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final one-line claim).
QA:      frames at 3, 7, 11, 17, 23, 28, 33, 38, 45, 52, 56, 61, 66, 73, 79, 84.
NUMBERS: "roughly 2 GB", "16 → 4 bits", "about ¼ of the memory", 8 GB → 3B and 16 GB → 7B–8B come from the lesson
         text. Block widths in the RAM bars and the streaming speeds in the trade scene are illustrative and
         labelled so. The 429 "quota exceeded" bubble is the hosted API's own error wording, shortened.
