import assertNever from "../utils";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CoursePartWithDescription {
  type: "normal";
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartWithDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseRequirementsPart extends CoursePartWithDescription {
  type: "requirements";
  requirements: string[];
}

export type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseRequirementsPart;

interface PartProps {
  part: CoursePart;
}

interface ContentProps {
  courseParts: Array<CoursePart>;
}

const Part = ({ part }: PartProps) => {
  let output = "";
  switch (part.type) {
    case "normal":
      output = part.name + " " + part.exerciseCount;
      break;
    case "groupProject":
      output =
        part.name + " " + part.exerciseCount + " " + part.groupProjectCount;
      break;
    case "submission":
      output =
        part.name +
        " " +
        part.exerciseCount +
        " " +
        part.exerciseSubmissionLink;
      break;
    case "requirements":
      output = part.name + " " + part.exerciseCount + " " + part.requirements;
      break;
    default:
      return assertNever(part);
  }

  return <p>{output}</p>;
};

const Content = ({ courseParts }: ContentProps) => {
  return (
    <div>
      {courseParts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};

export default Content;
