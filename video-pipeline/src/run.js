import { loadEnv } from "./load-env.js";
import { pickLessons } from "./lessons.js";
import { synthesize } from "./tts.js";
import { writeSrt } from "./srt.js";
import { hasFfmpeg, renderVertical } from "./render.js";

loadEnv();

const args = parseArgs(process.argv.slice(2));

if (!args.tts && !args.render) {
  console.log(`BeyondPlaced video pipeline

Usage:
  node src/run.js --tts                  # all lessons → mp3 + srt
  node src/run.js --tts --slug=how-llms-work
  node src/run.js --tts --hooks          # short social hooks only
  node src/run.js --tts --render         # also build vertical mp4 (needs ffmpeg)
  node src/list-voices.js                # pick a voice id

Put ELEVENLABS_API_KEY in video-pipeline/.env first.
`);
  process.exit(0);
}

const lessons = pickLessons({ slug: args.slug, hooksOnly: args.hooks });
console.log(`Processing ${lessons.length} lesson(s)${args.hooks ? " (hooks)" : " (full)"}…`);

if (args.render && !hasFfmpeg()) {
  console.warn("Warning: ffmpeg not on PATH — will generate audio/srt only. Install with: winget install ffmpeg");
}

for (const lesson of lessons) {
  process.stdout.write(`• ${lesson.slug} … `);
  writeSrt({ slug: lesson.slug, kind: lesson.kind, text: lesson.text });

  if (args.tts) {
    const r = await synthesize({
      slug: lesson.slug,
      kind: lesson.kind,
      text: lesson.text,
      force: args.force,
    });
    process.stdout.write(r.skipped ? "audio cached, " : "audio ok, ");
  }

  if (args.render && hasFfmpeg()) {
    renderVertical({
      slug: lesson.slug,
      kind: lesson.kind,
      title: lesson.title,
      module: lesson.module,
    });
    process.stdout.write("mp4 ok");
  } else if (args.render) {
    process.stdout.write("mp4 skipped (no ffmpeg)");
  } else {
    process.stdout.write("srt ok");
  }
  console.log();
}

console.log("\nDone. Outputs in video-pipeline/out/<slug>/");

function parseArgs(argv) {
  const out = { tts: false, render: false, hooks: false, force: false, slug: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--tts") out.tts = true;
    else if (a === "--render") out.render = true;
    else if (a === "--hooks") out.hooks = true;
    else if (a === "--force") out.force = true;
    else if (a.startsWith("--slug=")) out.slug = a.slice(7);
    else if (a === "--slug") out.slug = argv[++i];
  }
  return out;
}
