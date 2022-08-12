export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyExHours: Array<number>,
  target: number
): Result => {
  const average =
    dailyExHours.reduce((avg, dh) => avg + dh, 0) / dailyExHours.length;
  const rating = average - target > 1 ? 3 : average - target > 0 ? 2 : 1;
  let ratingDescription = "";

  switch (rating) {
    case 1:
      ratingDescription = "Try harder...";
      break;
    case 2:
      ratingDescription = "Well done";
      break;
    case 3:
      ratingDescription = "Amazing!";
      break;
    default:
      break;
  }

  return {
    periodLength: dailyExHours.length,
    trainingDays: dailyExHours.filter((dh) => dh > 0).length,
    target,
    average,
    success: average >= target,
    rating,
    ratingDescription,
  };
};
