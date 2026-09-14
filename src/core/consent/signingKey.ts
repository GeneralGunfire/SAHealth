/**
 * Phase 1/2 prototype signing key. A real deployment would use an
 * asymmetric key pair and key rotation; HS256 with an env-provided secret
 * is judged sufficient for a Science Expo prototype demonstrating the
 * consent-token *mechanism*, not production key management.
 *
 * Step 3: no hardcoded fallback. src/config/env.ts validates
 * CONSENT_TOKEN_SIGNING_KEY is present at process startup (before this
 * module is ever imported), so by the time this line runs the env var is
 * guaranteed set — the non-null assertion documents that guarantee rather
 * than re-checking it.
 */
const secret = process.env.CONSENT_TOKEN_SIGNING_KEY!;

export const consentSigningKey = new TextEncoder().encode(secret);
