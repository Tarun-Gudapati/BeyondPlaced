"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";
import { safeNext } from "@/lib/auth";

export type AuthState = { error?: string; fields?: Record<string, string> } | undefined;

const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const fields = { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? "") };
  const parsed = signupSchema.safeParse({ ...fields, password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields };

  const db = await getDb();
  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, parsed.data.email))
    .limit(1);
  if (existing.length) return { error: "An account with this email already exists. Log in instead.", fields };

  const id = randomUUID();
  await db.insert(schema.users).values({
    id,
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash: await bcrypt.hash(parsed.data.password, 10),
  });
  await createSession(id);
  redirect(safeNext(formData.get("next")));
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fields = { email };
  if (!email || !password) return { error: "Enter your email and password", fields };

  const db = await getDb();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Wrong email or password", fields };
  }
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/");
}
