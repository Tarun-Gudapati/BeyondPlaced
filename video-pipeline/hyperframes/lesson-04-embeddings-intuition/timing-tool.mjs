// Authoring helper (not used at render time).
//
//   node timing-tool.mjs print    list every scene, line and word with scene-local times
//   node timing-tool.mjs build    rewrite index.html from timing.json and refresh the
//                                 `/*T*/ ... /*T*/` word-time table inside each compositions/<scene>.html
//
// Inside a scene, T.l03.s is the line's start and T.l03.w[5] the start of its 6th word, both in
// scene-local seconds, so every reveal can be written as "on this word".
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = import.meta.dirname;
const timing = JSON.parse(readFileSync(join(dir, "timing.json"), "utf8"));
const TAIL = 2; // hold on the last frame after the final word
const r = (n) => Math.round(n * 1000) / 1000;

const scenes = [];
for (const line of timing.lines) {
  let scene = scenes[scenes.length - 1];
  if (!scene || scene.id !== line.scene) {
    scene = { id: line.scene, start: line.start, lines: [] };
    scenes.push(scene);
  }
  scene.lines.push(line);
}
const total = r(timing.total + TAIL);
scenes.forEach((s, i) => {
  s.duration = r((scenes[i + 1] ? scenes[i + 1].start : total) - s.start);
});

const mode = process.argv[2] || "print";

if (mode === "print") {
  for (const s of scenes) {
    console.log(`\n=== ${s.id}  start ${s.start}  duration ${s.duration}`);
    for (const l of s.lines) {
      console.log(`  ${l.id}  s=${r(l.start - s.start)}  end=${r(l.start - s.start + l.duration)}`);
      console.log("    " + l.words.map((w, i) => `${i}:${w.word}@${r(l.start - s.start + w.start)}`).join("  "));
    }
  }
  console.log(`\ntotal ${total}`);
}

if (mode === "build") {
  for (const s of scenes) {
    const file = join(dir, "compositions", `${s.id}.html`);
    if (!existsSync(file)) {
      console.log(`(no ${s.id}.html yet)`);
      continue;
    }
    const T = {};
    for (const l of s.lines) T[l.id] = { s: r(l.start - s.start), w: l.words.map((w) => r(l.start - s.start + w.start)) };
    const table = `/*T*/ const T = ${JSON.stringify(T)}; const END = ${s.duration}; /*T*/`;
    const html = readFileSync(file, "utf8");
    if (!/\/\*T\*\/[\s\S]*?\/\*T\*\//.test(html)) throw new Error(`${s.id}.html has no /*T*/ ... /*T*/ marker`);
    writeFileSync(file, html.replace(/\/\*T\*\/[\s\S]*?\/\*T\*\//, () => table));
    console.log(`updated ${s.id}.html`);
  }

  const hosts = scenes
    .map((s) => `      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.start}" data-duration="${s.duration}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>`)
    .join("\n");
  const audio = timing.lines
    .map((l) => `      <audio id="vo-${l.id}" class="clip" src="${l.src}" data-start="${l.start}" data-duration="${l.duration}" data-track-index="5" data-volume="1"></audio>`)
    .join("\n");
  const index = `<!doctype html>
<html lang="en" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #F0FDFA; }
      #root { position: relative; width: 100%; height: 100%; }
      #ground { position: absolute; inset: 0; background: #F0FDFA; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080">
      <div id="ground"></div>

${hosts}

${audio}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
  writeFileSync(join(dir, "index.html"), index);
  console.log(`index.html: ${scenes.length} scenes, ${timing.lines.length} lines, ${total} s`);
}
