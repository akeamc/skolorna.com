import { Meal as MealType } from "@/lib/oden";
import { FunctionComponent, useState } from "react";
import ReviewDialog from "./ReviewDialog";

const Meal: FunctionComponent<{ meal: MealType }> = ({ meal }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <ReviewDialog open={open} setOpen={setOpen} meal={meal} />
      <h3 className="my-1 text-lg font-medium tracking-tight">{meal.value}</h3>
      <button
        className="text-sm font-medium text-gray-500"
        onClick={() => setOpen(true)}
      >
        Skriv en recension
      </button>
    </div>
  );
};

export default Meal;
