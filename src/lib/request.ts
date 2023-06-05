import { decodeJwt } from "jose";
import { isError, requestToken } from "./auth/auth";

function isValid(token: string) {
  const { exp = 0 } = decodeJwt(token);
  return exp > Date.now() / 1000 + 60;
}

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken || !isValid(accessToken)) {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;
    const res = await requestToken({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    if (isError(res)) {
      return null;
    }
    localStorage.setItem("access_token", res.access_token);
    return res.access_token;
  }

  return accessToken;
}

export default async function request(
  input: RequestInfo | URL,
  init?: RequestInit,
  auth = true
): Promise<Response> {
  const accessToken = auth ? await getToken() : null;
  const headers = new Headers(init?.headers);
  if (accessToken) headers.append("Authorization", `Bearer ${accessToken}`);

  return fetch(input, {
    ...init,
    headers,
  });
}
