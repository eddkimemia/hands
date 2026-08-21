/**
 * Long-lived embedded PostgreSQL daemon (spawned detached by scripts/db.mjs).
 * Initialises the cluster and database if needed, then stays alive.
 */
import EmbeddedPostgres from "embedded-postgres";

const dataDir = process.env.HH_PG_DATA || ".pgdata";
const port = Number(process.env.HH_PG_PORT || 5433);
const database = process.env.HH_PG_DB || "handsofhope";

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "password",
  port,
  persistent: true,
});

try {
  await pg.initialise();
} catch (err) {
  // Cluster may already exist from a previous run.
  if (!String(err).includes("already exists")) {
    console.error("[db-daemon] initialise:", err);
  }
}

await pg.start();

try {
  await pg.createDatabase(database);
} catch (err) {
  // Database may already exist.
  if (!String(err).includes("already exists")) {
    console.error("[db-daemon] createDatabase:", err);
  }
}

console.log(`[db-daemon] PostgreSQL listening on :${port} (data: ${dataDir})`);

const shutdown = async () => {
  try {
    await pg.stop();
  } catch {}
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
