interface TotalProps {
  numOfExercises: number;
}

const Total = ({ numOfExercises }: TotalProps) => {
  return (
    <div>
      <p>Number of exercises {numOfExercises}</p>
    </div>
  );
};

export default Total;
