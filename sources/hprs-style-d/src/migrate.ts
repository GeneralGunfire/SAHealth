import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { db } from "./db.js";

/**
 * Step 4: Source D is SQLite, not Postgres, so node-pg-migrate does not
 * apply — this is the "lightweight equivalent... plain versioned SQL files
 * run in order" alternative for the SQLite storage engine. Each file in
 * ../migrations/ is named NNN_description.sql; applied migrations are
 * tracked in schema_migrations so re-running this is a no-op once a
 * migration has been applied (idempotent/re-runnable, matching
 * node-pg-migrate's guarantee for the four Postgres sources).
 */
export function runMigrations(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const migrationsDir = fileURLToPath(new URL("../migrations", import.meta.url));
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort(); // filenames are zero-padded, e.g. 001_init.sql, 002_add_x.sql — lexical sort is chronological order

  const alreadyApplied = new Set(
    db.prepare("SELECT name FROM schema_migrations").all().map((row) => (row as { name: string }).name)
  );

  const markApplied = db.prepare("INSERT INTO schema_migrations (name) VALUES (?)");

  for (const file of files) {
    if (alreadyApplied.has(file)) continue;
    const sql = readFileSync(`${migrationsDir}/${file}`, "utf-8");
    const applyMigration = db.transaction(() => {
      db.exec(sql);
      markApplied.run(file);
    });
    applyMigration();
    console.log(`Applied migration: ${file}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runMigrations();
  console.log("Source D (HPRS-style, SQLite) migrations complete.");
}
