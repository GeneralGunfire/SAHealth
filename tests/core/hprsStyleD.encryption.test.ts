import { describe, expect, it, beforeAll } from "vitest";

/**
 * Round-trip verification for Source D's field-level SA ID number
 * encryption (Task: field-level encryption for SA ID numbers). Imports the
 * encryption module directly from the source service, since Source D has
 * no test infrastructure of its own — every other cross-cutting
 * verification in this project already lives in the main backend's test
 * suite.
 */
describe("Source D SA ID number field-level encryption", () => {
  beforeAll(() => {
    process.env.SA_ID_ENCRYPTION_KEY = "test-only-encryption-key-not-for-real-use";
  });

  it("encrypts a plaintext SA ID number to ciphertext that does not resemble the original", async () => {
    const { encryptSaIdNumber } = await import("../../sources/hprs-style-d/src/encryption.js");
    const ciphertext = encryptSaIdNumber("8801015800083");

    expect(ciphertext).not.toBe("8801015800083");
    expect(ciphertext).not.toContain("8801015800083");
    expect(/^\d{13}$/.test(ciphertext)).toBe(false);
  });

  it("decrypts back to the exact original plaintext", async () => {
    const { encryptSaIdNumber, decryptSaIdNumber } = await import("../../sources/hprs-style-d/src/encryption.js");
    const original = "9001019800089";
    const ciphertext = encryptSaIdNumber(original);
    expect(decryptSaIdNumber(ciphertext)).toBe(original);
  });

  it("is deterministic: the same plaintext always encrypts to the same ciphertext, preserving DB-level uniqueness", async () => {
    const { encryptSaIdNumber } = await import("../../sources/hprs-style-d/src/encryption.js");
    const a = encryptSaIdNumber("8801015800083");
    const b = encryptSaIdNumber("8801015800083");
    expect(a).toBe(b);
  });

  it("produces different ciphertext for different plaintexts", async () => {
    const { encryptSaIdNumber } = await import("../../sources/hprs-style-d/src/encryption.js");
    const a = encryptSaIdNumber("8801015800083");
    const b = encryptSaIdNumber("9001019800089");
    expect(a).not.toBe(b);
  });

  it("throws on decryption if the ciphertext has been tampered with", async () => {
    const { encryptSaIdNumber, decryptSaIdNumber } = await import("../../sources/hprs-style-d/src/encryption.js");
    const ciphertext = encryptSaIdNumber("8801015800083");
    const [nonce, authTag, body] = ciphertext.split(".");
    const tampered = `${nonce}.${authTag}.${body.slice(0, -2)}AA`; // corrupt the ciphertext body

    expect(() => decryptSaIdNumber(tampered)).toThrow();
  });
});
