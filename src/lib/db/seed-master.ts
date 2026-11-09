import "server-only";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const MASTER_ID = "master-beyondplaced";
export const MASTER_EMAIL = (process.env.MASTER_EMAIL ?? "master@beyondplaced.com").trim().toLowerCase();
export const MASTER_PASSWORD = process.env.MASTER_PASSWORD ?? "BeyondMaster2026!";
export const MASTER_NAME = process.env.MASTER_NAME ?? "BeyondPlaced Master";

type DB = NodePgDatabase<typeof schema>;

let cachedHash: string | null = null;
async function masterHash() {
  if (!cachedHash) cachedHash = await bcrypt.hash(MASTER_PASSWORD, 10);
  return cachedHash;
}

/**
 * The id must be fixed: without DATABASE_URL every serverless instance has its own
 * embedded DB, and a session minted on one instance must resolve on all of them.
 */
export async function ensureMasterUser(db: DB) {
  const passwordHash = await masterHash();
  const [existing] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, MASTER_EMAIL))
    .limit(1);

  if (existing && existing.id !== MASTER_ID) {
    await db.delete(schema.users).where(eq(schema.users.id, existing.id));
  }

  if (existing?.id === MASTER_ID) {
    await db
      .update(schema.users)
      .set({ name: MASTER_NAME, passwordHash, plan: "placement" })
      .where(eq(schema.users.id, MASTER_ID));
    return MASTER_ID;
  }

  await db.insert(schema.users).values({
    id: MASTER_ID,
    email: MASTER_EMAIL,
    name: MASTER_NAME,
    passwordHash,
    plan: "placement",
  });
  return MASTER_ID;
}
