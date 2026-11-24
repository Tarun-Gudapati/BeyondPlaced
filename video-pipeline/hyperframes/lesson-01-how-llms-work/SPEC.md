# SPEC — Lesson 1: How LLMs actually work (storyline A)

GOAL:    the viewer can say "an LLM predicts one token at a time and remembers nothing; the app resends the chat".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    ~100.4 s x 30 = ~3013 frames. Narration is the clock (timing.json from ElevenLabs word timestamps).
LOOK:    the BeyondPlaced site. Ground Mist #F0FDFA (white #FFFFFF cards); ink #0B1220; structure Deep Teal #0F766E,
         tints #CCFBF1 / #99F6E4; accent Coral #EA580C only on the picked token, "stateless", the strike-through and "≠".
         Display Inter 900 at 120 px (-2% tracking), titles Inter 700 at 56–88 px, labels Inter 700 at 28–36 px;
         tokens and code JetBrains Mono 700 at 40–76 px. Medium: the product's own UI (a phone chat, token tiles,
         probability bars). Card shadow 0 24 48 rgba(11,18,32,0.16); no grain, no vignette.
OBJECTS: a phone with a chat (16 px ink bezel, 68 px radius); token tiles (6 px radius, teal tint, mono); a dark
         "LLM" block; horizontal probability bars with % labels; a temperature slider with a round handle;
         a request card that holds the whole conversation; a context-window frame (4 px teal outline).
MOTION:  arrivals expo.out / power4.out 0.15–0.6 s; moves power2.inOut 0.5–0.6 s; exits power3.in, 40–50% shorter;
         words blur 6 px → 0 in 0.15 s, 60–120 ms apart; list stagger 50–80 ms.
SHOTS:   chat 0–15.4 (question typed on "is", reply word by word from "The", "next token" on "predict"; carry the
         question out as a mono sentence) → tokens 15.4–30.1 (sentence splits on "cut", Bengaluru lifts on its word,
         counter on "pay", frame draws on "context window", overflow tiles on "fit at once"; blur swap) → predict
         30.1–49.0 (tiles flow into LLM on "reads", bars on "probability", coral pick on "picks", append on "adds",
         loop arrow on "back in", fast appends on "again", three words on "chat, coding, reasoning") → temperature
         49.0–64.0 (handle to 0 on "zero", same answers; handle to 0.7, marker to "It" on "win", ≠ on "two") →
         memory 64.0–80.2 (follow-up typed, "there" linked to Bengaluru, "How?"; request card assembles on
         "whole conversation", enters LLM on "context window", growing requests on "every single time") →
         plausible 80.2–87.0 (confident wrong sentence, strike on "wrong", correction) → claim 87.0–100.4
         ("An LLM is stateless." / "Memory is the app's job.", next-lesson card with the BeyondPlaced mark).
BANNED:  dark void ground; glow, particles; purple/blue gradients, glass; pill chips; three cards in a row;
         everything centred; every element fading and sliding up; titles moving after they land; docked logo;
         on-screen text repeating the narration word for word (except the final one-line claim).
QA:      frames at 4, 7.5, 14, 19, 26, 29, 35, 40, 46, 54, 62, 70, 77, 85, 92, 99.
NUMBERS: probabilities and tokenisation are illustrative and labelled so; "e.g. 128k tokens" and "≈3–4 characters"
         come from the lesson text.
