import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import pg from "pg";

/**
 * Step 3: `npm run reset-demo` guarantees.
 *
 * These assertions are about the state the reset script is responsible for
 * producing, and about the script's contract — NOT about re-running the reset
 * itself. Running it here would truncate the very databases the rest of this
 * suite reads, so the destructive path is exercised manually/by an operator;
 * what is pinned down automatically is:
 *
 *  1. the schema-preservation contract (it must TRUNCATE/DELETE, never DROP),
 *  2. that the audit tables are in its clear-list, and
 *  3. that the deliberately messy demo records the script re-seeds are
 *     actually present in the source databases it seeds from.
 */
const SCRIPT = readFileSync(
  fileURLToPath(new URL("../../scripts/resetDemoData.ts", import.meta.url)),
  "utf-8"
);

describe("reset-demo: schema-preservation contract", () => {
  it("clears data only — it never drops tables, schemas, or databases", () => {
    // The whole point of the script is that migrations stay applied. A DROP
    // (or a migrate-down) would invalidate that guarantee.
    expect(SCRIPT).not.toMatch(/\bDROP\s+(TABLE|SCHEMA|DATABASE)\b/i);
    expect(SCRIPT).not.toMatch(/migrate:down|direction:\s*["']down["']/);
    // It must actually clear data.
    expect(SCRIPT).toMatch(/TRUNCATE TABLE/);
  });

  it("clears the audit tables' DATA (schema untouched), so a demo starts with an empty trail", () => {
    expect(SCRIPT).toMatch(/"audit_events"/);
    expect(SCRIPT).toMatch(/"audit_outbox"/);
    // Cleared by truncation, never by dropping/recreating them.
    expect(SCRIPT).not.toMatch(/DROP TABLE[\s\S]*audit_/i);
  });

  it("re-seeds via each source's own db:setup rather than duplicating seed logic", () => {
    // Source D in particular must go through its own setup, which validates
    // and encrypts sa_id_number before it reaches disk.
    expect(SCRIPT).toMatch(/db:setup/);
  });
});

describe("reset-demo: the messy demo records it restores", () => {
  const connect = (database: string) =>
    new pg.Pool({
      connectionString:
        process.env[`${database.toUpperCase()}_DATABASE_URL`] ??
        `postgres://postgres:postgres@localhost:5432/${database}`,
    });

  it("restores the four-way Palesa near-duplicate chain with its inconsistent spellings", async () => {
    const clinicA = connect("clinic_a");
    const hospitalB = connect("hospital_b");
    const sourceC = connect("dhis2_style_c");
    try {
      // Clinic A: "Palesa", with a national id.
      const a = await clinicA.query("SELECT first_name, national_id FROM patients WHERE patient_id = 'CA-006'");
      expect(a.rows[0].first_name).toBe("Palesa");
      expect(a.rows[0].national_id).toBe("SYN-9001015800044");

      // Hospital B: initials only ("P."), and deliberately NO national id —
      // the case deterministic matching cannot link.
      const b = await hospitalB.query("SELECT initials, surname, nat_id_no FROM pat_master WHERE hosp_no = 'HB-HN-30201'");
      expect(b.rows[0].initials).toBe("P.");
      expect(b.rows[0].surname).toBe("Zulu");
      expect(b.rows[0].nat_id_no).toBeNull();

      // Source C: a third spelling, "Palesah".
      const c = await sourceC.query(
        "SELECT value FROM tracked_entity_attributes WHERE tei_uid = 'TEI-006' AND attribute_code = 'firstName'"
      );
      expect(c.rows[0].value).toBe("Palesah");
    } finally {
      await Promise.all([clinicA.end(), hospitalB.end(), sourceC.end()]);
    }
  });

  it("restores the nullable/missing-field records the adapters must handle explicitly", async () => {
    const clinicA = connect("clinic_a");
    try {
      // CA-008 has no national_id at all (untraceable for deterministic matching).
      const noId = await clinicA.query("SELECT national_id FROM patients WHERE patient_id = 'CA-008'");
      expect(noId.rows[0].national_id).toBeNull();

      // CA-007 is missing both optional contact fields.
      const noContact = await clinicA.query("SELECT mobile, email FROM patients WHERE patient_id = 'CA-007'");
      expect(noContact.rows[0].mobile).toBeNull();
      expect(noContact.rows[0].email).toBeNull();
    } finally {
      await clinicA.end();
    }
  });
});
