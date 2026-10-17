import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import type { PlanId } from "@/lib/pricing";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  plan: PlanId;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const db = await getDb();
  const [user] = await db
    .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, plan: schema.users.plan })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  return user ? { ...user, plan: user.plan as PlanId } : null;
});

export async function requireUser(next: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export function safeNext(next: unknown, fallback = "/dashboard") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export const getCompletedLessons = cache(async (userId: string) => {
  const db = await getDb();
  return db
    .select({ slug: schema.progress.lessonSlug, completedAt: schema.progress.completedAt })
    .from(schema.progress)
    .where(eq(schema.progress.userId, userId));
});
