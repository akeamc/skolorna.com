import { MENU_PROXY_URL } from ".";

export async function menuProxyFetch<T>(path: string): Promise<T> {
  const url = new URL(path, MENU_PROXY_URL);

  const res = await fetch(url.href);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data: T = await res.json();

  return data;
}
