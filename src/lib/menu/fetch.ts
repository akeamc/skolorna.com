import urljoin from "url-join";

export async function menuProxyFetch<T>(path: string): Promise<T> {
  const res = await fetch(
    urljoin("https://api-staging.skolorna.com/v1/mp/", path)
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data: T = await res.json();

  return data;
}
