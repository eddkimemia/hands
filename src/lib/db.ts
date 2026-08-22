import { Pool, type PoolClient } from "pg";
import { buildSeed } from "@/data/seed";
import type { DatabaseShape } from "@/types";

/* ------------------------------------------------------------------ */
/*  PostgreSQL data layer                                              */
/*                                                                     */
/*  All CMS content lives in a single document-style table:            */
/*    content(collection TEXT, id TEXT, data JSONB, created_at)        */
/*  which keeps the generic admin CRUD simple while storing real       */
/*  relational-backed JSON documents.                                  */
/*                                                                     */
/*  Connection: DATABASE_URL env var. In local development an          */
/*  embedded PostgreSQL daemon is started automatically by             */
/*  scripts/db.mjs (`npm run dev` / `npm run start` do this for you).  */
/* ------------------------------------------------------------------ */

const CONNECTION_STRING =
  process.env.DATABASE_URL || "postgres://postgres:password@localhost:5433/handsofhope";

declare global {
  // eslint-disable-next-line no-var
  var __hhPool: Pool | undefined;
}

function pool(): Pool {
  if (!global.__hhPool) {
    global.__hhPool = new Pool({
      connectionString: CONNECTION_STRING,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 20_000,
      // Retry once on transient connection drops (e.g. local PG waking up).
      application_name: "handsofhope",
    });
    global.__hhPool.on("error", (err) => console.error("[db] pool error", err.message));
  }
  return global.__hhPool;
}

export function id(prefix = "id"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}

export const SINGLETON_ID = "__singleton__";

export type CollectionKey = Exclude<keyof DatabaseShape, never>;

let readyPromise: Promise<void> | null = null;

/** Creates the schema and seeds starter content on first run. */
export async function ensureDatabase(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      const client = pool();
      await client.query(`
        CREATE TABLE IF NOT EXISTS content (
          collection TEXT NOT NULL,
          id TEXT NOT NULL,
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (collection, id)
        )
      `);
      await client.query(
        `CREATE INDEX IF NOT EXISTS content_collection_idx ON content (collection)`,
      );
      await client.query(`
        CREATE TABLE IF NOT EXISTS media (
          id TEXT PRIMARY KEY,
          filename TEXT NOT NULL,
          mime TEXT NOT NULL,
          bytes INTEGER NOT NULL,
          data BYTEA NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);

      const { rows } = await client.query<{ count: string }>(
        `SELECT count(*)::text AS count FROM content`,
      );
      if (Number(rows[0]?.count ?? "0") === 0) {
        await seedDatabase();
        console.log("[db] Seeded starter content into PostgreSQL");
      }
    })().catch((err) => {
      readyPromise = null; // allow retry on next request
      throw err;
    });
  }
  return readyPromise;
}

async function seedDatabase(): Promise<void> {
  const seed = buildSeed();
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    for (const [collection, value] of Object.entries(seed)) {
      if (collection === "settings" || collection === "homepage") {
        await client.query(
          `INSERT INTO content (collection, id, data) VALUES ($1, $2, $3)
           ON CONFLICT (collection, id) DO NOTHING`,
          [collection, SINGLETON_ID, JSON.stringify(value)],
        );
      } else if (Array.isArray(value)) {
        for (const item of value) {
          const row = item as { id?: string };
          await client.query(
            `INSERT INTO content (collection, id, data) VALUES ($1, $2, $3)
             ON CONFLICT (collection, id) DO NOTHING`,
            [collection, row.id ?? id(collection.slice(0, 3)), JSON.stringify(item)],
          );
        }
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* ------------------------------ reads ------------------------------ */

export async function listItems<T = Record<string, unknown>>(
  collection: CollectionKey,
): Promise<T[]> {
  await ensureDatabase();
  const { rows } = await pool().query<{ data: T }>(
    `SELECT data FROM content WHERE collection = $1 ORDER BY created_at ASC`,
    [collection],
  );
  return rows.map((r) => r.data);
}

/** Like listItems but merges the primary-key `id` column into each document. */
export async function listItemsWithId<T = Record<string, unknown>>(
  collection: CollectionKey,
): Promise<T[]> {
  await ensureDatabase();
  const { rows } = await pool().query<{ id: string; data: T }>(
    `SELECT id, data FROM content WHERE collection = $1 ORDER BY created_at ASC`,
    [collection],
  );
  return rows.map((r) => ({ ...(r.data as object), id: r.id }) as T);
}

export async function getItem<T = Record<string, unknown>>(
  collection: CollectionKey,
  itemId: string,
): Promise<T | undefined> {
  await ensureDatabase();
  const { rows } = await pool().query<{ data: T }>(
    `SELECT data FROM content WHERE collection = $1 AND id = $2 LIMIT 1`,
    [collection, itemId],
  );
  return rows[0]?.data;
}

export async function getSingleton<T>(name: "settings" | "homepage"): Promise<T> {
  await ensureDatabase();
  const { rows } = await pool().query<{ data: T }>(
    `SELECT data FROM content WHERE collection = $1 AND id = $2 LIMIT 1`,
    [name, SINGLETON_ID],
  );
  return rows[0]?.data as T;
}

/* ----------------------------- writes ------------------------------ */

export async function insertItem(
  collection: CollectionKey,
  itemId: string,
  data: unknown,
): Promise<void> {
  await ensureDatabase();
  await pool().query(
    `INSERT INTO content (collection, id, data) VALUES ($1, $2, $3)
     ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data`,
    [collection, itemId, JSON.stringify(data)],
  );
}

export async function updateItem(
  collection: CollectionKey,
  itemId: string,
  data: unknown,
): Promise<boolean> {
  await ensureDatabase();
  const { rowCount } = await pool().query(
    `UPDATE content SET data = $3 WHERE collection = $1 AND id = $2`,
    [collection, itemId, JSON.stringify(data)],
  );
  return (rowCount ?? 0) > 0;
}

export async function putSingleton(
  name: "settings" | "homepage",
  data: unknown,
): Promise<void> {
  await ensureDatabase();
  await insertItem(name, SINGLETON_ID, data);
}

export async function deleteItem(
  collection: CollectionKey,
  itemId: string,
): Promise<boolean> {
  await ensureDatabase();
  const { rowCount } = await pool().query(
    `DELETE FROM content WHERE collection = $1 AND id = $2`,
    [collection, itemId],
  );
  return (rowCount ?? 0) > 0;
}

/** Finds one item in a collection by a top-level JSON field. */
export async function findItemByField<T = Record<string, unknown>>(
  collection: CollectionKey,
  field: string,
  value: string,
): Promise<T | undefined> {
  await ensureDatabase();
  const { rows } = await pool().query<{ data: T }>(
    `SELECT data FROM content WHERE collection = $1 AND data->>$2 = $3 LIMIT 1`,
    [collection, field, value],
  );
  return rows[0]?.data;
}

export async function queryClient(): Promise<PoolClient> {
  await ensureDatabase();
  return pool().connect();
}

/* ------------------------------- media ---------------------------------- */

export interface MediaRow {
  id: string;
  filename: string;
  mime: string;
  bytes: number;
}

/** Stores an uploaded image in PostgreSQL and returns its serving URL. */
export async function saveMedia(
  filename: string,
  mime: string,
  data: Buffer,
): Promise<{ id: string; url: string }> {
  await ensureDatabase();
  const mediaId = id("m");
  await pool().query(
    `INSERT INTO media (id, filename, mime, bytes, data) VALUES ($1, $2, $3, $4, $5)`,
    [mediaId, filename.slice(0, 200), mime, data.length, data],
  );
  return { id: mediaId, url: `/api/media/${mediaId}` };
}

export async function getMedia(
  mediaId: string,
): Promise<(MediaRow & { data: Buffer }) | undefined> {
  await ensureDatabase();
  const { rows } = await pool().query<{
    id: string;
    filename: string;
    mime: string;
    bytes: number;
    data: Buffer;
  }>(`SELECT id, filename, mime, bytes, data FROM media WHERE id = $1 LIMIT 1`, [mediaId]);
  const row = rows[0];
  if (!row) return undefined;
  return row;
}
