import express from "express";
import patientService from "../services/patientService";
import { toNewPatient, toNewEntry } from "../utils";
import { Patient } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getPatients());
});

router.get("/:id", (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send();
  }
});

router.post("/", (req, res) => {
  try {
    const addedPatient = patientService.addPatient(toNewPatient(req.body));
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const patient = patientService.getPatient(req.params.id);
    if (!patient) {
      res.status(404).send("patient not found");
    }

    const addedEntry = patientService.addPatientEntry(
      toNewEntry(req.body),
      patient as Patient
    );
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
