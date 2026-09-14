import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

/**
 * Field-level encryption for SA ID numbers, scoped narrowly to this one
 * column — not whole-database or whole-disk encryption. This is the
 * SQLite-side equivalent of pgcrypto's pgp_sym_encrypt/decrypt (Source D
 * uses SQLite by design, per Step 1's storage-engine-agnostic requirement,
 * so pgcrypto itself — a PostgreSQL extension — does not apply here; this
 * targets the same narrow, POPIA-motivated safeguard at the application
 * layer instead).
 *
 * Uses AES-256-GCM with a DETERMINISTIC nonce derived via HMAC-SHA256 of
 * the plaintext (under a separate derived subkey from the encryption key),
 * rather than a random nonce. This is a deliberate trade-off: sa_id_number
 * carries a UNIQUE constraint, and a random-nonce scheme would make the
 * same SA ID number encrypt to different ciphertext on every write,
 * silently breaking that uniqueness check. Deterministic nonce derivation
 * preserves DB-level uniqueness enforcement on the ciphertext, at the
 * standard, accepted cost of deterministic encryption: two rows with the
 * same plaintext produce identical ciphertext (which is exactly what the
 * UNIQUE constraint needs to detect).
 */

const ENCRYPTION_KEY_ENV = "SA_ID_ENCRYPTION_KEY";

function getKeyMaterial(): Buffer {
  const secret = process.env[ENCRYPTION_KEY_ENV];
  if (!secret) {
    throw new Error(
      `${ENCRYPTION_KEY_ENV} is not set. A 32-byte (or longer) secret is required to encrypt/decrypt sa_id_number.`
    );
  }
  // Derive a fixed-length 32-byte key from whatever-length secret is provided.
  return createHmac("sha256", "sa-health-hprs-d-key-derivation").update(secret).digest();
}

function getNonceKey(): Buffer {
  const secret = process.env[ENCRYPTION_KEY_ENV] ?? "";
  return createHmac("sha256", "sa-health-hprs-d-nonce-derivation").update(secret).digest();
}

/** Encrypts a plaintext SA ID number. Same input always produces the same ciphertext (see module doc). */
export function encryptSaIdNumber(plaintext: string): string {
  const key = getKeyMaterial();
  const nonce = createHmac("sha256", getNonceKey()).update(plaintext).digest().subarray(0, 12);

  const cipher = createCipheriv("aes-256-gcm", key, nonce);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Stored format: base64(nonce).base64(authTag).base64(ciphertext)
  return `${nonce.toString("base64")}.${authTag.toString("base64")}.${ciphertext.toString("base64")}`;
}

/** Decrypts a value previously produced by encryptSaIdNumber. Throws if the value has been tampered with. */
export function decryptSaIdNumber(stored: string): string {
  const key = getKeyMaterial();
  const [nonceB64, authTagB64, ciphertextB64] = stored.split(".");
  if (!nonceB64 || !authTagB64 || !ciphertextB64) {
    throw new Error("Stored sa_id_number value is not in the expected encrypted format.");
  }

  const nonce = Buffer.from(nonceB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");

  const decipher = createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}

/** Only used by tests wanting a throwaway random key without setting an env var. */
export function generateDevKey(): string {
  return randomBytes(32).toString("hex");
}
