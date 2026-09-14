/**
 * Source C's native data shape — genuinely DHIS2-style, not a relabelled
 * patient-record shape. Demographics are attribute key/value pairs, not
 * dedicated columns; clinical content within an event is itself a set of
 * loose data-element key/value pairs rather than fixed fields.
 */

export interface Dhis2AttributeValue {
  code: string; // e.g. 'firstName', 'lastName', 'nationalId', 'sex', 'dob', 'phone'
  value: string | null;
}

export interface Dhis2TrackedEntity {
  teiUid: string;
  orgUnitUid: string;
  attributes: Dhis2AttributeValue[];
}

export interface Dhis2Enrollment {
  enrollmentUid: string;
  teiUid: string;
  programCode: string; // e.g. 'CHRONIC_CARE', 'MATERNAL_HEALTH', 'IMMUNIZATION'
  orgUnitUid: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  enrollmentDate: string; // "YYYY-MM-DD", no time/zone
}

export interface Dhis2DataValue {
  code: string; // e.g. 'DIAGNOSIS_CODE', 'GLUCOSE_VALUE', 'GLUCOSE_UNIT', 'MEDICATION_TEXT', 'VISIT_NOTE'
  value: string | null;
}

export interface Dhis2Event {
  eventUid: string;
  enrollmentUid: string;
  programStage: string; // e.g. 'ANC_VISIT', 'LAB_STAGE', 'IMMUNIZATION_DOSE'
  orgUnitUid: string;
  status: "ACTIVE" | "COMPLETED" | "SKIPPED" | "SCHEDULE";
  eventDate: string; // "YYYY-MM-DD", no time/zone
  dataValues: Dhis2DataValue[];
}

export interface Dhis2RawPatient {
  trackedEntity: Dhis2TrackedEntity;
  enrollments: Dhis2Enrollment[];
  events: Dhis2Event[];
}
