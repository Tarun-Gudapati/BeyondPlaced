import "server-only";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const MASTER_ID = "master-beyondplaced";
export const MASTER_EMAIL = (process.env.MASTER_EMAIL ?? "master@beyondplaced.com").trim().toLowerCase();
const MASTER_PASSWORD = process.env.MASTER_PASSWORD?.trim() || null;
export const MASTER_NAME = process.env.MASTER_NAME ?? "BeyondPlaced Master";

type DB = NodePgDatabase<typeof schema>;

let cachedHash: string | null = null;
async function masterHash(password: string) {
  if (!cachedHash) cachedHash = await bcrypt.hash(password, 10);
  return cachedHash;
}

/**
 * The id must be fixed: without DATABASE_URL every serverless instance has its own
 * embedded DB, and a session minted on one instance must resolve on all of them.
 *
 * Without MASTER_PASSWORD the account must not exist: an older build seeded it with a
 * password that is public in this repo's history.
 */
export async function ensureMasterUser(db: DB) {
  if (!MASTER_PASSWORD) {
    await db.delete(schema.users).where(eq(schema.users.id, MASTER_ID));
    return null;
  }

  const passwordHash = await masterHash(MASTER_PASSWORD);
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
