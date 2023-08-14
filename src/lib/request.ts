export default async function request(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);

  return fetch(input, {
    ...init,
    headers,
  });
}
