import useSWR, { SWRResponse } from "swr";
import { MENU_PROXY_URL } from ".";
import MicroSearch, { useMicroSearch } from "../search/micro-search";
import { Menu } from "./types";

export async function fetchMenus(): Promise<Menu[]> {
  const url = new URL("/menus", MENU_PROXY_URL);
  const res = await fetch(url.href);
  return res.json();
}

export async function fetchMenu(id: string): Promise<Menu> {
  const url = new URL(`/menus/${id}`, MENU_PROXY_URL);
  const res = await fetch(url.href);
  return res.json();
}

export function useMenus(): SWRResponse<Menu[], unknown> {
  return useSWR<Menu[]>("/menus", () => fetchMenus());
}

export function useMenuSearch(limit?: number) {
  const { data } = useMenus();

  return useMicroSearch<Menu>(data ?? [], "title", limit);
}
