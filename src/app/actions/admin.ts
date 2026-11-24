"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { PLAN_RANK, type PlanId } from "@/lib/pricing";

export async function setUserPlan(formData: FormData) {
  const admin = await getCurrentUser();
  if (!admin?.isAdmin) throw new Error("Not allowed");
  const userId = String(formData.get("userId") ?? "");
  const plan = String(formData.get("plan") ?? "") as PlanId;
  if (!userId || !(plan in PLAN_RANK)) throw new Error("Invalid plan change");
  const db = await getDb();
  await db.update(schema.users).set({ plan }).where(eq(schema.users.id, userId));
  refresh();
}
