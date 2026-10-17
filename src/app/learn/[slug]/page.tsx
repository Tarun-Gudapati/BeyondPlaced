import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allLessons, getLesson } from "@/lib/course";
import { LessonView } from "@/components/lesson-view";

export function generateStaticParams() {
  return allLessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getLesson(slug);
  return { title: found ? `${found.lesson.title} — ShipAI` : "Lesson — ShipAI" };
}

export default async function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  if (!getLesson(slug)) notFound();
  return <LessonView slug={slug} />;
}
