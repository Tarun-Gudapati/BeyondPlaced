# Lesson 13 — Running Llama & Qwen locally with Ollama: storylines

Source: `src/lib/modules/m5.ts` lesson `local-models`. Every claim below comes from that lesson. Sizes ("roughly
2 GB", "8 GB laptop → 3B model", "4 bits instead of 16") are the lesson's own rules of thumb; the streaming speeds in
the last scene are illustrative and labelled so.

**The one idea:** an open model can run on your own laptop behind the same API you already use.
**Remembered as:** "Same SDK, different base_url."

Assumptions for all three: 1920×1080, ~90 s, ElevenLabs narration, no music (credits and render time are limited),
BeyondPlaced look from lesson 1.

---

## A. 2 a.m., credits over (picked — one student's real problem carries every idea, and the fix is one line)

- **Device / form:** a moment in a student's day + the worked example; one frame that rebuilds.
- **What you see and feel:** Kabir's hackathon chatbot stops because the free API credits are finished. The model
  block leaves the cloud and lands inside his laptop; the laptop opens up into the Ollama server; his own code
  changes by one line. Relief, then an honest look at what he traded.
- **First 2 seconds:** a laptop running a chatbot, a line to a cloud model, and a "free credits" meter already
  draining towards zero.
- **Beats:** credits hit zero, request refused → the model moves onto the laptop → Ollama: downloads weights, loads
  them into memory, serves localhost:11434 → two commands in a terminal → the code card: only base_url changes →
  provider switch local ⇄ hosted → memory: 16 bits per weight become 4, a 3B model fits in 8 GB → what you get /
  what you give up, same question to both models → the one line.
- **Look:** the site's brand — mist ground, white cards, deep teal structure, coral only on the one changed thing
  per scene (the empty meter, the base_url line, "doesn't fit"), Inter + JetBrains Mono.
- **Sound:** warm narration only.

## B. The model is just a file

- **Device / form:** the object is the explanation; object-to-object chain.
- **What you see and feel:** a single file, `llama3.2:3b`, is followed like a parcel: downloaded, squeezed from 16
  bits to 4, dropped into RAM, plugged into a port, and finally answering a request from ordinary Python code.
- **First 2 seconds:** a file icon labelled "3,000,000,000 numbers" dropping onto a desk.
- **Beats:** the file → quantised to a quarter → loaded into RAM → port 11434 opens → the OpenAI SDK plugs in →
  the one line.
- **Look:** white ground, one teal file tile that keeps its identity through every shot, coral on the port.
- **Sound:** narration with a soft click at each hand-off.

## C. Two laptops, one script (the bold one)

- **Device / form:** split screen to one.
- **What you see and feel:** the same Python file runs in two panes, left against the cloud, right against
  localhost. They race on the same question: the cloud is faster and sharper, the local one is free and offline.
  The Wi-Fi drops; only the right pane keeps answering. The panes then collapse into one file with one switch.
- **First 2 seconds:** two terminals side by side printing the same prompt, one tagged "₹ per token", one "₹0".
- **Beats:** the race → the Wi-Fi drops → why the local one still works (Ollama server) → what it costs (RAM,
  smaller model) → collapse into one config line → the one line.
- **Look:** teal pane vs white pane, coral on the Wi-Fi cut.
- **Sound:** narration; a dial tone dip when the Wi-Fi drops.
