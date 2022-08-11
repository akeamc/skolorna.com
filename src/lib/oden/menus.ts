import { DateTime } from "luxon";
import useSWR, { SWRResponse } from "swr";
import { request, requestOpt } from "./client";

export interface Menu {
  id: string;
  title: string;
  slug: string;
  updated_at: string | null;
}

export const getMenus = () => request<Menu[]>("/menus");

/**
 * Fetch a menu from Oden.
 * @param id
 */
export const getMenu = (id: string) => requestOpt<Menu>(`/menus/${id}`);

export interface Meal {
  value: string;
}

export interface Day {
  date: string;
  meals: Meal[];
}

export interface ListDaysOptions {
  menu?: string;
  first?: DateTime;
  last?: DateTime;
}

function listDaysPath({
  menu,
  first = DateTime.now(),
  last,
}: ListDaysOptions): string | null {
  if (!menu) {
    return null;
  }

  // eslint-disable-next-line no-param-reassign
  last = last ?? first.plus({ weeks: 4 });

  const searchParams = new URLSearchParams({
    first: first.toISODate(),
    last: last.toISODate(),
  });

  return `/menus/${menu}/days?${searchParams.toString()}`;
}

export function useDays(opt: ListDaysOptions): SWRResponse<Day[], unknown> {
  return useSWR(listDaysPath(opt), (path) => request(path));
}

export function useMenu(menu?: string): SWRResponse<Menu, unknown> {
  return useSWR(menu ? `/menus/${menu}` : null, (path) => request(path));
}
