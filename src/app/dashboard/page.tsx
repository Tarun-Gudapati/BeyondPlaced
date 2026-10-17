import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { Dashboard, DashboardSkeleton } from "@/components/dashboard";
import { getCompletedLessons, requireUser } from "@/lib/auth";
import { allLessons, buildOutline } from "@/lib/course";

export const metadata: Metadata = { title: "My learning — ShipAI" };

function streak(dates: Date[]) {
  const days = new Set(dates.map((d) => d.toISOString().slice(0, 10)));
  const cursor = new Date();
  if (!days.has(cursor.toISOString().slice(0, 10))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let count = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    count++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return count;
}

async function DashboardData({ searchParams }: { searchParams: PageProps<"/dashboard">["searchParams"] }) {
  const user = await requireUser("/dashboard");
  const { welcome } = await searchParams;
  const rows = await getCompletedLessons(user.id);
  const completed = new Set(rows.map((r) => r.slug));
  const paid = user.plan !== "free";
  const next = allLessons.find((l) => !completed.has(l.slug)) ?? null;

  return (
    <Dashboard
      user={{ name: user.name, plan: user.plan }}
      welcome={welcome === "1" && paid}
      outline={buildOutline(completed, paid)}
      stats={{
        done: completed.size,
        total: allLessons.length,
        minutesDone: allLessons.filter((l) => completed.has(l.slug)).reduce((s, l) => s + l.minutes, 0),
        minutesTotal: allLessons.reduce((s, l) => s + l.minutes, 0),
        streak: streak(rows.map((r) => new Date(r.completedAt))),
      }}
      next={next && { slug: next.slug, locked: !paid && !next.free }}
      certificateDate={
        completed.size === allLessons.length
          ? new Date(Math.max(...rows.map((r) => new Date(r.completedAt).getTime()))).toISOString()
          : null
      }
      certificateId={`SHIP-${user.id.slice(0, 8).toUpperCase()}`}
    />
  );
}

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData searchParams={searchParams} />
      </Suspense>
    </>
  );
}
