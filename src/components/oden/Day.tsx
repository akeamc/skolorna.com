"use client";

import { Day as DayType } from "@/lib/oden";
import { FunctionComponent } from "react";
import Meal from "./Meal";
import classNames from "classnames";
import { DateTime } from "luxon";
import useHasSameComponent from "@/lib/useHasSameComponent";

const Day: FunctionComponent<{ day: DayType }> = ({ day }) => {
  const date = DateTime.fromISO(day.date);
  const isToday = useHasSameComponent(date, "day");

  return (
    <div key={day.date} className="border-b border-gray-200 py-4">
      <h2
        className={classNames(
          "relative text-sm  font-medium before:absolute before:-left-2 before:top-1/2 before:block before:h-1 before:w-1 before:rounded-full before:content-['']",
          isToday ? "text-blue-700 before:bg-blue-700" : "text-gray-500"
        )}
      >
        {date.toLocaleString(
          { weekday: "short", day: "numeric", month: "long" },
          { locale: "sv" }
        )}
      </h2>
      <ul>
        {day.meals.map((meal) => (
          <Meal key={meal.value} meal={meal} />
        ))}
      </ul>
    </div>
  );
};

export default Day;
