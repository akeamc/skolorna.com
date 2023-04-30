import { Meal as MealType } from "@/lib/oden";
import { FunctionComponent, useState } from "react";
import ReviewDialog from "./ReviewDialog";
import Stars from "../stars/Stars";

const Meal: FunctionComponent<{ meal: MealType }> = ({ meal }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-1">
      <ReviewDialog open={open} setOpen={setOpen} meal={meal} />
      <h3 className="text-lg font-medium tracking-tight">{meal.value}</h3>
      <button
        className="text-sm font-medium text-gray-500"
        onClick={() => setOpen(true)}
      >
        <Stars level={(meal.rating || 0) / 5} />
      </button>
    </div>
  );
};

export default Meal;
