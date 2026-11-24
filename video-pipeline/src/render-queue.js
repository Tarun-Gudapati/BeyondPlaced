import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

/**
 * Render and publish lesson videos one at a time (this machine cannot render two at once).
 *
 *   node src/render-queue.js [--watch]
 *
 * A project is picked up when it contains READY.json: { "slug": "...", "free": false, "posterAt": 12.5 }.
 * Free lessons are copied to public/videos/; paid lessons are uploaded to private Supabase Storage.
 * PUBLISHED.json is written when done, so re-runs skip finished projects. With --watch it keeps
 * polling for new READY projects until it is stopped.
 */

const root = resolve(import.meta.dirname, "..");
const projects = join(root, "hyperframes");
const publicVideos = resolve(root, "..", "public", "videos");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const watch = process.argv.includes("--watch");
const isWin = process.platform === "win32";

function run(cmd, args, cwd) {
  execFileSync(cmd, args, { cwd, stdio: "inherit", shell: isWin && cmd === "npx" });
}

function pending() {
  return readdirSync(projects, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("lesson-"))
    .map((d) => join(projects, d.name))
    .filter((dir) => existsSync(join(dir, "READY.json")) && !existsSync(join(dir, "PUBLISHED.json")))
    .sort();
}

function publish(dir) {
  const ready = JSON.parse(readFileSync(join(dir, "READY.json"), "utf8"));
  const { slug, free = false, posterAt = 5 } = ready;
  const renders = join(dir, "renders");
  const out = join(dir, "out");
  mkdirSync(renders, { recursive: true });
  mkdirSync(out, { recursive: true });
  const raw = join(renders, "raw.mp4");
  const norm = join(renders, "norm.mp4");
  const mp4 = join(out, `${slug}.mp4`);
  const jpg = join(out, `${slug}.jpg`);
  const vtt = join(out, `${slug}.vtt`);

  console.log(`\n=== ${slug} (${free ? "free" : "paid"}) ===`);
  // npx goes through the shell on Windows, so keep its arguments free of spaces.
  run("npx", ["-y", "hyperframes@0.9.87", "render", "--workers", "2", "--output", "renders/raw.mp4"], dir);
  run(ffmpeg, ["-y", "-loglevel", "error", "-i", raw, "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", norm]);
  run(ffmpeg, ["-y", "-loglevel", "error", "-i", norm, "-c", "copy", "-movflags", "+faststart", mp4]);
  run(ffmpeg, ["-y", "-loglevel", "error", "-ss", String(posterAt), "-i", mp4, "-frames:v", "1", "-q:v", "3", jpg]);
  copyFileSync(join(dir, "captions.vtt"), vtt);

  if (free) {
    for (const f of [mp4, jpg, vtt]) copyFileSync(f, join(publicVideos, f.split(/[\\/]/).pop()));
  } else {
    run(process.execPath, [join(root, "src", "upload-supabase.js"), slug, mp4, jpg, vtt], root);
  }
  writeFileSync(join(dir, "PUBLISHED.json"), JSON.stringify({ slug, free, at: new Date().toISOString() }, null, 2));
  console.log(`=== published ${slug} ===`);
}

for (;;) {
  const queue = pending();
  for (const dir of queue) {
    try {
      publish(dir);
    } catch (e) {
      console.error(`FAILED ${dir}: ${e.message}`);
      writeFileSync(join(dir, "RENDER_FAILED.txt"), String(e.stack || e));
      writeFileSync(join(dir, "PUBLISHED.json"), JSON.stringify({ failed: true, at: new Date().toISOString() }));
    }
  }
  if (!watch) break;
  await new Promise((r) => setTimeout(r, 120_000));
}
