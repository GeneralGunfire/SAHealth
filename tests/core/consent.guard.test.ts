import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Fastify, { type FastifyInstance } from "fastify";
import { issueConsentToken } from "../../src/core/consent/issueToken.js";
import { consentGuard } from "../../src/core/consent/consentGuard.js";
import * as auditRepo from "../../src/core/audit/auditRepo.js";

/**
 * These tests exercise consentGuard as a Fastify preHandler in isolation,
 * without a real Postgres instance: audit writes are stubbed at the
 * `record` function boundary so we can assert *what* would have been
 * logged without needing a database for this unit-level test.
 */
describe("consentGuard", () => {
  let app: FastifyInstance;
  let recordSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    recordSpy = vi.spyOn(auditRepo, "record").mockImplementation(() => {});
    app = Fastify();
    app.get("/patients/:nationalId", { preHandler: consentGuard() }, async (request, reply) => {
      return reply.send({ ok: true, actor: request.consentClaims?.sub });
    });
  });

  afterEach(async () => {
    recordSpy.mockRestore();
    await app.close();
  });

  it("allows a request with a valid, correctly-scoped token", async () => {
    const { token } = await issueConsentToken({
      requestingParty: "dr-jane",
      patientId: "SYN-8801015800083",
      scopes: ["Patient", "Encounter", "Observation", "MedicationStatement"],
      purpose: "treatment",
    });

    const response = await app.inject({
      method: "GET",
      url: "/patients/SYN-8801015800083",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true, actor: "dr-jane" });
  });

  it("rejects a request with no token and logs the rejection reason", async () => {
    const response = await app.inject({ method: "GET", url: "/patients/SYN-8801015800083" });

    expect(response.statusCode).toBe(401);
    expect(response.json().error.details.reason).toBe("missing-token");
    expect(recordSpy).toHaveBeenCalledWith(
      expect.objectContaining({ operation: "token-validation-failure", detail: expect.objectContaining({ reason: "missing-token" }) })
    );
  });

  it("rejects an expired token and logs 'expired' as the reason", async () => {
    const { token } = await issueConsentToken({
      requestingParty: "dr-jane",
      patientId: "SYN-8801015800083",
      scopes: ["Patient"],
      purpose: "treatment",
      expiresInSeconds: -1, // already expired
    });

    const response = await app.inject({
      method: "GET",
      url: "/patients/SYN-8801015800083",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json().error.details.reason).toBe("expired");
    expect(recordSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ reason: "expired" }) })
    );
  });

  it("rejects a token scoped to the wrong resource type and logs 'scope-mismatch'", async () => {
    const { token } = await issueConsentToken({
      requestingParty: "dr-jane",
      patientId: "SYN-8801015800083",
      scopes: ["Observation"], // missing Patient/Encounter/MedicationStatement, required by default guard
      purpose: "treatment",
    });

    const response = await app.inject({
      method: "GET",
      url: "/patients/SYN-8801015800083",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().error.details.reason).toBe("scope-mismatch");
    expect(recordSpy).toHaveBeenCalledWith(
      expect.objectContaining({ actor: "dr-jane", detail: expect.objectContaining({ reason: "scope-mismatch" }) })
    );
  });

  it("rejects a token issued for a different patient", async () => {
    const { token } = await issueConsentToken({
      requestingParty: "dr-jane",
      patientId: "SYN-SOMEONE-ELSE",
      scopes: ["Patient", "Encounter", "Observation", "MedicationStatement"],
      purpose: "treatment",
    });

    const response = await app.inject({
      method: "GET",
      url: "/patients/SYN-8801015800083",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().error.details.reason).toBe("patient-mismatch");
  });
});
