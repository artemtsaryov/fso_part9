import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Button, Typography } from "@material-ui/core";
import AddPatientEntryModal from "../AddPatientEntryModal";
import { PatientEntryFormValues } from "../AddPatientEntryModal/AddPatientEntryForm";

import { Patient, Entry, NewEntry } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, setPatient, addPatientEntry } from "../state";
import { assertNever, toHealthCheckRating } from "../utils";

const PatientPage = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patient =
    id && patients[id] && patients[id].ssn ? patients[id] : undefined;

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  React.useEffect(() => {
    if (!patient) {
      const retrievePatient = async () => {
        try {
          const { data: patient } = await axios.get<Patient>(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(setPatient(patient));
        } catch (e: unknown) {
          if (axios.isAxiosError(e)) {
            console.error(e?.response?.data || "Unrecognized axios error");
          } else {
            console.error("Unknown error", e);
          }
        }
      };

      void retrievePatient();
    }
  }, [patients, dispatch]);

  const submitNewPatientEntry = async (values: PatientEntryFormValues) => {
    try {
      const commonFields = {
        date: values.date,
        description: values.description,
        specialist: values.specialist,
        diagnosisCodes: values.diagnosisCodes,
      };

      let newEntry: NewEntry | null = null;

      switch (values.type) {
        case "HealthCheck":
          newEntry = {
            ...commonFields,
            type: "HealthCheck",
            healthCheckRating: toHealthCheckRating(values.healthCheckRating),
          };
          break;
        case "OccupationalHealthcare":
          newEntry = {
            ...commonFields,
            type: "OccupationalHealthcare",
            employerName: values.employerName,
            sickLeave: values.sickLeave.startDate
              ? values.sickLeave
              : undefined,
          };
          break;
        case "Hospital":
          newEntry = {
            ...commonFields,
            type: "Hospital",
            discharge: values.discharge,
          };
          break;
        default:
          break;
      }

      const { data: newPatientEntry } = await axios.post<Entry>(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${apiBaseUrl}/patients/${id}/entries`,
        newEntry
      );
      dispatch(addPatientEntry(newPatientEntry, id as string));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(
          String(e?.response?.data?.error) || "Unrecognized axios error"
        );
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const renderAdditionalEntryData = (entry: Entry) => {
    switch (entry.type) {
      case "HealthCheck":
        return (
          <div>
            <p>rating: {entry.healthCheckRating}</p>
          </div>
        );
      case "OccupationalHealthcare":
        return (
          <div>
            <p>employer: {entry.employerName}</p>
            {entry.sickLeave ? (
              <div>
                <p>
                  on sick leave from {entry.sickLeave.startDate} until{" "}
                  {entry.sickLeave.endDate}
                </p>
              </div>
            ) : null}
          </div>
        );
      case "Hospital":
        return (
          <div>
            <p>
              discharged {entry.discharge.date} with {entry.discharge.criteria}
            </p>
          </div>
        );
      default:
        return assertNever(entry);
    }
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient info
        </Typography>
        {patient ? (
          <div>
            <h2>{patient.name}</h2>
            <p>gender: {patient.gender}</p>
            <p>ssn: {patient.ssn}</p>
            <p>occupation: {patient.occupation}</p>
            <h3>entries</h3>
            <AddPatientEntryModal
              modalOpen={modalOpen}
              onSubmit={submitNewPatientEntry}
              error={error}
              onClose={closeModal}
            />
            <Button variant="contained" onClick={() => openModal()}>
              Add New Entry
            </Button>
            <div>
              {patient.entries.map((e) => {
                return (
                  <div key={e.id}>
                    <p>
                      {e.date} <i>{e.description}</i>
                    </p>
                    {e.diagnosisCodes ? (
                      <ul>
                        {e.diagnosisCodes.map((c) => (
                          <li key={c}>
                            {c} {diagnoses[c] ? diagnoses[c].name : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {renderAdditionalEntryData(e)}
                    <p>diagnose by {e.specialist}</p>
                    <hr />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p>loading...</p>
        )}
      </Box>
    </div>
  );
};

export default PatientPage;
