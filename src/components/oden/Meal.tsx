import { Meal as MealType } from "@/lib/oden";
import { FunctionComponent, useState } from "react";
import ReviewDialog from "./ReviewDialog";
import Stars from "../stars/Stars";

const Meal: FunctionComponent<{
  menu: string;
  date: string;
  meal: MealType;
}> = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ReviewDialog open={open} setOpen={setOpen} {...props} />
      <button
        className="block w-full rounded-md p-1 text-left hover:bg-gray-100"
        onClick={() => setOpen(true)}
      >
        <h3 className="mb-1 text-base font-medium leading-tight tracking-tight sm:text-lg">
          {props.meal.value}
        </h3>
        <Stars filled={props.meal.rating || 0} />
      </button>
    </>
  );
};

export default Meal;
