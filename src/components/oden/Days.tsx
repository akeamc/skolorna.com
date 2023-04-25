"use client";

import { Day as DayType, Menu, ODEN_URL, useDays } from "@/lib/oden";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useState } from "react";
import Meal from "./Meal";
import Day from "./Day";
import { DateTime } from "luxon";
import { ArrowLeft, ArrowRight } from "react-feather";

const Days: FunctionComponent<{ menu: string }> = ({ menu }) => {
  const [cursor, setCursor] = useState(DateTime.now);
  const first = cursor.startOf("week").toISODate() || undefined;
  const last = cursor.endOf("week").toISODate() || undefined;

  const { data } = useDays({ menu, first, last });

  return (
    <div>
      <div className="flex gap-2 border-b border-gray-300 py-2">
        <div
          className="inline-flex rounded-lg text-sm font-medium shadow-sm"
          role="group"
        >
          <button
            type="button"
            className="rounded-l-lg border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus-visible:z-10 focus-visible:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-700 active:bg-gray-200"
            onClick={() => setCursor((c) => c.minus({ weeks: 1 }))}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="border-b border-t border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus-visible:z-10 focus-visible:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-700 active:bg-gray-200"
            onClick={() => setCursor(DateTime.now)}
          >
            I dag
          </button>
          <button
            type="button"
            className="rounded-r-lg border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus-visible:z-10 focus-visible:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-700 active:bg-gray-200"
            onClick={() => setCursor((c) => c.plus({ weeks: 1 }))}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <h2 className="text-lg font-medium tracking-tight">
          Vecka {cursor.weekNumber} {cursor.year}
        </h2>
      </div>
      {data?.map((day) => (
        <Day day={day} key={day.date} />
      ))}
    </div>
  );
};

export default Days;
