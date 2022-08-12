import patients from "../../data/patients";
import {
  NewPatient,
  NewEntry,
  Patient,
  Entry,
  NonSensitivePatient,
} from "../types";
import { v4 as uuidv4 } from "uuid";

const getPatients = (): Array<NonSensitivePatient> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

const addPatient = (newPatient: NewPatient): Patient => {
  const patient = { ...newPatient, id: uuidv4(), entries: [] };
  patients.push(patient);
  return patient;
};

const addPatientEntry = (newEntry: NewEntry, patient: Patient): Entry => {
  const entry = { ...newEntry, id: uuidv4() };
  patient.entries.push(entry);
  return entry;
};

export default {
  getPatients,
  getPatient,
  addPatient,
  addPatientEntry,
};
