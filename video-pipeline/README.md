# BeyondPlaced video pipeline

Faceless lesson videos: **script → ElevenLabs voice → captions → (optional) vertical MP4**.

## Setup

1. Copy env file and paste your key:

```powershell
cd video-pipeline
Copy-Item .env.example .env
# Edit .env — set ELEVENLABS_API_KEY=...
```

2. List voices and pick one:

```powershell
node src/list-voices.js
# then set ELEVENLABS_VOICE_ID in .env
```

3. (Optional) for MP4 render:

```powershell
winget install ffmpeg
```

## Run

```powershell
# One lesson (safe first test — uses API credits)
node src/run.js --tts --slug=how-llms-work

# All 18 full narrations
node src/run.js --tts

# Short social hooks only
node src/run.js --tts --hooks

# Audio + vertical 1080x1920 mp4
node src/run.js --tts --render --slug=how-llms-work
```

Outputs land in `out/<slug>/`:

- `full.mp3` / `hook.mp3`
- `full.srt` / `hook.srt`
- `full.mp4` / `hook.mp4` (if `--render` + ffmpeg)

## Notes

- Scripts live in `lessons.json` (edit freely; re-run with `--force` to regenerate audio).
- TTS calls **bill** your ElevenLabs plan — test one slug before `--tts` on all.
- Without ffmpeg you still get production-ready voiceovers + captions for CapCut.
