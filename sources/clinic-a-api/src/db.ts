import pg from "pg";

const { Pool, types } = pg;

// Postgres DATE (OID 1082) is a calendar date with no timezone. pg's default
// parser converts it to a JS Date at local midnight, which then gets
// re-interpreted in UTC elsewhere and silently shifts by a day depending on
// the server's timezone offset (observed: 1988-01-01 became 1987-12-31 on a
// UTC+2 host). Returning the raw "YYYY-MM-DD" string avoids that entirely —
// this service formats dates itself and never needs a JS Date for DATE columns.
types.setTypeParser(types.builtins.DATE, (value: string) => value);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/clinic_a",
});
