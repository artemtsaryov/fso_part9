import { HealthCheckRating } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

export const toHealthCheckRating = (hcr: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(hcr)) {
    throw new Error("Incorrect or missing health check rating");
  }
  return hcr;
};
