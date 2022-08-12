import {
  NewPatient,
  NewEntry,
  NewBaseEntry,
  Diagnosis,
  Gender,
  HealthCheckRating,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (str: unknown, paramName: string): string => {
  if (!str || !isString(str)) {
    throw new Error(`Incorrect or missing ${paramName}`);
  }

  return str;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (hcr: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(hcr)) {
    throw new Error("Incorrect or missing health check rating: " + hcr);
  }
  return hcr;
};

function parseArray<T>(
  array: unknown,
  elementParser: (el: unknown) => T
): Array<T> {
  if (!Array.isArray(array)) {
    throw new Error("Unexpected value of array property");
  }

  return array.map((e) => elementParser(e));
}

type NewPatientFields = {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
};

export const toNewPatient = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
}: NewPatientFields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(name, "name"),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn, "ssn"),
    gender: parseGender(gender),
    occupation: parseString(occupation, "occupation"),
  };

  return newPatient;
};

type NewBaseEntryFields = {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
};

const toNewBaseEntry = ({
  description,
  date,
  specialist,
  diagnosisCodes,
}: NewBaseEntryFields): NewBaseEntry => {
  const newBaseEntry = {
    description: parseString(description, "description"),
    date: parseDate(date),
    specialist: parseString(specialist, "specialist"),
    diagnosisCodes:
      diagnosisCodes &&
      parseArray<string>(diagnosisCodes, (code) => {
        return parseString(code, "diagnosisCodes[...]");
      }),
  };

  return newBaseEntry;
};

export const toNewEntry = (entry: NewEntry): NewEntry => {
  switch (entry.type) {
    case "HealthCheck":
      return {
        ...toNewBaseEntry(entry),
        type: entry.type,
        healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
      };
    case "OccupationalHealthcare":
      return {
        ...toNewBaseEntry(entry),
        type: entry.type,
        employerName: parseString(entry.employerName, "employerName"),
        sickLeave: entry.sickLeave
          ? {
              startDate: parseDate(entry.sickLeave.startDate),
              endDate: parseDate(entry.sickLeave.endDate),
            }
          : undefined,
      };
    case "Hospital":
      return {
        ...toNewBaseEntry(entry),
        type: entry.type,
        discharge: {
          date: parseDate(entry.discharge.date),
          criteria: parseString(entry.discharge.criteria, "criteria"),
        },
      };
    default:
      throw new Error(`Unhandled discriminated union member`);
  }
};

/*
type DiagnosisFields = {
  code: string;
  name: string;
  latin?: string;
};

const toDiagnosis = ({
  code,
  name,
  latin,
}: DiagnosisFields): Diagnosis => {
  const diagnosis: Diagnosis = {
    code: parseString(code, "code"),
    name: parseString(name, "name"),
    latin: latin && parseString(latin, "latin"),
  };

  return diagnosis;
};
*/
