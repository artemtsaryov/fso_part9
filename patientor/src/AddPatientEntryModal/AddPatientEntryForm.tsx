import React from "react";
import { useStateValue } from "../state";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import {
  TextField,
  SelectField,
  DiagnosisSelection,
  selectHcrOptions,
} from "./FormField";

export type PatientEntryFormValues = {
  date: string;
  description: string;
  specialist: string;
  diagnosisCodes?: Array<string>;
  type: "HealthCheck" | "OccupationalHealthcare" | "Hospital";
  healthCheckRating: number;
  employerName: string;
  sickLeave: {
    startDate: string;
    endDate: string;
  };
  discharge: {
    date: string;
    criteria: string;
  };
};

interface Props {
  onSubmit: (values: PatientEntryFormValues) => void;
  onCancel: () => void;
}

export const AddPatientEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        type: "HealthCheck",
        date: "",
        description: "",
        specialist: "",
        diagnosisCodes: [],
        healthCheckRating: 0,
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        },
        discharge: {
          date: "",
          criteria: "",
        },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: {
          [field: string]: string | { [field: string]: string };
        } = {};

        if (!values.date) {
          errors.date = requiredError;
        }

        if (!values.description) {
          errors.description = requiredError;
        }

        if (!values.specialist) {
          errors.specialist = requiredError;
        }

        if (!values.type) {
          errors.type = requiredError;
        } else {
          switch (values.type) {
            case "HealthCheck":
              /* nothing to validate */
              break;
            case "OccupationalHealthcare":
              if (!values.employerName) {
                errors.employerName = requiredError;
              }
              if (values.sickLeave.startDate && !values.sickLeave.endDate) {
                errors.sickLeave = {
                  endDate: requiredError,
                };
              }
              if (values.sickLeave.endDate && !values.sickLeave.startDate) {
                errors.sickLeave = {
                  startDate: requiredError,
                };
              }
              break;
            case "Hospital":
              if (values.discharge.date && !values.discharge.criteria) {
                errors.discharge = {
                  criteria: requiredError,
                };
              }
              if (values.discharge.criteria && !values.discharge.date) {
                errors.discharge = {
                  date: requiredError,
                };
              }
              break;
            default:
              break;
          }
        }

        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form className="form ui">
            <SelectField
              label="Type"
              name="type"
              options={[
                { label: "HealthCheck", value: "HealthCheck" },
                {
                  label: "OccupationalHealthcare",
                  value: "OccupationalHealthcare",
                },
                { label: "Hospital", value: "Hospital" },
              ]}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            {values.type === "HealthCheck" && (
              <SelectField
                label="Health Check Rating"
                name="healthCheckRating"
                options={selectHcrOptions}
              />
            )}
            {values.type === "OccupationalHealthcare" && (
              <>
                <Field
                  label="EmployerName"
                  placeholder="EmployerName"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="Sick leave start"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.startDate"
                  component={TextField}
                />
                <Field
                  label="Sick leave end"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.endDate"
                  component={TextField}
                />
              </>
            )}
            {values.type === "Hospital" && (
              <>
                <Field
                  label="Discharge date"
                  placeholder="YYYY-MM-DD"
                  name="discharge.date"
                  component={TextField}
                />
                <Field
                  label="Discharge criteria"
                  placeholder="Discharge criteria"
                  name="discharge.criteria"
                  component={TextField}
                />
              </>
            )}
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPatientEntryForm;
