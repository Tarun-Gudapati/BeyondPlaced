import "server-only";
import { m1 } from "@/lib/modules/m1";
import { m2 } from "@/lib/modules/m2";
import { m3 } from "@/lib/modules/m3";
import { m4 } from "@/lib/modules/m4";
import { m5 } from "@/lib/modules/m5";
import { m6 } from "@/lib/modules/m6";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "tip"; text: string }
  | { type: "diagram"; id: string; caption?: string }
  | { type: "video"; src: string; poster?: string; captions?: string; title: string };

export type Quiz = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  slug: string;
  title: string;
  minutes: number;
  free?: boolean;
  summary: string;
  blocks: Block[];
  quiz: Quiz;
  task: string;
};

export type Module = {
  id: string;
  title: string;
  outcome: string;
  project: string;
  lessons: Lesson[];
};

export const COURSE_NAME = "AI Engineering Bootcamp";

export const modules: Module[] = [m1, m2, m3, m4, m5, m6];

export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })),
);

export const totalMinutes = allLessons.reduce((s, l) => s + l.minutes, 0);

export function getLesson(slug: string) {
  const index = allLessons.findIndex((l) => l.slug === slug);
  if (index === -1) return null;
  return {
    lesson: allLessons[index],
    prev: allLessons[index - 1] ?? null,
    next: allLessons[index + 1] ?? null,
    index,
  };
}

export type OutlineLesson = {
  slug: string;
  title: string;
  minutes: number;
  free: boolean;
  done: boolean;
  locked: boolean;
};

export type OutlineModule = { id: string; title: string; project: string; lessons: OutlineLesson[] };

export function buildOutline(completed: Set<string>, paid: boolean): OutlineModule[] {
  return modules.map((m) => ({
    id: m.id,
    title: m.title,
    project: m.project,
    lessons: m.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      minutes: l.minutes,
      free: !!l.free,
      done: completed.has(l.slug),
      locked: !paid && !l.free,
    })),
  }));
}
