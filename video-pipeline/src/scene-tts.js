import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "./load-env.js";
import { requireApiKey, voiceConfig } from "./tts.js";

/**
 * Per-line narration for a HyperFrames project: one mp3 per line plus word timings,
 * so scenes can reveal each part on the word that names it.
 *
 *   node src/scene-tts.js hyperframes/lesson-01-how-llms-work [--force]
 *
 * Reads <project>/narration.json, writes <project>/assets/vo/<id>.mp3 and <project>/timing.json.
 */

loadEnv();

const args = process.argv.slice(2);
const projectArg = args.find((a) => !a.startsWith("--"));
if (!projectArg) {
  console.error("Usage: node src/scene-tts.js <hyperframes project dir> [--force]");
  process.exit(1);
}
const force = args.includes("--force");
const project = resolve(projectArg);
const narration = JSON.parse(readFileSync(resolve(project, "narration.json"), "utf8"));
const voDir = resolve(project, "assets", "vo");
mkdirSync(voDir, { recursive: true });

const key = requireApiKey();
const { voiceId, modelId, speed } = voiceConfig();
const gap = narration.gapAfter ?? 0.35;
const lines = narration.lines;

const timing = { voiceId, modelId, gapAfter: gap, lines: [] };
let cursor = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const mp3 = resolve(voDir, `${line.id}.mp3`);
  const wordsPath = resolve(voDir, `${line.id}.words.json`);

  let words;
  if (!force && existsSync(mp3) && existsSync(wordsPath)) {
    words = JSON.parse(readFileSync(wordsPath, "utf8"));
    process.stdout.write(`• ${line.id} cached`);
  } else {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: line.text,
        model_id: modelId,
        previous_text: lines[i - 1]?.text,
        next_text: lines[i + 1]?.text,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.1, speed },
      }),
    });
    if (!res.ok) throw new Error(`TTS failed for ${line.id}: ${res.status} ${await res.text()}`);
    const data = await res.json();
    writeFileSync(mp3, Buffer.from(data.audio_base64, "base64"));
    words = toWords(data.alignment);
    writeFileSync(wordsPath, JSON.stringify(words, null, 2));
    process.stdout.write(`• ${line.id} ok`);
  }

  const duration = words.length ? words[words.length - 1].end : 0;
  timing.lines.push({
    id: line.id,
    scene: line.scene,
    text: line.text,
    src: `assets/vo/${line.id}.mp3`,
    start: round(cursor),
    duration: round(duration),
    words: words.map((w) => ({ ...w, start: round(w.start), end: round(w.end) })),
  });
  console.log(` (${duration.toFixed(2)} s)`);
  cursor += duration + gap;
}

timing.total = round(cursor);
writeFileSync(resolve(project, "timing.json"), JSON.stringify(timing, null, 2));
writeFileSync(resolve(project, "captions.vtt"), toVtt(timing.lines));
console.log(`\nTotal narration with gaps: ${timing.total.toFixed(2)} s → ${resolve(project, "timing.json")} + captions.vtt`);

function toVtt(timedLines, maxWords = 8) {
  const cues = [];
  for (const line of timedLines) {
    for (let i = 0; i < line.words.length; i += maxWords) {
      const chunk = line.words.slice(i, i + maxWords);
      cues.push({ start: line.start + chunk[0].start, end: line.start + chunk[chunk.length - 1].end, text: chunk.map((w) => w.word).join(" ") });
    }
  }
  return "WEBVTT\n\n" + cues.map((c, n) => `${n + 1}\n${vttTime(c.start)} --> ${vttTime(c.end)}\n${c.text}\n`).join("\n");
}

function vttTime(s) {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${sec}.${String(ms % 1000).padStart(3, "0")}`;
}

function toWords(alignment) {
  const { characters, character_start_times_seconds: starts, character_end_times_seconds: ends } = alignment;
  const words = [];
  let current = null;
  for (let i = 0; i < characters.length; i++) {
    if (/\s/.test(characters[i])) {
      current = null;
      continue;
    }
    if (!current) {
      current = { word: "", start: starts[i], end: ends[i] };
      words.push(current);
    }
    current.word += characters[i];
    current.end = ends[i];
  }
  return words;
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}
