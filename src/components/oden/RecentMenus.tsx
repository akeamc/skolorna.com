"use client";

import { useDays, useMenu } from "@/lib/oden";
import useHistory from "@/lib/useHistory";
import { DateTime } from "luxon";
import Link from "next/link";
import { FunctionComponent } from "react";
import { ArrowRight } from "react-feather";

const RecentMenu: FunctionComponent<{ id: string }> = ({ id }) => {
  const now = DateTime.now();
  const { data: menu } = useMenu(id);
  const { data: days } = useDays({
    menu: id,
    first: now.toISODate() || undefined,
    last: now.plus({ days: 7 }).toISODate() || undefined,
  });
  const day = days?.[0];

  return (
    <Link
      href={`/menyer/${id}`}
      className="h-full rounded-lg border border-gray-100 p-2 hover:bg-gray-50 transition-colors flex flex-col relative text-gray-500 group"
    >
      <h3 className="text-base font-medium text-gray-900">{menu?.title}</h3>
      <ul>
        {day?.meals.map((meal) => (
          <li key={meal.value} className="my-2 text-sm">
            {meal.value}
          </li>
        ))}
      </ul>
      {day && (
        <p className="mt-auto block font-medium text-xs tracking-wide">{DateTime.fromISO(day?.date).toLocaleString({weekday: "short", day: "numeric", month: "short"}, { locale: "sv" })}</p>
      )}
      <ArrowRight className="absolute bottom-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
    </Link>
  );
};

const RecentMenus: FunctionComponent = () => {
  const { value } = useHistory();
  const recent = Object.entries(value);
  recent.sort((a, b) => b[1] - a[1]);
  const ids = recent.map(([id, _]) => id);

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 my-4">
      {ids.slice(0, 3).map(id => (
        <li key={id}>
          <RecentMenu id={id} />
        </li>
      ))}
    </ul>
  );
};

export default RecentMenus;
