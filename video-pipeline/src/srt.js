import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pipelineRoot } from "./load-env.js";

/** Rough captions from script text (timed by word count). Good enough for faceless drafts. */
export function writeSrt({ slug, kind, text, wordsPerMinute = 155 }) {
  const outDir = resolve(pipelineRoot, "out", slug);
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, `${kind}.srt`);

  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const wps = wordsPerMinute / 60;
  let t = 0;
  const blocks = [];

  sentences.forEach((sentence, idx) => {
    const words = sentence.split(/\s+/).length;
    const dur = Math.max(1.4, words / wps);
    const start = t;
    const end = t + dur;
    t = end + 0.12;
    blocks.push(`${idx + 1}\n${fmt(start)} --> ${fmt(end)}\n${wrap(sentence)}\n`);
  });

  writeFileSync(outPath, blocks.join("\n"), "utf8");
  return { outPath, durationSec: t };
}

function fmt(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.round((sec - Math.floor(sec)) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${String(ms).padStart(3, "0")}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function wrap(text, width = 42) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > width) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2).join("\n");
}
