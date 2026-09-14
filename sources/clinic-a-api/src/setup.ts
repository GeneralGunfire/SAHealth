import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runner } from "node-pg-migrate";
import { pool } from "./db.js";

/**
 * Step 4: schema is now owned by node-pg-migrate (see ../migrations/), run
 * here via its Node API rather than shelling out, so `npm run db:setup`
 * still does one thing: schema, then seed data. Seeding itself (seed.sql)
 * is data, not schema, and stays outside the migration system.
 */
async function setup() {
  await runner({
    databaseUrl: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/clinic_a",
    dir: fileURLToPath(new URL("../migrations", import.meta.url)),
    direction: "up",
    migrationsTable: "pgmigrations",
    checkOrder: false,
  });

  const seed = readFileSync(fileURLToPath(new URL("../seed.sql", import.meta.url)), "utf-8");
  await pool.query(seed);
  console.log("Clinic A database migrated and seeded.");
  await pool.end();
}

setup().catch((err) => {
  console.error("Clinic A DB setup failed:", err);
  process.exitCode = 1;
});
