import "server-only";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

/** Always available admin for demos / owner access. Override with env if you want. */
export const MASTER_EMAIL = (process.env.MASTER_EMAIL ?? "master@beyondplaced.com").trim().toLowerCase();
export const MASTER_PASSWORD = process.env.MASTER_PASSWORD ?? "BeyondMaster2026!";
export const MASTER_NAME = process.env.MASTER_NAME ?? "BeyondPlaced Master";

type DB = NodePgDatabase<typeof schema>;

/** Ensures a Placement Pro master user exists (full course access). */
export async function ensureMasterUser(db: DB) {
  const [existing] = await db
    .select({ id: schema.users.id, plan: schema.users.plan })
    .from(schema.users)
    .where(eq(schema.users.email, MASTER_EMAIL))
    .limit(1);

  if (existing) {
    const patch: { name: string; plan: string; passwordHash?: string } = {
      name: MASTER_NAME,
      plan: "placement",
    };
    // Set MASTER_RESET_PASSWORD=1 on Vercel once if you need to reset the password.
    if (process.env.MASTER_RESET_PASSWORD === "1") {
      patch.passwordHash = await bcrypt.hash(MASTER_PASSWORD, 10);
    }
    await db.update(schema.users).set(patch).where(eq(schema.users.id, existing.id));
    return existing.id;
  }

  const id = randomUUID();
  await db.insert(schema.users).values({
    id,
    email: MASTER_EMAIL,
    name: MASTER_NAME,
    passwordHash: await bcrypt.hash(MASTER_PASSWORD, 10),
    plan: "placement",
  });
  return id;
}
