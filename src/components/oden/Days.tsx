"use client";

import { useDays } from "@/lib/oden";
import { FunctionComponent, useState } from "react";
import Day from "./Day";
import { DateTime } from "luxon";
import Spinner from "../Spinner";
import Scroller from "../Scroller";

const Days: FunctionComponent<{ menu: string }> = ({ menu }) => {
  const [cursor, setCursor] = useState(DateTime.now);
  const first = cursor.startOf("week");
  const last = cursor.endOf("week");

  const { data, isLoading } = useDays({
    menu,
    first: first.toISODate() || undefined,
    last: last.toISODate() || undefined,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 py-2">
        <Scroller
          onScroll={(weeks) => setCursor((c) => c.plus({ weeks }))}
          onReset={() => setCursor(DateTime.now())}
        />
        <h2 className="text-lg font-medium tracking-tight">
          Vecka {cursor.weekNumber} {cursor.year}
        </h2>
      </div>
      {data?.map((day) => (
        <Day day={day} key={day.date} />
      ))}
      {!data?.length && (
        <div className="flex h-64 flex-col items-center justify-center text-center text-sm font-medium text-gray-500 sm:h-96">
          {data?.length === 0 && (
            <p>
              Vi vet inte vad det {+last > +DateTime.now() ? "blir" : "blev"}{" "}
              till lunch.
            </p>
          )}
          {isLoading && <Spinner />}
        </div>
      )}
    </div>
  );
};

export default Days;
