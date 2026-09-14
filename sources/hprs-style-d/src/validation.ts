/**
 * South African ID number format validation: exactly 13 digits. This is
 * the "stricter required-field validation than the other three sources"
 * requirement — Source D refuses to write or serve a record whose id
 * number isn't shaped like a real SA ID number, unlike the other sources'
 * loosely-typed identifier strings.
 */
export function isValidSaIdNumberFormat(value: string): boolean {
  return /^\d{13}$/.test(value);
}
