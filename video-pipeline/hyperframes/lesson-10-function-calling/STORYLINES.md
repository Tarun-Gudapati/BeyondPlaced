# Lesson 10 — Function calling: storylines

Source: `src/lib/modules/m4.ts` lesson `function-calling`. Every claim below comes from that lesson. The student
record (Ananya Rao, 21CS045, CGPA 8.4) is the lesson's own made-up example and is shown as sample data.

**The one idea:** the model never runs your function; it asks for it, and your code runs it and sends the result back.
**Remembered as:** "The model proposes, my code executes."

Assumptions for all three: 1920×1080, 85–100 s, ElevenLabs narration (same voice as lesson 1), no music.

---

## A. One question, one round trip (picked — the lesson's own worked example travels through all four steps)

- **Device / form:** a moment in a student's day + the worked example; one frame that rebuilds.
- **What you see and feel:** Ananya asks the placement bot for her CGPA. The model can only guess, so the frame
  rebuilds into the handshake: a menu of tools goes out, a tool call comes back as JSON, the app runs the Python
  function against the database, the result returns as a tool message and the real answer lands in the chat.
- **First 2 seconds:** a phone chat with "What is my CGPA?" already sent, the model block beside it and a database
  it cannot reach.
- **Beats:** question → model would guess (struck through) → the tool menu: name, description, arguments → the
  tool call as JSON → "nothing has run yet" → your code parses, checks, runs → wrong roll number becomes a clear
  error → result appended as a tool message, second call → the real answer → two API calls, description did the
  choosing → "The model proposes. Your code executes."
- **Look:** the BeyondPlaced site: mist ground, ink text, teal structure, coral only on the one key item per scene;
  Inter for words, JetBrains Mono for code and JSON.
- **Sound:** warm narration only.

## B. The intern with no logins

- **Device / form:** a character does the work; object-to-object chain.
- **What you see and feel:** a new intern at a Bengaluru startup has no database access, so they pass a paper note
  through a hatch: "look up 21CS045". A colleague runs the query and passes the answer back. The note then turns
  into a JSON tool call and the hatch into the API.
- **First 2 seconds:** a hand sliding a sticky note through a slot in a wall.
- **Beats:** note out → colleague checks it → query runs → note back → the same scene redrawn as model, app, tool.
- **Look:** flat office illustration in teal and mist, coral on the note.
- **Sound:** narration, paper slide and a keyboard tick.

## C. The message list that grows (the bold one)

- **Device / form:** the object is the explanation; one continuous take.
- **What you see and feel:** the whole film is the `messages` list. It starts with one user row, and the camera
  rides down it as an assistant tool-call row, a tool row and a final assistant row are added, each one lighting
  the code line that produced it.
- **First 2 seconds:** a single row `{"role": "user", "content": "What is my CGPA?"}` filling the frame.
- **Beats:** user row → tools sent → assistant row with tool_calls → tool row with tool_call_id → final row.
- **Look:** editor-like white card on mist, mono type throughout, coral on the newest row.
- **Sound:** narration with a soft key tick per row.
