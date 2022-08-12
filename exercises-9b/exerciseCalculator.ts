import { calculateExercises } from "./calculateExercises";

interface dailyExArgs {
  target: number;
  dailyHours: Array<number>;
}

const parseDailyExArgs = (args: Array<string>): dailyExArgs => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error("Provided target was not a number!");
  }

  const dailyHours = args.slice(3).map((dh) => {
    const num = Number(dh);
    if (!isNaN(num)) {
      return num;
    }
    throw new Error("Provided hours were not numbers!");
  });

  return {
    target,
    dailyHours,
  };
};

try {
  const { target, dailyHours } = parseDailyExArgs(process.argv);
  console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
