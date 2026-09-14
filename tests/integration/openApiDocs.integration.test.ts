import { describe, expect, it } from "vitest";

/**
 * Step 1 verification: /docs is a real, browsable OpenAPI document listing
 * every actual route, and a documented example request (issue a consent
 * token, then query a patient with it) can be executed successfully purely
 * via HTTP — the same mechanics Swagger UI's "Try it out" uses under the
 * hood. Requires the real backend running on BACKEND_PORT (default 3010)
 * with Postgres and the five source APIs up, same as the other integration
 * tests in this folder.
 */
const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT ?? 3010}`;

describe("OpenAPI docs endpoint", () => {
  it("/docs/json returns a valid OpenAPI document listing all three real routes", async () => {
    const response = await fetch(`${BACKEND_URL}/docs/json`);
    expect(response.status).toBe(200);

    const doc = (await response.json()) as {
      openapi: string;
      info: { title: string };
      paths: Record<string, { get?: { parameters?: { name: string }[] } }>;
    };
    expect(doc.openapi).toMatch(/^3\.1/);
    expect(doc.info.title).toContain("SA Health");

    const paths = Object.keys(doc.paths);
    expect(paths).toContain("/consent/tokens");
    expect(paths).toContain("/patients/{nationalId}");
    expect(paths).toContain("/patients/{nationalId}/audit-trail");
    expect(paths).toContain("/health");
    expect(paths).toContain("/healthz");

    // The query route's matchingMode parameter is documented.
    const queryParams = doc.paths["/patients/{nationalId}"].get?.parameters ?? [];
    expect(queryParams.some((p) => p.name === "matching")).toBe(true);
  });

  it("/docs (the Swagger UI page itself) is reachable", async () => {
    const response = await fetch(`${BACKEND_URL}/docs`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
  });

  it("a documented example flow (issue consent token, then query with it) executes successfully via plain HTTP — the same mechanics Swagger UI's 'Try it out' uses", async () => {
    const tokenResponse = await fetch(`${BACKEND_URL}/consent/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestingParty: "dr-jane",
        patientId: "SYN-8801015800083",
        scopes: ["Patient", "Encounter", "Observation", "MedicationStatement"],
        purpose: "treatment",
      }),
    });
    expect(tokenResponse.status).toBe(201);
    const { token } = (await tokenResponse.json()) as { token: string };
    expect(typeof token).toBe("string");

    const queryResponse = await fetch(`${BACKEND_URL}/patients/SYN-8801015800083`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(queryResponse.status).toBe(200);
    const result = (await queryResponse.json()) as { patient: unknown; matchingMode: string };
    expect(result.patient).not.toBeNull();
    expect(result.matchingMode).toBe("deterministic");
  });
});
