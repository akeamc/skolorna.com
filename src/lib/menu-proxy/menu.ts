import useSWR, { SWRResponse } from "swr";
import { useMicroSearch } from "../search/micro-search";
import { menuProxyFetch } from "./fetch";
import { Menu } from "./types";

export async function fetchMenus(): Promise<Menu[]> {
  return menuProxyFetch<Menu[]>("/menus");
}

export async function fetchMenu(id: string): Promise<Menu> {
  return menuProxyFetch<Menu>(`/menus/${id}`);
}

export function useMenus(): SWRResponse<Menu[], unknown> {
  return useSWR<Menu[]>("/menus", () => fetchMenus());
}

export function useMenuSearch(limit?: number) {
  const { data } = useMenus();

  return useMicroSearch<Menu>(data ?? [], "title", limit);
}
