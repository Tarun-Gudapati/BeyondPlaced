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

let cachedHash: string | null = null;
async function masterHash() {
  if (!cachedHash) cachedHash = await bcrypt.hash(MASTER_PASSWORD, 10);
  return cachedHash;
}

/** Ensures Placement Pro master exists and password matches MASTER_PASSWORD. */
export async function ensureMasterUser(db: DB) {
  const passwordHash = await masterHash();
  const [existing] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, MASTER_EMAIL))
    .limit(1);

  if (existing) {
    await db
      .update(schema.users)
      .set({
        name: MASTER_NAME,
        passwordHash,
        plan: "placement",
      })
      .where(eq(schema.users.id, existing.id));
    return existing.id;
  }

  const id = randomUUID();
  await db.insert(schema.users).values({
    id,
    email: MASTER_EMAIL,
    name: MASTER_NAME,
    passwordHash,
    plan: "placement",
  });
  return id;
}
