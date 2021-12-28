import { DateTime } from "luxon";
import useSWR, { SWRResponse } from "swr";

export const ODEN_ENDPOINT = "https://api-staging.skolorna.com/v0/oden";

export interface Menu {
  id: string;
  title: string;
  slug: string;
  updated_at: string | null;
}

export async function getMenus(): Promise<Menu[]> {
  return fetch(`${ODEN_ENDPOINT}/menus`).then((res) => res.json());
}

/**
 * Fetch a menu from Oden.
 * @param id
 */
export async function getMenu(id: string): Promise<Menu | null> {
  const res = await fetch(`${ODEN_ENDPOINT}/menus/${id}`);

  if (res.status === 404) {
    return null;
  }

  return res.json();
}

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
  return useSWR(listDaysPath(opt), (path) =>
    fetch(`${ODEN_ENDPOINT}/${path}`).then((res) => res.json())
  );
}

export function useMenu(menu?: string): SWRResponse<Menu, unknown> {
  return useSWR(menu ? `/menus/${menu}` : null, async () => {
    const m = await getMenu(menu as string);

    if (!m) {
      throw new Error("menu not found");
    }

    return m;
  });
}
