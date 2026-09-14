import { SignJWT } from "jose";
import { consentTokenClaimsSchema, type ConsentResourceType } from "../../canonical/index.js";
import { consentSigningKey } from "./signingKey.js";
import { record } from "../audit/auditRepo.js";

export interface IssueTokenInput {
  requestingParty: string;
  patientId: string;
  scopes: ConsentResourceType[];
  purpose: string;
  /** Token lifetime in seconds. Defaults to 15 minutes — short-lived, per Section 4.3. */
  expiresInSeconds?: number;
}

export interface IssuedToken {
  token: string;
  claims: {
    sub: string;
    patientId: string;
    scopes: ConsentResourceType[];
    purpose: string;
    iat: number;
    exp: number;
  };
}

/**
 * Simulates a patient consent action (Section 4.3): issues a signed,
 * scope-and-time-limited JWT. Issuance itself is an auditable event —
 * its issuance, use, and (implicitly, via expiry) end are all recorded.
 */
export async function issueConsentToken(input: IssueTokenInput): Promise<IssuedToken> {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const expiresIn = input.expiresInSeconds ?? 15 * 60;

  const claims = consentTokenClaimsSchema.parse({
    sub: input.requestingParty,
    patientId: input.patientId,
    scopes: input.scopes,
    purpose: input.purpose,
    iat: nowSeconds,
    exp: nowSeconds + expiresIn,
  });

  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(claims.iat)
    .setExpirationTime(claims.exp)
    .sign(consentSigningKey);

  record({
    operation: "token-issue",
    occurredAt: new Date().toISOString(),
    actor: claims.sub,
    patientId: claims.patientId,
    outcome: "success",
    purpose: claims.purpose,
    resourceTypes: claims.scopes,
    detail: { contributingSources: [], failedSources: [], reason: null },
  });

  return { token, claims };
}
