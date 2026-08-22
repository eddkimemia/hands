/**
 * One-time content enrichment: applies long-form program content from
 * src/data/enriched-programs.json to the live PostgreSQL database.
 *
 * Run:  node scripts/enrich-programs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

const envPath = path.resolve(".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const conn =
  process.env.DATABASE_URL || "postgres://postgres:password@localhost:5433/handsofhope";

const programs = JSON.parse(
  fs.readFileSync(path.resolve("src/data/enriched-programs.json"), "utf-8"),
);

const client = new Client({ connectionString: conn });
await client.connect();

for (const p of programs) {
  const { rows } = await client.query(
    `SELECT id FROM content WHERE collection='programs' AND data->>'slug'=$1`,
    [p.slug],
  );
  if (!rows.length) {
    console.log(`skip (not found): ${p.slug}`);
    continue;
  }
  await client.query(`UPDATE content SET data = data || $2::jsonb WHERE collection='programs' AND data->>'slug'=$1`, [
    p.slug,
    JSON.stringify(p),
  ]);
  console.log(`enriched: ${p.slug} (row ${rows[0].id})`);
}

await client.end();
console.log("Done.");
