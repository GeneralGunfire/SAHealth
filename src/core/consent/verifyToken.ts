import { jwtVerify, errors as joseErrors } from "jose";
import { consentTokenClaimsSchema, type ConsentTokenClaims, type ConsentResourceType } from "../../canonical/index.js";
import { consentSigningKey } from "./signingKey.js";

export type ConsentRejectionReason =
  | "missing-token"
  | "invalid-signature"
  | "expired"
  | "malformed-claims"
  | "patient-mismatch"
  | "scope-mismatch";

export type VerifyResult =
  | { ok: true; claims: ConsentTokenClaims }
  | { ok: false; reason: ConsentRejectionReason; message: string };

/**
 * Verifies signature and expiry only (structural validity of the token
 * itself). Scope/patient matching against a specific request is a separate
 * step (`checkScope`) so callers can distinguish "bad token" from
 * "token doesn't cover what you asked for" — both are logged with a
 * different reason.
 */
export async function verifyConsentToken(token: string | undefined): Promise<VerifyResult> {
  if (!token) {
    return { ok: false, reason: "missing-token", message: "No bearer token provided." };
  }

  try {
    const { payload } = await jwtVerify(token, consentSigningKey);
    const claims = consentTokenClaimsSchema.parse(payload);
    return { ok: true, claims };
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      return { ok: false, reason: "expired", message: "Consent token has expired." };
    }
    if (err instanceof joseErrors.JWSSignatureVerificationFailed || err instanceof joseErrors.JWSInvalid) {
      return { ok: false, reason: "invalid-signature", message: "Consent token signature is invalid." };
    }
    return {
      ok: false,
      reason: "malformed-claims",
      message: err instanceof Error ? err.message : "Consent token could not be parsed.",
    };
  }
}

/**
 * Checks that a verified token's scope covers the requested patient and
 * resource types. Kept separate from signature/expiry verification so the
 * two failure classes are logged distinctly, matching the spec's "wrong
 * scope" vs "invalid signature" vs "expired" audit-reason requirement.
 */
export function checkScope(
  claims: ConsentTokenClaims,
  requestedPatientId: string,
  requestedResourceTypes: ConsentResourceType[]
): { ok: true } | { ok: false; reason: ConsentRejectionReason; message: string } {
  if (claims.patientId !== requestedPatientId) {
    return { ok: false, reason: "patient-mismatch", message: "Token does not cover the requested patient." };
  }

  const missing = requestedResourceTypes.filter((rt) => !claims.scopes.includes(rt));
  if (missing.length > 0) {
    return {
      ok: false,
      reason: "scope-mismatch",
      message: `Token does not cover resource type(s): ${missing.join(", ")}.`,
    };
  }

  return { ok: true };
}
