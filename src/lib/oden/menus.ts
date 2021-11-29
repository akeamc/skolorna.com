import useSWR, { SWRResponse } from "swr";

export interface Menu {
  id: string;
  title: string;
  slug: string;
  updated_at: string | null;
}

export async function getMenus(): Promise<Menu[]> {
  return fetch("https://api-staging.skolorna.com/v0/oden/menus").then((res) =>
    res.json()
  );
}

/**
 * Fetch a menu from Oden.
 * @param id
 */
export async function getMenu(id: string): Promise<Menu | null> {
  const res = await fetch(
    `https://api-staging.skolorna.com/v0/oden/menus/${id}`
  );

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

export async function getDays(menu: string): Promise<Day[]> {
  const res = await fetch(
    `https://api-staging.skolorna.com/v0/oden/menus/${menu}/days`
  );

  return res.json();
}

export function useDays(menu?: string): SWRResponse<Day[], unknown> {
  return useSWR(
    () => `/menus/${menu}/days`,
    () => getDays(menu ?? "")
  );
}
