import "server-only";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

type DB = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { beyondplacedDb?: Promise<DB> };

export const usingEmbeddedDb = !process.env.DATABASE_URL;

async function connect(): Promise<DB> {
  if (process.env.DATABASE_URL) {
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? undefined : { rejectUnauthorized: false },
    });
    await pool.query(schema.SCHEMA_SQL);
    return drizzle(pool, { schema });
  }

  // Serverless hosts only allow writes under /tmp, which is wiped on cold starts.
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const dataDir = process.env.VERCEL ? "/tmp/beyondplaced-db" : `${process.cwd()}/.data/pglite`;
  const { mkdirSync } = await import("node:fs");
  mkdirSync(dataDir, { recursive: true });
  const client = new PGlite(dataDir);
  await client.exec(schema.SCHEMA_SQL);
  return drizzle(client, { schema }) as unknown as DB;
}

export function getDb(): Promise<DB> {
  if (!globalForDb.beyondplacedDb) {
    globalForDb.beyondplacedDb = connect().catch((err) => {
      globalForDb.beyondplacedDb = undefined;
      throw err;
    });
  }
  return globalForDb.beyondplacedDb;
}

export { schema };
