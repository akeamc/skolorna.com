import { FunctionComponent } from "react";
import Star, { StarProps } from "./Star";

export interface RadioStarProps extends StarProps {}

const RadioStar: FunctionComponent<RadioStarProps> = ({ ...starProps }) => {
  return (
    <label className="flex items-center">
      <Star {...starProps} />
      <input className="hidden" type="radio" />
    </label>
  );
};

export default RadioStar;
