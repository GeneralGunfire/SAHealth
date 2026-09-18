import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

/**
 * One-command demo-data reset (`npm run reset-demo`).
 *
 * Puts the whole demo back to a known-clean state: every source system and
 * the backend's own tables are emptied, then each source's existing seed data
 * is re-applied — including the deliberately messy records (the Palesa
 * near-duplicate chain, nullable/missing fields, inconsistent date and
 * identifier formats) that the matching and honest-disclosure demos depend on.
 *
 * DATA ONLY. Schemas, tables and indexes are never dropped and migrations stay
 * applied: this TRUNCATEs, it does not migrate down. The audit tables
 * (audit_events, audit_outbox) keep their schema untouched but have their rows
 * cleared, so a demo starts with a genuinely empty audit trail rather than
 * leftover rows from manual testing.
 *
 * Re-seeding delegates to each source's own existing `db:setup` script rather
 * than duplicating any seed logic here — Source D in particular must be seeded
 * through its own setup, which validates and encrypts sa_id_number before it
 * reaches disk.
 */

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));

/** The backend's own database: everything the demo writes, including audit. */
const BACKEND_URL = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/sa_health";
const BACKEND_TABLES = [
  "patients",
  "encounters",
  "observations",
  "medication_statements",
  // Schema preserved; rows cleared so the audit trail starts empty.
  "audit_events",
  "audit_outbox",
];

/**
 * The four Postgres-backed sources. Source D is absent here deliberately: it
 * is SQLite (better-sqlite3), has no connection URL, and is reset by deleting
 * its database file below.
 */
const POSTGRES_SOURCES = [
  {
    id: "clinic-a",
    dir: "sources/clinic-a-api",
    url: process.env.CLINIC_A_DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/clinic_a",
    tables: ["patients", "visits", "lab_results", "medications"],
  },
  {
    id: "hospital-b",
    dir: "sources/hospital-b-api",
    url: process.env.HOSPITAL_B_DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/hospital_b",
    tables: ["pat_master", "admissions", "obs_tbl", "rx_tbl"],
  },
  {
    id: "dhis2-style-c",
    dir: "sources/dhis2-style-c",
    url: process.env.DHIS2_STYLE_C_DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/dhis2_style_c",
    tables: [
      "event_data_values",
      "events",
      "enrollments",
      "tracked_entity_attributes",
      "tracked_entities",
      "aggregate_reports",
      "org_units",
    ],
  },
  {
    id: "pharmacy-e",
    dir: "sources/pharmacy-e-api",
    url: process.env.PHARMACY_E_DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/pharmacy_e",
    tables: ["dispensing_records", "patients"],
  },
];

/**
 * TRUNCATE every listed table in one statement. CASCADE handles the foreign
 * keys between them, and RESTART IDENTITY resets serial counters so a reset
 * demo produces the same ids every time instead of drifting upward on each run.
 */
async function truncate(connectionString: string, tables: string[], label: string): Promise<void> {
  const pool = new pg.Pool({ connectionString });
  try {
    const list = tables.map((t) => `"${t}"`).join(", ");
    await pool.query(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
    console.log(`  cleared ${label}: ${tables.length} tables`);
  } finally {
    await pool.end();
  }
}

/**
 * Clears Source D's SQLite tables in place, child tables first so the
 * foreign keys its schema enables stay satisfied. The database file, its
 * schema and its applied migrations are all left intact; only rows go.
 * If the file doesn't exist yet, there is nothing to clear — its own
 * db:setup creates and migrates it during the re-seed below.
 */
function clearSqliteSourceD(): void {
  const sqlitePath = path.join(REPO_ROOT, "sources", "hprs-style-d", "hprs-style-d.sqlite");
  if (!existsSync(sqlitePath)) {
    console.log("  hprs-style-d: no database file yet — it will be created and seeded below");
    return;
  }

  // better-sqlite3 is a native module owned by the hprs-style-d package, not
  // a backend dependency — so this runs inside that package rather than
  // adding a native build to the backend purely for a reset script. Same
  // delegation principle as reseed() below.
  //
  // Order matters: diagnoses -> visits, and medication_records/visits ->
  // patients. snomed_code_list is standalone but is re-inserted by seed.sql,
  // so it must be cleared too or the re-seed hits a uniqueness conflict.
  const clearScript = `
    const Database = require("better-sqlite3");
    const db = new Database(${JSON.stringify(sqlitePath)});
    for (const t of ["diagnoses", "visits", "medication_records", "patients", "snomed_code_list"]) {
      db.prepare("DELETE FROM " + t).run();
    }
    db.close();
  `;
  execFileSync("node", ["-e", clearScript], {
    cwd: path.join(REPO_ROOT, "sources", "hprs-style-d"),
    stdio: "inherit",
  });
  console.log("  cleared hprs-style-d: 5 tables (schema and migrations preserved)");
}

/** Runs a source package's own `npm run db:setup` (migrate if needed, then seed). */
function reseed(dir: string, id: string): void {
  // hprs-style-d encrypts sa_id_number at rest with SA_ID_ENCRYPTION_KEY.
  // Re-seeding re-encrypts every ID under whatever key is set HERE, so if that
  // differs from the key the running source service was started with, the
  // service can still serve rows but fails to decrypt them ("Unsupported state
  // or unable to authenticate data") — a confusing, purely-operational break.
  // Rather than silently invent a default and cause that mismatch, refuse to
  // run and let the operator set the same key the service uses.
  if (id === "hprs-style-d" && !process.env.SA_ID_ENCRYPTION_KEY) {
    throw new Error(
      "SA_ID_ENCRYPTION_KEY is not set. Source D encrypts sa_id_number at rest, and re-seeding " +
        "re-encrypts it under this key — it must be the SAME key the hprs-style-d service runs with, " +
        "or that service will not be able to decrypt the data it just got. Set SA_ID_ENCRYPTION_KEY " +
        "and re-run."
    );
  }

  execFileSync("npm", ["run", "db:setup", "--prefix", dir], {
    cwd: REPO_ROOT,
    stdio: "inherit",
    shell: process.platform === "win32", // npm resolves via npm.cmd on Windows
  });
}

async function main(): Promise<void> {
  console.log("Resetting demo data (data only — schemas and migrations are left in place)\n");

  console.log("Clearing the backend's own tables...");
  await truncate(BACKEND_URL, BACKEND_TABLES, "backend (incl. audit_events, audit_outbox)");

  console.log("\nClearing the four Postgres source databases...");
  for (const source of POSTGRES_SOURCES) {
    await truncate(source.url, source.tables, source.id);
  }

  // Source D is SQLite. Its rows are DELETEd in place rather than the file
  // being removed: on Windows the running source service holds an open handle
  // to it, so deleting would fail with EPERM, and clearing in place also means
  // that service keeps serving the freshly seeded data without a restart.
  // Schema is preserved either way — this is a data reset, not a migration.
  console.log("\nClearing Source D (SQLite)...");
  clearSqliteSourceD();

  console.log("\nRe-seeding all five sources from their existing seed data...\n");
  for (const source of POSTGRES_SOURCES) {
    reseed(source.dir, source.id);
  }
  reseed("sources/hprs-style-d", "hprs-style-d");

  console.log("\nDemo data reset complete.");
  console.log(
    "Note: if the hprs-style-d service is running, restart it — better-sqlite3 holds an open\n" +
      "handle to the database file, so it may keep serving the pre-reset snapshot."
  );
}

main().catch((err) => {
  console.error("\nDemo data reset FAILED:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
