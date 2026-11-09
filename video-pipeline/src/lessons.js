import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pipelineRoot } from "./load-env.js";

export function loadLessons() {
  return JSON.parse(readFileSync(resolve(pipelineRoot, "lessons.json"), "utf8"));
}

export function pickLessons({ slug, hooksOnly }) {
  let lessons = loadLessons();
  if (slug) lessons = lessons.filter((l) => l.slug === slug);
  if (!lessons.length) throw new Error(slug ? `No lesson with slug "${slug}"` : "lessons.json is empty");
  return lessons.map((l) => ({
    ...l,
    text: hooksOnly ? l.hook : `${l.hook}\n\n${l.narration}`,
    kind: hooksOnly ? "hook" : "full",
  }));
}
