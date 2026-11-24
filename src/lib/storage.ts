import "server-only";
import type { Block } from "@/lib/course";

/**
 * Paid lesson media lives in a private Supabase Storage bucket. Course content refers to it as
 * "supabase:<path in bucket>", and only entitled users ever receive a signed URL for it.
 */
const PREFIX = "supabase:";
const SIGNED_URL_SECONDS = 60 * 60 * 4;

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_VIDEO_BUCKET || "lesson-videos";

async function signedUrl(path: string): Promise<string | null> {
  if (!supabaseUrl || !serviceKey) {
    console.error(`Supabase Storage is not configured; can't sign ${path}`);
    return null;
  }
  const res = await fetch(`${supabaseUrl}/storage/v1/object/sign/${bucket}/${encodeURI(path)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey, "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: SIGNED_URL_SECONDS }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`Supabase sign failed for ${path}: ${res.status} ${await res.text()}`);
    return null;
  }
  const { signedURL } = (await res.json()) as { signedURL: string };
  return `${supabaseUrl}/storage/v1${signedURL}`;
}

async function resolve(src: string | undefined) {
  if (!src?.startsWith(PREFIX)) return src;
  return (await signedUrl(src.slice(PREFIX.length))) ?? undefined;
}

export async function resolveMedia(blocks: Block[]): Promise<Block[]> {
  const resolved = await Promise.all(
    blocks.map(async (block): Promise<Block | null> => {
      if (block.type !== "video") return block;
      const src = await resolve(block.src);
      if (!src) return null;
      return { ...block, src, poster: await resolve(block.poster), captions: await resolve(block.captions) };
    }),
  );
  return resolved.filter((b) => b !== null);
}
