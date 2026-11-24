---
name: lesson-video
description: Produce a narrated explainer video for a BeyondPlaced lesson (ElevenLabs voice, HyperFrames motion graphics) and publish it on the lesson page, free lessons from public/videos and paid lessons from private Supabase Storage. Use when the user asks to make, redo or publish a lesson video, AI video, voiceover or explainer for a lesson in src/lib/course.ts.
---

# Lesson video

Pipeline: lesson text → `narration.json` → ElevenLabs per-line audio + word timings → HyperFrames scenes timed to words → check → render → loudness fix → publish as a `video` block in `src/lib/course.ts`.

Lesson 1 (`video-pipeline/hyperframes/lesson-01-how-llms-work/`) is the reference project. Copy its structure and look; read its `SPEC.md` and `compositions/*.html` before building.

```
Task progress:
- [ ] 1. Storylines: 3 options from the lesson, user picks
- [ ] 2. Scaffold project + narration.json
- [ ] 3. Narration audio + timing.json + captions.vtt
- [ ] 4. SPEC.md, then one composition per scene
- [ ] 5. check passes, snapshots reviewed
- [ ] 6. Render + loudness normalise
- [ ] 7. Publish on the lesson page, build, verify in browser
```

## 1. Storylines

Read the `/hyperframes` skill first (`~/.cursor/skills/hyperframes/SKILL.md`, plus `references/types/explainer.md` and `references/story.md`). Write three storylines into `STORYLINES.md`, recommend one, and stop until the user picks. Every claim must come from the lesson's text in `src/lib/course.ts`; label example numbers "illustrative".

## 2. Scaffold

From `video-pipeline/hyperframes/`:

```bash
npx -y hyperframes@0.9.87 init lesson-NN-<slug> --example blank --resolution landscape --non-interactive --skill hyperframes
```

`narration.json`: `{ "lesson": "<slug>", "gapAfter": 0.35, "lines": [{ "id": "l01", "scene": "<scene id>", "text": "…" }] }`. About 19 spoken words per line; 2–3 minutes total.

## 3. Narration

From `video-pipeline/`: `node src/scene-tts.js hyperframes/lesson-NN-<slug>` (needs `ELEVENLABS_API_KEY` in `video-pipeline/.env`). Writes `assets/vo/<id>.mp3`, `timing.json` (each line's start and every word's start) and `captions.vtt`. Re-runs use cached audio; `--force` regenerates and spends credits (~1 credit per character).

## 4. Build

- `SPEC.md` from the template in the hyperframes skill's `references/spec.md`. Keep the BeyondPlaced look: ground `#F0FDFA`, ink `#0B1220`, teal `#0F766E`, coral `#EA580C` only on the one key item per scene; Inter + JetBrains Mono.
- One `compositions/<scene>.html` per scene; a scene's duration runs from its first line's `start` to the next scene's first line. `index.html` mounts the scenes back to back and one `<audio>` per line with `data-start` = line start and `data-duration` = line duration from `timing.json`.
- Time every reveal to its word: `lineStart + word.start`.

## 5. Check

```bash
npx -y hyperframes@0.9.87 check
npx -y hyperframes@0.9.87 snapshot --at <seconds,…>
```

Fix every error; read the contact sheets. Known fixes are in [reference.md](reference.md).

## 6. Render

```bash
npx -y hyperframes@0.9.87 render --output renders/lesson-NN-<slug>.mp4
ffmpeg -i renders/in.mp4 -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 renders/out.mp4
```

Renders take ~20 s per video-second on this machine; run in the background.

## 7. Publish

- `ffmpeg -i <render> -c copy -movflags +faststart <dest>.mp4`, and a poster with `ffmpeg -ss <t> -i <mp4> -frames:v 1 -q:v 3 <dest>.jpg`.
- **Free lesson**: put mp4, jpg and vtt in `public/videos/` and use `src: "/videos/<slug>.mp4"`.
- **Paid lesson**: upload with `node src/upload-supabase.js <slug> <files…>` (from `video-pipeline/`) and use `src: "supabase:<slug>/<file>"`. `src/lib/storage.ts` signs it only for users who can open the lesson. Never put paid media in `public/`.
- Add the block first in the lesson's `blocks`:
  `{ type: "video", src, poster, captions, title: "<lesson title>, in N seconds" }`
- `npx tsc --noEmit && npx eslint src && npx next build`, then open `/learn/<slug>` and confirm the video loads.

## Secrets

Keys live only in `video-pipeline/.env` (gitignored) and the Vercel project settings. Never commit them or print them.
