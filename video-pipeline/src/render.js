import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pipelineRoot } from "./load-env.js";

export function hasFfmpeg() {
  const r = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  return r.status === 0;
}

/**
 * Title-card + audio + burned captions → vertical 1080x1920 MP4 (Reels/Shorts).
 * Requires ffmpeg on PATH.
 */
export function renderVertical({ slug, kind, title, module }) {
  if (!hasFfmpeg()) {
    throw new Error(
      "ffmpeg not found on PATH. Install it (winget install ffmpeg) then re-run with --render.",
    );
  }

  const dir = resolve(pipelineRoot, "out", slug);
  const mp3 = resolve(dir, `${kind}.mp3`);
  const srt = resolve(dir, `${kind}.srt`);
  const mp4 = resolve(dir, `${kind}.mp4`);
  if (!existsSync(mp3)) throw new Error(`Missing audio: ${mp3}`);
  if (!existsSync(srt)) throw new Error(`Missing captions: ${srt}`);

  mkdirSync(dir, { recursive: true });

  const srtPath = srt.replace(/\\/g, "/").replace(/:/g, "\\:");
  const titleEsc = escapeDraw(title);
  const moduleEsc = escapeDraw(module || "BeyondPlaced");

  const simpleFilter =
    `drawtext=fontfile=C\\\\:/Windows/Fonts/arialbd.ttf:text='BeyondPlaced':fontsize=40:fontcolor=0xb6f24a:x=(w-text_w)/2:y=200,` +
    `drawtext=fontfile=C\\\\:/Windows/Fonts/arial.ttf:text='${moduleEsc}':fontsize=32:fontcolor=0x2dd4bf:x=(w-text_w)/2:y=280,` +
    `drawtext=fontfile=C\\\\:/Windows/Fonts/arialbd.ttf:text='${titleEsc}':fontsize=44:fontcolor=white:x=(w-text_w)/2:y=400:line_spacing=10,` +
    `subtitles='${srtPath}':force_style='FontName=Arial,FontSize=20,PrimaryColour=&H00E8F4EC,BackColour=&H80000000,BorderStyle=3,Outline=0,Shadow=0,MarginV=140'`;

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      mp3,
      "-f",
      "lavfi",
      "-i",
      "color=c=0x0b1210:s=1080x1920:r=30",
      "-filter_complex",
      `[1:v]${simpleFilter}[v]`,
      "-map",
      "[v]",
      "-map",
      "0:a",
      "-c:v",
      "libx264",
      "-tune",
      "stillimage",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-shortest",
      mp4,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    writeFileSync(resolve(dir, `${kind}.ffmpeg.log`), result.stderr || result.stdout || "", "utf8");
    throw new Error(`ffmpeg failed for ${slug}. See out/${slug}/${kind}.ffmpeg.log`);
  }

  return { outPath: mp4 };
}

function escapeDraw(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\u2019")
    .replace(/\n/g, " ")
    .slice(0, 80);
}
