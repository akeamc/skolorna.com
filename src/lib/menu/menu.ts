import useSWR, { SWRResponse } from "swr";
import Fuse from "fuse.js";
import { menuProxyFetch } from "./fetch";
import { Menu } from "./types";

export async function fetchMenus(): Promise<Menu[]> {
  return menuProxyFetch<Menu[]>("/menus");
}

export async function fetchMenu(id: string): Promise<Menu> {
  return menuProxyFetch<Menu>(`/menus/${id}`);
}

export function useMenus(): SWRResponse<Menu[], unknown> {
  return useSWR<Menu[]>("/menus", () => fetchMenus(), {
    // Upwards of 1 megabyte (uncompressed) is transferred. Save the data!
    revalidateOnFocus: false,
  });
}

export function useMenu(id: string): SWRResponse<Menu, unknown> {
  return useSWR<Menu>(id ? `/menus/${id}` : null, () => fetchMenu(id));
}

export function useMenuFuse(): Fuse<Menu> | undefined {
  const { data: menus } = useMenus();
  // It is highly unlikely that the content of `menus` changes but the length doesn't, but you never know.
  // If you encounter strange issues, start by changing the key:
  const { data: fuse } = useSWR(
    () => menus?.length?.toString() ?? null,
    () => {
      if (!menus) {
        throw new Error("menus must be defiend");
      }

      return new Fuse(menus, { keys: ["title"], threshold: 0.3 });
    }
  );

  return fuse;
}
