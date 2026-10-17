"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { getLesson } from "@/lib/course";

export type QuizResult =
  | { status: "correct"; explanation: string }
  | { status: "wrong" }
  | { status: "login" }
  | { status: "locked" };

export async function submitQuiz(slug: string, answer: number): Promise<QuizResult> {
  const found = getLesson(slug);
  if (!found) return { status: "wrong" };
  const user = await getCurrentUser();
  if (!user) return { status: "login" };
  if (!found.lesson.free && user.plan === "free") return { status: "locked" };
  if (answer !== found.lesson.quiz.answer) return { status: "wrong" };

  const db = await getDb();
  await db.insert(schema.progress).values({ userId: user.id, lessonSlug: slug }).onConflictDoNothing();
  refresh();
  return { status: "correct", explanation: found.lesson.quiz.explanation };
}
