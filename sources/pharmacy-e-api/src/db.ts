import pg from "pg";

const { Pool } = pg;

// Pharmacy E's dates are stored as plain TEXT ("DD-MMM-YYYY"), not a
// Postgres DATE column, so no type-parser override is needed here — unlike
// clinic-a-api's db.ts, which had to override the DATE parser to avoid a
// UTC/local-midnight shift. Pharmacy E's own native format is already a
// non-standard string; the adapter's translate() function is what parses it.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/pharmacy_e",
});
