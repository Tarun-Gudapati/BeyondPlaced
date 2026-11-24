# Lesson 6 video: waiting for narration audio

ElevenLabs returned `401 quota_exceeded` on the first line (24 credits left, 96 needed), so no audio was generated
and no credits were spent on this lesson. Nothing was retried.

What exists:

- `narration.json` — final script, 13 lines, 1,224 characters (about 1,224 credits).
- `STORYLINES.md`, `SPEC.md`, `compositions/*.html` (scale, graph, meta, tools, claim) — complete.
- `timing.json` — **provisional**: word times estimated at 15.2 characters per second, flagged `"provisional": true`.
  `index.html` currently mounts the scenes with no voice clips.
- `hyperframes check` passes on the provisional timing.

Every reveal in the scenes is written as "line, word index" (for example `T.l05.w[6]`), not as seconds, so the
scenes re-time themselves from the real audio.

To finish, once credits are available:

```
cd video-pipeline
node src/scene-tts.js hyperframes/lesson-06-vector-databases          # writes assets/vo/*.mp3, real timing.json, captions.vtt
cd hyperframes/lesson-06-vector-databases
node timing-tool.mjs build                                            # re-times every scene, adds the 13 voice clips to index.html
node ../../src/with-lock.js npx -y hyperframes@0.9.87 check           # with ffmpeg/ffprobe on PATH
```

Then look at one snapshot run (`snapshot --at 3,12,24,34,47,56,66,72,86`), and when check is clean:

1. Write `READY.json`: `{ "slug": "vector-databases", "free": false, "posterAt": <a frame in the graph scene, after "4 hops"> }`.
2. In `src/lib/modules/m2.ts`, make this the first block of the `vector-databases` lesson (N = rounded video length):

```ts
{
  type: "video",
  src: "supabase:vector-databases/vector-databases.mp4",
  poster: "supabase:vector-databases/vector-databases.jpg",
  captions: "supabase:vector-databases/vector-databases.vtt",
  title: "Vector databases, in N seconds",
},
```

3. Delete this file.

Do not change the text of any line in `narration.json` after generating audio unless you mean to pay for it again:
the word indexes in the scenes follow the script's words.
