import { DateTime } from "luxon";
import useSWR, { SWRResponse } from "swr";
import { menuProxyFetch } from "./fetch";
import { Day } from "./types";

export interface ListDaysQuery {
  menu: string;
  first?: DateTime;
  last?: DateTime;
}

function listDaysPath({
  menu,
  first = DateTime.now(),
  last,
}: ListDaysQuery): string {
  if (!menu) {
    throw new Error("menu id must be defined");
  }

  // eslint-disable-next-line no-param-reassign
  last = last ?? first.plus({ weeks: 4 });

  const searchParams = new URLSearchParams({
    first: first.toISODate(),
    last: last.toISODate(),
  });

  return `/menus/${menu}/days?${searchParams.toString()}`;
}

export function useDays(query: ListDaysQuery): SWRResponse<Day[], unknown> {
  return useSWR<Day[]>(
    () => listDaysPath(query),
    (path) => menuProxyFetch<Day[]>(path)
  );
}
