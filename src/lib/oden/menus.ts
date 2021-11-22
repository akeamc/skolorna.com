export interface Menu {
  id: string;
  title: string;
  slug: string;
  updated_at: string;
}

export async function getMenus(): Promise<Menu[]> {
  return fetch("https://api-staging.skolorna.com/v0/oden/menus").then((res) =>
    res.json()
  );
}
