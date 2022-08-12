import express from "express";
import { calculateBmi } from "./calculateBmi";
import { calculateExercises } from "./calculateExercises";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const weight = Number(req.query.weight);
  const height = Number(req.query.height);

  if (isNaN(weight) || isNaN(height)) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  return res.json({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (daily_exercises === undefined || target === undefined) {
    return res.status(400).json({
      error: "parameters missing",
    });
  }

  if (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    isNaN(target) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.length === 0 ||
    daily_exercises.filter((de: number) => isNaN(de)).length !== 0
  ) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  try {
    return res.json({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ...calculateExercises(daily_exercises, target),
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
