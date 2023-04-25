"use client";

import { Day as DayType } from "@/lib/oden";
import { FunctionComponent, useEffect, useState } from "react";
import Meal from "./Meal";
import classNames from "classnames";
import { DateTime } from "luxon";

function useDate(interval = 1000): DateTime {
  const [date, setDate] = useState(DateTime.now);

  useEffect(() => {
    const i = setInterval(() => {
      setDate(DateTime.now);
    }, interval);

    return () => clearInterval(i);
  }, [interval]);

  return date;
}

const Day: FunctionComponent<{ day: DayType }> = ({ day }) => {
  const now = useDate();
  const formatter = new Intl.DateTimeFormat("sv", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const isToday = now.toISODate() === day.date;

  return (
    <div key={day.date} className="border-b border-gray-200 py-4">
      <h2
        className={classNames(
          "relative text-sm  font-medium before:absolute before:-left-2 before:top-1/2 before:block before:h-1 before:w-1 before:rounded-full before:content-['']",
          isToday ? "text-blue-700 before:bg-blue-700" : "text-gray-500"
        )}
      >
        {formatter.format(new Date(day.date))}
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
