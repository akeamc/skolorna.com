import { DateTime } from "luxon";
import useSWR, { SWRResponse } from "swr";
import { MENU_PROXY_URL } from ".";
import { Day } from "./types";

export interface ListDaysQuery {
  menu: string;
  first?: DateTime;
  last?: DateTime;
}

function listDaysUrl({
  menu,
  first = DateTime.now(),
  last,
}: ListDaysQuery): URL {
  if (!menu) {
    throw new Error("menu id must be defined");
  }

  last = last ?? first.plus({ weeks: 4 });

  const searchParams = new URLSearchParams({
    first: first.toISODate(),
    last: last.toISODate(),
  });

  return new URL(
    `/menus/${menu}/days?${searchParams.toString()}`,
    MENU_PROXY_URL
  );
}

export function useDays(query: ListDaysQuery): SWRResponse<Day[], unknown> {
  return useSWR<Day[]>(
    () => listDaysUrl(query).href,
    (url) => fetch(url).then((res) => res.json())
  );
}
