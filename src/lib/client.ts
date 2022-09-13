import { getAccessToken } from "./auth";

export async function authedFetch(
	url: string,
	init: RequestInit = {},
	minimumValidity?: number
): Promise<Response> {
	const token = await getAccessToken(minimumValidity);

	if (!token) throw new Error("not authenticated");

	init.headers = {
		...init.headers,
		authorization: `Bearer ${token}`
	};

	return fetch(url, init);
}
