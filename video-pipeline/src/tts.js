import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pipelineRoot } from "./load-env.js";

const API = "https://api.elevenlabs.io";

export function requireApiKey() {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing ELEVENLABS_API_KEY. Copy .env.example to .env and paste your key (or set the env var).",
    );
  }
  return key;
}

export function voiceConfig() {
  return {
    voiceId: process.env.ELEVENLABS_VOICE_ID?.trim() || "JBFqnCBsd6RMkjVDRZzb",
    modelId: process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_multilingual_v2",
    speed: Number(process.env.ELEVENLABS_SPEED || "1.05"),
  };
}

export async function listVoices() {
  const key = requireApiKey();
  const res = await fetch(`${API}/v1/voices`, {
    headers: { "xi-api-key": key },
  });
  if (!res.ok) throw new Error(`List voices failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.voices || [];
}

export async function synthesize({ slug, kind, text, force = false }) {
  const key = requireApiKey();
  const { voiceId, modelId, speed } = voiceConfig();
  const outDir = resolve(pipelineRoot, "out", slug);
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, `${kind}.mp3`);

  if (existsSync(outPath) && !force) {
    return { outPath, skipped: true };
  }

  const url = `${API}/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.15,
        speed: Number.isFinite(speed) ? speed : 1.05,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`TTS failed for ${slug}: ${res.status} ${await res.text()}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
  return { outPath, skipped: false, bytes: buf.length };
}
