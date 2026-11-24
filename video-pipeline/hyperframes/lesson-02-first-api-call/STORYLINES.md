# Lesson 2 — Your first LLM API call in Python: storylines

Source: `src/lib/modules/m1.ts`, lesson `first-api-call`. Every claim below comes from that lesson's text. The token
counts shown in the response are example numbers and are labelled "illustrative" on screen.

**The one idea:** an LLM API call is one HTTPS request: a model name and a list of messages go out with your key,
and text plus a usage count come back.
**Remembered as:** "Messages out, text and a token count back, and the key lives in .env, never in the code."

Assumptions for all three: 1920×1080, about 90 s, ElevenLabs narration (same voice as lesson 1), no music (as in
lesson 1), the BeyondPlaced look. Picked without waiting for the user, as the brief for this run asks: **A**.

---

## A. One request, followed down the wire (picked — the lesson's own script is the worked example, and Ananya carries on from lesson 1)

- **Device / form:** the worked example + object-to-object chain. One request is built, sent, answered and sent
  again; each scene ends on the thing that opens the next.
- **What you see and feel:** Ananya, the final-year student from lesson 1, now builds her own DSA tutor. Her short
  script is on screen from the first frame. The camera follows a single request: the project is set up, the
  request card fills with a model name and two messages, the key clips on as a header, the card travels down an
  HTTPS wire into the provider's block, and a response comes back with the answer, a finish reason and a usage
  count. It feels like watching a parcel being packed, posted and answered.
- **First 2 seconds:** a code editor with the whole script already written, the name "Ananya" beside it, and the
  lines lighting up one by one.
- **Beats:** the script (hook) → virtual environment, two installs, the `.env` file → the request: model, system
  message, user message → the key in a header, down the wire to the provider → the response: answer, finish
  reason, usage (what she is billed for) → a follow-up resends the whole list, because the model remembers
  nothing → the key is a password: `.env` + `.gitignore`; a leaked key is revoked, not just deleted → the one
  line, then the next-lesson card.
- **Look:** the site's brand: mist ground, white cards, deep teal structure, coral on one item per scene (the API
  call, the key, the billed total, "memory: none", the leaked key). Inter for words, JetBrains Mono for code.
- **Sound:** warm, unhurried narration; no music.

## B. The key that got out

- **Device / form:** the result first (a bad one), then life before and after; split screen to one.
- **What you see and feel:** it opens on a public commit with an API key in plain sight and a usage meter
  climbing. Rewind. The same project is built again the right way, and at the end the same commit goes out with
  nothing in it to steal. Tense at the start, calm at the end.
- **First 2 seconds:** a commit diff with `api_key = "sk-..."` on a green line and the word "public" beside it.
- **Beats:** the leaked commit → rewind → virtual environment and `.env` → `.gitignore` → the call and its
  response → the same push, key absent → "revoke, do not just delete" → the one line.
- **Look:** white diff cards on mist, coral only on the exposed key, teal on everything done right.
- **Sound:** narration with a single low tick on the rewind.

## C. The envelope (the bold one)

- **Device / form:** the object is the explanation; one continuous take.
- **What you see and feel:** the request is drawn as a real paper envelope on a desk. Two letters go inside (the
  system message and the user message), the model name is written on the front, the key is the wax seal. The
  camera travels with it down a pneumatic tube to a sorting office and back, where the reply is unfolded with a
  receipt stapled to it: the usage. Nothing looks like code until the last shot, where the envelope turns into
  the script.
- **First 2 seconds:** hands-free shot of an envelope being sealed with a coral wax stamp reading "key".
- **Beats:** two letters in → address: model name → seal: the key → the tube (HTTPS) → the reply and its receipt →
  a second envelope holding all the earlier letters → never leave your seal lying around → the script.
- **Look:** mist desk, white paper, teal ink handwriting replaced by Inter labels, coral wax.
- **Sound:** paper and tube sounds under the narration; no music.
