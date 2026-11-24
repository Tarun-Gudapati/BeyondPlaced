import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { loadEnv } from "./load-env.js";

/**
 * Upload finished lesson media to the private Supabase Storage bucket.
 *
 *   node src/upload-supabase.js <slug> <file> [<file> ...]
 *
 * Files land at <bucket>/<slug>/<file name>; reference them in course.ts as "supabase:<slug>/<file name>".
 * Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in video-pipeline/.env.
 */

loadEnv();

const [slug, ...files] = process.argv.slice(2);
if (!slug || !files.length) {
  console.error("Usage: node src/upload-supabase.js <slug> <file> [<file> ...]");
  process.exit(1);
}

const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_VIDEO_BUCKET || "lesson-videos";
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in video-pipeline/.env");
  process.exit(1);
}

const types = { ".mp4": "video/mp4", ".vtt": "text/vtt", ".jpg": "image/jpeg", ".png": "image/png" };

for (const file of files) {
  const path = `${slug}/${basename(file)}`;
  const res = await fetch(`${url}/storage/v1/object/${bucket}/${encodeURI(path)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": types[extname(file).toLowerCase()] ?? "application/octet-stream",
      "x-upsert": "true",
    },
    body: readFileSync(file),
  });
  if (!res.ok) throw new Error(`Upload failed for ${file}: ${res.status} ${await res.text()}`);
  console.log(`• ${file} → supabase:${path}`);
}
