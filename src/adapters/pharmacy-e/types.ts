/**
 * Pharmacy E's native data shape — a dispensing feed, not an EMR/encounter
 * system. There is no encounter or observation concept in this source at
 * all: a patient has demographics and a list of dispensed prescriptions,
 * full stop. Dates use pharmacy-style "DD-MMM-YYYY" formatting, and a
 * dispensed item may be either coded against Pharmacy E's own formulary or
 * free text only (common for OTC items with no code on file).
 *
 * This shape started life as an AI-generated first draft (see
 * docs/ai-assisted-adapter-generation.md for the full, honest review of
 * what OmniRoute got right and wrong) and was corrected by hand before
 * being accepted here.
 */

export interface PharmacyEPatient {
  pid: string;
  sur: string; // surname
  gv: string; // given name
  dob: string; // "DD-MMM-YYYY", e.g. "15-MAR-1979"
  sx: "M" | "F" | string; // observed values are M/F; kept as string since a real feed could send other codes
  cell: string | null;
  nid: string | null; // nullable: not every patient has a synthetic national id on file
}

export interface PharmacyERx {
  rxid: string;
  pid: string;
  drugcd: string | null; // nullable: OTC items are sometimes dispensed with no formulary code
  drugnm: string;
  qtydisp: number;
  dayssup: number;
  sig: string; // clinician-facing dosing instruction, e.g. "1 tab nocte", "1 tab bd"
  dtdisp: string; // "DD-MMM-YYYY"
  rxstat: "DISP" | "CANC" | string; // observed values; kept as string for forward-compatibility with unseen codes
}

export interface PharmacyERawPatient {
  pat: PharmacyEPatient;
  rx: PharmacyERx[];
}
