export const ODEN_ENDPOINT = "https://api.skolorna.com/v0/oden";

export async function requestOpt<T>(path: string): Promise<T | null> {
  const res = await fetch(`${ODEN_ENDPOINT}${path}`);

  if (res.status === 404) return null;

  if (!res.ok) throw new Error(`got unsuccessful status code ${res.status}`);

  return res.json();
}

export async function request<T>(path: string): Promise<T> {
  const data = await requestOpt<T>(path);

  if (data === null) throw new Error("not found");

  return data;
}
