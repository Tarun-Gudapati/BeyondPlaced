# Lesson video: known problems and fixes

Found while making lesson 1.

## HyperFrames check

| Finding | Fix |
| --- | --- |
| `duplicate_audio_track` on every voice clip | Give each `<audio>` `data-duration` equal to its line duration in `timing.json`; without it a clip is treated as running to the end of the video. |
| `gsap_timeline_set_initial_hide` | Set starting states with `gsap.set(...)` outside the timeline, not `tl.set(..., 0)`. |
| `first_frame_empty` | Have the first scene's main object on screen at 0 s (slide it, don't fade it in from nothing). |
| `content_overlap` on a value label | Move the moving label away from fixed labels at every position it travels to. |
| `svg_round_cap_hidden_dash` | Hide a path to be drawn with `stroke-dasharray="1 1.2"` and `stroke-dashoffset="1.1"`, then tween the offset to 0. |
| `text_below_floor` | Nothing readable under 28 px. |
| `line_unread` | Hold a line 0.5 s + 0.3 s per word, unless it carries straight into the next scene. |
| `overlapping_gsap_tweens` on an array of different tiles | False positive when each tween targets a different element. |
| Background layer with `z-index: -1` vanishes | Give its parent `isolation: isolate`. |

## Seeking

- Text that changes over time (counters, percentages): never set it from `tl.call`; scrubbing backwards breaks it. Use stacked elements that crossfade, or an `onUpdate` that computes the value from the current time.
- Use `fromTo`, not `from`, inside scenes.

## Machine

- FFmpeg is installed by winget but not on PATH. Before rendering:
  `$env:Path = (Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter ffmpeg.exe -Recurse | Select-Object -First 1).DirectoryName + ";" + $env:Path`
- About 7 GB RAM with little free: close other apps before rendering. 100 s of video took 33 minutes.
- PowerShell mangles JSON passed to `curl.exe`; call HTTP APIs from Node instead.

## ElevenLabs

- The API key is restricted: text-to-speech works, but listing voices and reading the account return 401. Ask the user for a voice ID from the Voice Library to change voice (`ELEVENLABS_VOICE_ID`).
- The free plan has no commercial licence; paid lessons need Starter or above.
- `scene-tts.js` sends `previous_text` / `next_text` so lines sound continuous.

## Supabase Storage

- Bucket `lesson-videos` is private with a 50 MB per-file limit (the free plan maximum) and allows mp4, vtt, jpg and png.
- Signed links last 4 hours. A file's public URL and requests without the key return 400.
