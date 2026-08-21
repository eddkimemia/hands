/**
 * Ensures a PostgreSQL server is reachable for the app.
 *
 * - If DATABASE_URL points at a remote host → just verify connectivity.
 * - Otherwise (local dev) → boot the embedded PostgreSQL daemon on
 *   localhost:5433 with data stored in ./.pgdata (created on first run).
 *
 * The daemon keeps running after this script exits, so `next dev` /
 * `next start` can connect immediately.
 */
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";
import fs from "node:fs";

// Load .env manually (this script runs before Next.js is up).
const envPath = path.resolve(".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const DEFAULT_URL = "postgres://postgres:password@localhost:5433/handsofhope";
const conn = process.env.DATABASE_URL || DEFAULT_URL;

function parseTarget(url) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname || "localhost",
      port: Number(u.port || 5432),
      user: decodeURIComponent(u.username || "postgres"),
      password: decodeURIComponent(u.password || "password"),
      database: (u.pathname || "/").slice(1) || "handsofhope",
    };
  } catch {
    return { host: "localhost", port: 5433, user: "postgres", password: "password", database: "handsofhope" };
  }
}

const target = parseTarget(conn);
const isLocal = ["localhost", "127.0.0.1", "::1"].includes(target.host);

function tryConnect(host, port, timeout = 1500) {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const done = (ok) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeout);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

async function waitForPort(host, port, minutes = 3) {
  const deadline = Date.now() + minutes * 60_000;
  while (Date.now() < deadline) {
    if (await tryConnect(host, port, 2000)) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  if (await tryConnect(target.host, target.port)) {
    console.log(`[db] PostgreSQL already reachable at ${target.host}:${target.port}`);
    return;
  }

  if (!isLocal) {
    console.error(`[db] Cannot reach DATABASE_URL at ${target.host}:${target.port}. Is the server running?`);
    process.exit(1);
  }

  // Boot the embedded PostgreSQL daemon for local development.
  const dataDir = path.resolve(".pgdata");
  const pidFile = path.join(dataDir, ".launcher-pid");

  // Clean up a stale launcher pid if the process is gone.
  try {
    const pid = Number(fs.readFileSync(pidFile, "utf-8"));
    if (pid && !process.kill(pid, 0)) fs.unlinkSync(pidFile);
  } catch {
    /* no pid file or process gone */
  }

  console.log("[db] Starting embedded PostgreSQL (first run initialises a fresh cluster)…");
  const child = spawn(
    process.execPath,
    [path.resolve("scripts/db-daemon.mjs")],
    {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
      env: { ...process.env, HH_PG_DATA: dataDir, HH_PG_PORT: String(target.port), HH_PG_DB: target.database },
    },
  );
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(pidFile, String(child.pid));
  child.unref();

  const ready = await waitForPort(target.host, target.port, 4);
  if (!ready) {
    console.error("[db] Embedded PostgreSQL failed to start in time. Run `npm run db` to see logs.");
    process.exit(1);
  }
  console.log(`[db] PostgreSQL ready at ${target.host}:${target.port} (database: ${target.database})`);
}

main().catch((err) => {
  console.error("[db]", err);
  process.exit(1);
});
