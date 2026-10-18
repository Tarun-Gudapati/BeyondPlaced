import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { allLessons, buildOutline, getLesson } from "@/lib/course";
import { getCompletedLessons, getCurrentUser } from "@/lib/auth";
import { LessonView, LessonSkeleton } from "@/components/lesson-view";

export function generateStaticParams() {
  return allLessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getLesson(slug);
  return { title: found ? found.lesson.title : "Lesson" };
}

async function Lesson({ params }: { params: PageProps<"/learn/[slug]">["params"] }) {
  const { slug } = await params;
  const found = getLesson(slug);
  if (!found) notFound();
  const { lesson, prev, next, index } = found;

  const user = await getCurrentUser();
  const paid = !!user && user.plan !== "free";
  const completed = new Set(user ? (await getCompletedLessons(user.id)).map((c) => c.slug) : []);
  const locked = !paid && !lesson.free;

  return (
    <LessonView
      outline={buildOutline(completed, paid)}
      lesson={{
        slug: lesson.slug,
        title: lesson.title,
        minutes: lesson.minutes,
        free: !!lesson.free,
        summary: lesson.summary,
        moduleTitle: lesson.moduleTitle,
        index,
        total: allLessons.length,
      }}
      content={
        locked
          ? null
          : {
              blocks: lesson.blocks,
              task: lesson.task,
              quiz: { question: lesson.quiz.question, options: lesson.quiz.options },
            }
      }
      prev={prev && { slug: prev.slug, title: prev.title }}
      next={next && { slug: next.slug, title: next.title }}
      done={completed.has(slug)}
      loggedIn={!!user}
      progressPct={Math.round((completed.size / allLessons.length) * 100)}
    />
  );
}

export default function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <Lesson params={params} />
    </Suspense>
  );
}
