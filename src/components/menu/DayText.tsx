import { DateTime } from "luxon";
import React , { FunctionComponent } from "react";
import { Day } from "../../lib/menu-proxy/types";

export interface DayTextProps {
  day: Day;
}

const DayText: FunctionComponent<DayTextProps> = ({ day }) => {
  const date = DateTime.fromISO(day.date);
  const mealsText = day.meals.map((meal) => meal.value).join("; ");

  return (
    <span>
      {date.toLocaleString({
        month: "short",
        day: "numeric",
      })}
      :
      {" "}
      {mealsText}
    </span>
  );
};

export default DayText;
